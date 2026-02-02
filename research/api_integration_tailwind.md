# API統合とTailwind CSSの設定
**プロジェクト**: Windows Things3 ダッシュボード
**日付**: 2026-01-31
**担当**: リサーチエージェント

---

## エグゼクティブサマリー

本書では、API統合パターン（Fetch vs Axios、エラーハンドリング、リトライロジック）とWindows Things3ダッシュボードプロジェクト用のTailwind CSSの設定について、詳細なガイダンスを提供します。

---

## 1. API統合戦略

### 1.1 Fetch API vs Axios

#### 推奨事項：**ネイティブFetch API**

**根拠：**
1. ✅ **Next.js統合**: App Routerのキャッシュと再検証機能がネイティブの`fetch`で動作
2. ✅ **バンドルサイズ**: 0KB（ビルトイン）vs 13KB（Axios）
3. ✅ **サーバーコンポーネント**: React Server Componentsとの完全な互換性
4. ✅ **依存関係なし**: メンテナンス対象のパッケージが1つ減る
5. ✅ **モダンAPI**: AbortController、ストリーム等に対応

**Axiosが適している場合：**
- ❌ 複雑なインターセプター要件（認証トークンリフレッシュ）
- ❌ ビルトインのリトライロジックが必要（ただしfetchで実装可能）
- ❌ レガシーコードベースとの互換性

**本プロジェクト:** Next.js統合により、Fetch APIが明らかに有利です。

**情報源：**
- [Axios vs Fetch: A Practical Guide to Error Handling, Interceptors & Retry Strategies](https://dev.to/crit3cal/axios-vs-fetch-a-practical-guide-to-error-handling-interceptors-retry-strategies-2f1i)
- [Axios vs. Fetch (2025 update): Which should you use for HTTP requests?](https://blog.logrocket.com/axios-vs-fetch-2025/)
- [Comprehensive Guide to Data Fetching in Next.js](https://www.getfishtank.com/insights/comprehensive-guide-to-data-fetching-in-nextjs)

---

### 1.2 エラーハンドリング

#### 主な違い：Fetch vs Axios

**Fetch API：**
- ✅ ネットワークエラーのみスロー
- ❌ HTTPエラー（404、500等）ではスローしない
- ⚠️ `response.ok`または`response.status`を手動でチェック必須

**Axios：**
- ✅ HTTPエラー（2xx以外のレスポンス）で自動的にスロー
- ✅ よりシンプルなエラーハンドリング

#### 推奨Fetch APIエラーハンドリングパターン

```typescript
// lib/api/client.ts
export class APIError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    public data?: any
  ) {
    super(`API Error: ${status} ${statusText}`);
    this.name = 'APIError';
  }
}

export async function apiFetch<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    // Check for HTTP errors
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new APIError(response.status, response.statusText, errorData);
    }

    // Parse JSON response
    const data = await response.json();
    return data as T;

  } catch (error) {
    // Network errors (no internet, DNS failure, etc.)
    if (error instanceof TypeError) {
      throw new APIError(0, 'Network error', { message: 'Unable to reach server' });
    }

    // Re-throw APIError
    throw error;
  }
}

// Usage
try {
  const tasks = await apiFetch<Task[]>('/api/tasks/inbox');
} catch (error) {
  if (error instanceof APIError) {
    if (error.status === 404) {
      console.log('Resource not found');
    } else if (error.status === 500) {
      console.log('Server error');
    } else if (error.status === 0) {
      console.log('Network error - check internet connection');
    }
  }
}
```

#### エラー分類

| エラータイプ | ステータスコード | ユーザーメッセージ | アクション |
|------------|-------------|--------------|--------|
| **ネットワークエラー** | 0 | "サーバーに接続できません。インターネット接続を確認してください。" | リトライボタンを表示 |
| **見つかりません** | 404 | "リクエストされたリソースが見つかりません。" | ログして空の状態を表示 |
| **サーバーエラー** | 500-599 | "サーバーエラーです。後でもう一度お試しください。" | 自動リトライ（3回） |
| **認証不可** | 401 | "セッションの有効期限が切れました。もう一度ログインしてください。" | ログインページにリダイレクト |
| **アクセス禁止** | 403 | "このリソースへのアクセス権限がありません。" | サポートに連絡 |
| **タイムアウト** | - | "リクエストがタイムアウトしました。もう一度お試しください。" | リトライ |

---

### 1.3 リトライロジック

#### 推奨パターン：指数バックオフ

```typescript
// lib/api/retry.ts
interface RetryOptions {
  maxRetries?: number;
  initialDelay?: number;
  maxDelay?: number;
  shouldRetry?: (error: any) => boolean;
}

export async function fetchWithRetry<T>(
  url: string,
  options: RequestInit = {},
  retryOptions: RetryOptions = {}
): Promise<T> {
  const {
    maxRetries = 3,
    initialDelay = 1000,
    maxDelay = 10000,
    shouldRetry = (error) => {
      // Retry on network errors and 5xx server errors
      if (error instanceof APIError) {
        return error.status === 0 || error.status >= 500;
      }
      return true;
    },
  } = retryOptions;

  let lastError: any;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await apiFetch<T>(url, options);
    } catch (error) {
      lastError = error;

      // Don't retry if error is not retryable
      if (!shouldRetry(error)) {
        throw error;
      }

      // Don't retry on last attempt
      if (attempt === maxRetries - 1) {
        break;
      }

      // Calculate exponential backoff delay
      const delay = Math.min(initialDelay * Math.pow(2, attempt), maxDelay);

      console.log(`Retry attempt ${attempt + 1} after ${delay}ms`);
      await sleep(delay);
    }
  }

  throw lastError;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// 使用例
const tasks = await fetchWithRetry<Task[]>('/api/tasks/inbox', {}, {
  maxRetries: 3,
  initialDelay: 1000, // 1s、2s、4s
});
```

#### リトライすべきシーン

| シナリオ | リトライ? | 理由 |
|----------|--------|--------|
| ネットワークエラー | ✅ はい | 一時的な接続問題 |
| 500サーバーエラー | ✅ はい | サーバーが復帰する可能性 |
| 503サービス利用不可 | ✅ はい | サーバーが再起動中 |
| 429レート制限 | ✅ はい（長い遅延） | レート制限を尊重 |
| 404見つかりません | ❌ いいえ | リソースが存在しない |
| 400不正なリクエスト | ❌ いいえ | クライアントエラー（コード修正が必要） |
| 401認証不可 | ❌ いいえ | 認証が必要 |

---

### 1.4 タイムアウトハンドリング

```typescript
// lib/api/client.ts
export async function apiFetchWithTimeout<T>(
  url: string,
  options: RequestInit = {},
  timeout = 10000 // 10 seconds default
): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new APIError(response.status, response.statusText);
    }

    return await response.json();
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new APIError(0, 'Request timeout', { timeout });
    }

    throw error;
  }
}
```

**代替案（よりシンプル）：**
```typescript
// AbortSignal.timeoutを使用したモダンアプローチ（Node 18+、Chrome 103+）
const response = await fetch(url, {
  signal: AbortSignal.timeout(10000), // 10秒
});
```

---

### 1.5 モックモード実装

#### 環境変数ベースの切り替え

```typescript
// lib/api/config.ts
export const apiConfig = {
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000',
  mockMode: process.env.NEXT_PUBLIC_MOCK_MODE === 'true',
  timeout: 10000,
  maxRetries: 3,
};

// lib/api/tasks.ts
import { apiConfig } from './config';
import { mockInboxTasks } from '@/lib/mock/tasks';

export async function fetchInboxTasks(): Promise<Task[]> {
  // モックモードの場合はモックデータを返す
  if (apiConfig.mockMode) {
    console.log('🔧 モックモード：モックインボックスタスクを返却');
    await sleep(500); // ネットワーク遅延をシミュレート
    return mockInboxTasks;
  }

  // 実API呼び出し
  return fetchWithRetry<Task[]>(`${apiConfig.baseUrl}/api/tasks/inbox`);
}
```

#### モックデータ構造

```typescript
// lib/mock/tasks.ts
export const mockInboxTasks: Task[] = [
  {
    id: 'mock-1',
    title: 'Buy groceries',
    notes: 'Milk, eggs, bread',
    due_date: '2026-02-01',
    tags: ['shopping', 'errands'],
    status: 'open',
  },
  {
    id: 'mock-2',
    title: 'Write project proposal',
    notes: 'Include budget and timeline',
    due_date: '2026-01-31',
    tags: ['work', 'important'],
    status: 'open',
  },
  {
    id: 'mock-3',
    title: 'Call dentist',
    status: 'completed',
    tags: ['health'],
  },
];

export const mockTodayTasks: Task[] = [
  mockInboxTasks[1], // Due today
];

export const mockUpcomingTasks: Task[] = [
  mockInboxTasks[0], // Due tomorrow
];
```

---

### 1.6 ルートハンドラー（Next.js APIプロキシ）

#### ルートハンドラーを使用する理由

1. ✅ **セキュリティ**: Mac APIのURLをクライアントから隠す
2. ✅ **キャッシング**: Next.jsのキャッシング（ISR、オンデマンド再検証）を活用
3. ✅ **エラーハンドリング**: 集約されたエラー変換
4. ✅ **CORS**: CORS問題を回避
5. ✅ **モニタリング**: ログ/メトリクスを簡単に追加可能

#### 実装例

```typescript
// app/api/tasks/inbox/route.ts
import { NextResponse } from 'next/server';
import { fetchWithRetry } from '@/lib/api/retry';

const API_BASE_URL = process.env.API_BASE_URL!; // Server-side only

export async function GET() {
  try {
    const tasks = await fetchWithRetry<Task[]>(
      `${API_BASE_URL}/todos/inbox`,
      {},
      {
        maxRetries: 3,
        initialDelay: 1000,
      }
    );

    return NextResponse.json(tasks, {
      headers: {
        'Cache-Control': 'private, max-age=60', // 60秒キャッシュ
      },
    });
  } catch (error) {
    console.error('インボックスタスクの取得に失敗：', error);

    if (error instanceof APIError) {
      return NextResponse.json(
        { error: error.message, details: error.data },
        { status: error.status === 0 ? 502 : error.status }
      );
    }

    return NextResponse.json(
      { error: '内部サーバーエラー' },
      { status: 500 }
    );
  }
}

// タスク完了エンドポイント
export async function PUT(request: Request) {
  try {
    const { id } = await request.json();

    await fetchWithRetry(
      `${API_BASE_URL}/todos/${id}/complete`,
      { method: 'PUT' }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('タスク完了に失敗：', error);

    return NextResponse.json(
      { error: 'タスク完了に失敗しました' },
      { status: 500 }
    );
  }
}
```

---

### 1.7 クライアント側API統合（SWR）

```typescript
// hooks/useTasks.ts
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => {
  if (!res.ok) throw new Error('フェッチに失敗');
  return res.json();
});

export function useTasks() {
  const { data, error, mutate } = useSWR<Task[]>('/api/tasks/inbox', fetcher, {
    refreshInterval: 60000,        // 60秒ごとに自動更新
    revalidateOnFocus: true,       // ウィンドウフォーカス時に更新
    revalidateOnReconnect: true,   // 再接続時に更新
    dedupingInterval: 2000,        // 2秒以内のリクエストを重複排除
    errorRetryCount: 3,            // 失敗したリクエストを3回リトライ
    errorRetryInterval: 5000,      // リトライ間隔は5秒
  });

  // タスク完了のオプティミスティック更新
  const completeTask = async (taskId: string) => {
    // UIを楽観的に更新
    await mutate(
      (tasks) => tasks?.map((t) =>
        t.id === taskId ? { ...t, status: 'completed' } : t
      ),
      false // 即座に再検証しない
    );

    try {
      // サーバーにリクエスト送信
      await fetch('/api/tasks/complete', {
        method: 'PUT',
        body: JSON.stringify({ id: taskId }),
      });

      // サーバーと同期するため再検証
      mutate();
    } catch (error) {
      // エラー時はロールバック
      mutate();
      throw error;
    }
  };

  return {
    tasks: data ?? [],
    loading: !data && !error,
    error,
    refresh: mutate,
    completeTask,
  };
}
```

---

## 2. Tailwind CSSの設定

### 2.1 インストールとセットアップ

```bash
# Tailwind CSS v4をインストール
npm install tailwindcss@next @tailwindcss/postcss@next postcss
```

### 2.2 設定ファイル

#### tailwind.config.js

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // Things3インスパイアのカラーパレット
      colors: {
        primary: {
          DEFAULT: '#4A90E2',
          hover: '#357ABD',
          light: '#E8F4FD',
        },
        background: {
          main: '#FFFFFF',
          sidebar: '#F7F7F7',
          hover: '#F0F0F0',
          selected: '#E8F4FD',
        },
        border: {
          light: '#E5E5E5',
          medium: '#D1D1D1',
          divider: '#EBEBEB',
        },
        text: {
          primary: '#1C1C1E',
          secondary: '#6E6E73',
          tertiary: '#AEAEB2',
          disabled: '#C7C7CC',
        },
        status: {
          success: '#34C759',
          warning: '#FF9500',
          error: '#FF3B30',
          info: '#5AC8FA',
        },
        tag: {
          red: '#FF6B6B',
          orange: '#FFB366',
          yellow: '#FFE066',
          green: '#95E1D3',
          blue: '#83C5F7',
          purple: '#C4B5FD',
          pink: '#FDB5C8',
          gray: '#C7C7CC',
        },
      },

      // タイポグラフィ
      fontSize: {
        'xs': ['11px', { lineHeight: '1.2' }],
        'sm': ['13px', { lineHeight: '1.5' }],
        'base': ['15px', { lineHeight: '1.5' }],
        'lg': ['17px', { lineHeight: '1.2' }],
        'xl': ['22px', { lineHeight: '1.2' }],
        '2xl': ['28px', { lineHeight: '1.2' }],
      },

      fontWeight: {
        light: '300',
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
      },

      // スペーシング
      spacing: {
        'sidebar': '240px',
      },

      // ボーダー半径
      borderRadius: {
        'sm': '4px',
        'DEFAULT': '8px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
        'full': '9999px',
      },

      // シャドウ
      boxShadow: {
        'sm': '0 1px 3px rgba(0, 0, 0, 0.05)',
        'DEFAULT': '0 2px 8px rgba(0, 0, 0, 0.08)',
        'md': '0 4px 12px rgba(0, 0, 0, 0.1)',
        'lg': '0 8px 24px rgba(0, 0, 0, 0.12)',
        'xl': '0 20px 60px rgba(0, 0, 0, 0.2)',
      },

      // トランジション
      transitionDuration: {
        'DEFAULT': '150ms',
        'fast': '100ms',
        'slow': '300ms',
      },

      transitionTimingFunction: {
        'DEFAULT': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'bounce': 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      },
    },
  },
  plugins: [],
};
```

#### postcss.config.js

```javascript
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

#### src/styles/globals.css

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* カスタムフォントスタック */
@layer base {
  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
                 "Helvetica Neue", Arial, sans-serif,
                 "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
  }
}

/* カスタムユーティリティ */
@layer utilities {
  .text-balance {
    text-wrap: balance;
  }

  .no-scrollbar::-webkit-scrollbar {
    display: none;
  }

  .no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
}

/* コンポーネントクラス */
@layer components {
  /* サイドバーナビゲーション項目 */
  .sidebar-item {
    @apply flex items-center gap-3 px-3 py-2 rounded-md
           text-sm text-text-secondary font-medium
           transition-all duration-150
           hover:bg-background-hover
           border-l-3 border-transparent;
  }

  .sidebar-item.active {
    @apply bg-background-selected text-text-primary
           border-l-primary;
  }

  /* タスク項目 */
  .task-item {
    @apply flex items-start gap-3 p-4 border-b border-border-divider
           transition-all duration-150
           hover:bg-background-sidebar hover:shadow-sm
           cursor-pointer;
  }

  /* ボタンバリエーション */
  .btn-primary {
    @apply px-6 py-2.5 rounded-lg
           bg-primary text-white font-medium
           transition-all duration-150
           hover:bg-primary-hover hover:shadow-md
           active:scale-98
           disabled:opacity-50 disabled:cursor-not-allowed;
  }

  .btn-secondary {
    @apply px-6 py-2.5 rounded-lg
           bg-background-sidebar text-text-primary font-medium
           border border-border-medium
           transition-all duration-150
           hover:bg-background-hover hover:border-border-light
           active:scale-98;
  }

  /* フォーム入力 */
  .input {
    @apply w-full px-4 py-2 rounded-lg
           border border-border-medium
           bg-background-main text-text-primary
           placeholder:text-text-tertiary
           transition-all duration-150
           focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
           disabled:bg-background-sidebar disabled:cursor-not-allowed;
  }

  /* モーダルバックドロップ */
  .modal-backdrop {
    @apply fixed inset-0 z-40
           bg-black/30 backdrop-blur-sm
           transition-opacity duration-200;
  }

  /* モーダルコンテンツ */
  .modal-content {
    @apply fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50
           w-full max-w-lg p-6 rounded-xl
           bg-background-main shadow-xl
           transition-all duration-250;
  }

  /* タグバッジ */
  .tag-badge {
    @apply inline-flex items-center px-2.5 py-1 rounded-full
           text-xs font-medium
           bg-tag-blue text-white;
  }

  /* チェックボックス（カスタム） */
  .checkbox-custom {
    @apply w-5 h-5 rounded-full border-2 border-border-medium
           bg-background-main
           transition-all duration-200
           hover:border-border-light
           checked:bg-status-success checked:border-status-success;
  }
}
```

---

### 2.3 ベストプラクティス

#### コンポーネント再利用性

```typescript
// components/ui/Button.tsx
import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils'; // Utility for className merging

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          // Base styles
          'inline-flex items-center justify-center rounded-lg font-medium',
          'transition-all duration-150 active:scale-98',
          'disabled:opacity-50 disabled:cursor-not-allowed',

          // Variants
          variant === 'primary' && 'btn-primary',
          variant === 'secondary' && 'btn-secondary',
          variant === 'ghost' && 'hover:bg-background-hover',

          // Sizes
          size === 'sm' && 'px-3 py-1.5 text-sm',
          size === 'md' && 'px-6 py-2.5 text-base',
          size === 'lg' && 'px-8 py-3 text-lg',

          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

// 使用例
<Button variant="primary" size="md" onClick={handleClick}>
  タスク作成
</Button>
```

#### classNameマージ用ユーティリティ

```typescript
// lib/utils/cn.ts (classNameユーティリティ)
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// 依存関係をインストール
// npm install clsx tailwind-merge
```

---

### 2.4 レスポンシブデザイン

```typescript
// 例：レスポンシブサイドバー
<aside className="
  fixed left-0 top-0 h-full
  w-sidebar
  md:w-60
  sm:w-0 sm:hidden
  bg-background-sidebar border-r border-border-light
  transition-all duration-300
">
  {/* サイドバーコンテンツ */}
</aside>

// ブレークポイント
// sm: 640px
// md: 768px（タブレット - サイドバーが折りたたまれる）
// lg: 1024px（推奨最小幅）
// xl: 1280px
```

---

### 2.5 ダークモード（今後のフェーズ）

```javascript
// tailwind.config.js
module.exports = {
  darkMode: 'class', // クラス戦略でダークモード有効化
  theme: {
    extend: {
      colors: {
        // ダークモード色
        dark: {
          background: '#1C1C1E',
          surface: '#2C2C2E',
          border: '#38383A',
        },
      },
    },
  },
};

// 使用例
<div className="bg-background-main dark:bg-dark-background">
  コンテンツ
</div>
```

---

## 3. パフォーマンス最適化

### 3.1 CSSパージング（Tailwind v4では自動）

Tailwind v4は本番ビルドで未使用CSSを自動的に削除します。

**検証方法：**
```bash
npm run build
# .next/static/css/ でバンドルサイズを確認
```

### 3.2 コンポーネント遅延ロード

```typescript
// モーダルコンポーネントを遅延ロード
import dynamic from 'next/dynamic';

const TaskCreateModal = dynamic(
  () => import('@/components/tasks/TaskCreateForm'),
  {
    loading: () => <ModalSkeleton />,
    ssr: false, // クライアント専用コンポーネントはSSR無効化
  }
);
```

---

## 4. アクセシビリティ

### 4.1 フォーカス表示

```css
/* globals.css */
@layer base {
  *:focus-visible {
    @apply outline-none ring-2 ring-primary ring-offset-2 rounded;
  }

  *:focus {
    @apply outline-none;
  }
}
```

### 4.2 ARIAラベル

```typescript
// 例：アクセシブルなタスクチェックボックス
<input
  type="checkbox"
  checked={task.status === 'completed'}
  onChange={() => onToggle(task.id)}
  aria-label={`"${task.title}"を${task.status === 'completed' ? '未完了' : '完了'}にマーク`}
  className="checkbox-custom"
/>
```

---

## まとめ

### API統合推奨事項

| 項目 | 推奨事項 |
|--------|----------------|
| **HTTPクライアント** | ネイティブFetch API |
| **エラーハンドリング** | カスタムAPIErrorクラス + 手動ステータスチェック |
| **リトライロジック** | 指数バックオフ（3回リトライ、1s → 2s → 4s） |
| **タイムアウト** | AbortSignal.timeout(10000) |
| **モックモード** | 環境変数での切り替え |
| **プロキシレイヤー** | Next.js ルートハンドラー |
| **クライアント側フェッチ** | SWRとオプティミスティック更新 |

### Tailwind CSS推奨事項

| 項目 | 推奨事項 |
|--------|----------------|
| **バージョン** | Tailwind CSS v4 |
| **カラーパレット** | Things3インスパイア（青、グレー、緑） |
| **タイポグラフィ** | システムフォントスタック（macOSはSan Francisco、WindowsはSegoe UI） |
| **コンポーネント** | cn()ユーティリティで再利用可能 |
| **レスポンシブ** | モバイルファースト、md:ブレークポイントでサイドバー対応 |
| **アクセシビリティ** | フォーカスビジブルリング、セマンティックHTML |

---

## 情報源

- [Axios vs Fetch: A Practical Guide to Error Handling, Interceptors & Retry Strategies](https://dev.to/crit3cal/axios-vs-fetch-a-practical-guide-to-error-handling-interceptors-retry-strategies-2f1i)
- [Axios vs. Fetch (2025 update): Which should you use for HTTP requests?](https://blog.logrocket.com/axios-vs-fetch-2025/)
- [Next.js and Tailwind CSS 2025 Guide: Setup, Tips, and Best Practices](https://codeparrot.ai/blogs/nextjs-and-tailwind-css-2025-guide-setup-tips-and-best-practices)
- [Install Tailwind CSS with Next.js](https://tailwindcss.com/docs/guides/nextjs)
- [How to Set Up Tailwind CSS in Next.js: Complete Guide for 2025](https://dev.to/sudiip__17/how-to-set-up-tailwind-css-in-nextjs-complete-guide-for-2025-2232)

---

**次のステップ：**
1. Senior-Coderがリトライロジック付きの基本APIクライアントを実装
2. Senior-CoderがThing3のカラーパレットでTailwindを設定
3. Designerがカラーパレットがモックアップと一致することを確認
4. Architectがスプリント1タスクに組み込む

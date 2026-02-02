# Next.js 技術分析
**プロジェクト**: Windows Things3 Dashboard
**日付**: 2026-01-31
**リサーチャー**: Research Agent

---

## エグゼクティブサマリー

Windows Things3 Dashboardプロジェクトでは、Next.jsのルーティングアプローチとして**App Routerを強く推奨**します。本分析では、ルーティング戦略、データフェッチングパターン、ディレクトリ構造のベストプラクティス、環境変数管理について説明します。

---

## 1. App Router vs Pages Router

### 推奨: **App Router**

#### 本プロジェクトにおける主な利点

1. **デフォルトでServer Components**
   - クライアントサイドJavaScriptバンドルサイズの削減
   - 初期ページロードパフォーマンスの向上
   - ダッシュボードランディングページのSEO改善
   - React 18+の機能と整合

2. **優れたレイアウト管理**
   - ネストされたレイアウトの組み込みサポート（Sidebar + Header + Contentの構造に最適）
   - レイアウトコンポーネントがルート変更間で永続化
   - カスタム_app.jsや_document.jsが不要

3. **将来性のあるアーキテクチャ**
   - Vercelが2026年の全新規プロジェクトに公式推奨
   - 活発な開発と機能アップデート
   - React Server Componentsエコシステムとの優れた統合

4. **強化されたデータフェッチング**
   - 自動リクエスト重複排除機能を持つネイティブ`fetch` API
   - 組み込みキャッシング戦略
   - プログレッシブレンダリングのためのストリーミングとSuspenseサポート

#### Pages Routerを検討すべき場合

- レガシーメンテナンスプロジェクト（本プロジェクトのような新規プロジェクトには該当せず）
- Server Componentsパラダイムに不慣れなチーム（学習曲線の考慮）

### 移行パス

これは新規プロジェクトのため、初日からApp Routerで開始します。移行は不要です。

**情報源:**
- [Next.jsのApp Router vs Pages Router — 実践的な詳細ガイド](https://dev.to/shyam0118/app-router-vs-pages-router-in-nextjs-a-deep-practical-guide-341g)
- [Next.jsルーティング解説: App Router vs Page Router 2026](https://www.grapestechsolutions.com/blog/next-js-routing-app-router-vs-page-router/)
- [App vs Pagesルーターについての率直な意見](https://github.com/vercel/next.js/discussions/59373)

---

## 2. データフェッチング戦略

### 推奨アプローチ: **ハイブリッド戦略**

#### Server Components（デフォルト）

**用途:**
- 初期データロード（Inbox、Today、Areas）
- SEO重視のコンテンツ
- サーバーサイド専用操作（APIキーの使用）

**実装:**
```typescript
// app/inbox/page.tsx (Server Component)
async function getInboxTasks() {
  const res = await fetch(`${process.env.API_BASE_URL}/todos/inbox`, {
    cache: 'no-store', // 新鮮なデータのための動的レンダリング
  });
  return res.json();
}

export default async function InboxPage() {
  const tasks = await getInboxTasks();
  return <TaskList tasks={tasks} />;
}
```

**メリット:**
- クライアントにAPI URLを公開せずにバックエンドへ直接アクセス
- データフェッチングのためのJavaScriptをブラウザに送信しない
- React 18+での自動リクエスト重複排除

#### Client Components

**用途:**
- インタラクティブ機能（タスク完了チェックボックス、検索ボックス）
- リアルタイム更新（60秒ごとの自動更新）
- フォーム送信（タスク/プロジェクト作成）

**推奨パターン: Route Handlers + SWR/React Query**

```typescript
// app/api/tasks/route.ts (Route Handler)
export async function GET() {
  const res = await fetch(`${process.env.API_BASE_URL}/todos/inbox`);
  return Response.json(await res.json());
}

// components/tasks/TaskList.tsx (Client Component)
'use client';
import useSWR from 'swr';

export function TaskList() {
  const { data, error, mutate } = useSWR('/api/tasks', fetcher, {
    refreshInterval: 60000, // 60秒ごとに自動更新
  });

  // レンダリングロジック
}
```

**なぜRoute Handlersなのか？**
- クライアントサイドデータフェッチングのNext.js公式推奨
- API URLとシークレットをサーバーサイドに保持
- Next.jsキャッシングとの優れた統合

#### データフェッチングライブラリの推奨

**本プロジェクト向け: SWR (Stale-While-Revalidate)**

**根拠:**
- VercelがNext.js専用に開発
- 以下の組み込みサポート:
  - 自動再検証（60秒自動更新要件に最適）
  - リクエスト重複排除
  - フォーカス時再検証
  - 楽観的UI更新（タスク完了に必要）
- 軽量（< 5KB）
- 優れたTypeScriptサポート

**代替案: TanStack Query (React Query)**
- より機能豊富（複雑なキャッシング戦略に適している）
- 大きなバンドルサイズ
- 以下の高度な機能が必要な場合に推奨:
  - 無限スクロール
  - 複雑なキャッシュ無効化
  - クエリ依存関係

**決定: SWRを使用** - シンプルさとNext.js統合のため。

#### ストリーミングとプログレッシブレンダリング

**ローディング状態のためのSuspense使用:**

```typescript
// app/inbox/page.tsx
import { Suspense } from 'react';
import TaskList from '@/components/tasks/TaskList';
import TaskListSkeleton from '@/components/tasks/TaskListSkeleton';

export default function InboxPage() {
  return (
    <Suspense fallback={<TaskListSkeleton />}>
      <TaskList />
    </Suspense>
  );
}
```

**メリット:**
- 即座のページシェルレンダリング
- プログレッシブコンテンツロード
- より良い体感パフォーマンス

**情報源:**
- [はじめに: データフェッチング | Next.js](https://nextjs.org/docs/app/getting-started/fetching-data)
- [データフェッチングパターンとベストプラクティス | Next.js](https://nextjs.org/docs/14/app/building-your-application/data-fetching/patterns)
- [Next.jsでの使用 - SWR](https://swr.vercel.app/docs/with-nextjs)

---

## 3. ディレクトリ構造のベストプラクティス

### 推奨構造

```
projects/windows-2-things-3/
├── src/
│   ├── app/                      # App Router（ルート）
│   │   ├── layout.tsx            # ルートレイアウト（Sidebar + Header）
│   │   ├── page.tsx              # ホームページ（Inboxビュー）
│   │   ├── error.tsx             # エラーバウンダリ
│   │   ├── loading.tsx           # ローディングUI
│   │   ├── today/
│   │   │   └── page.tsx          # Todayビュー
│   │   ├── upcoming/
│   │   │   └── page.tsx          # Upcomingビュー
│   │   ├── search/
│   │   │   └── page.tsx          # 検索結果
│   │   ├── areas/
│   │   │   ├── page.tsx          # エリア一覧
│   │   │   └── [area_name]/
│   │   │       └── page.tsx      # エリア詳細
│   │   └── api/                  # Route Handlers（APIルート）
│   │       ├── health/
│   │       │   └── route.ts      # ヘルスチェックプロキシ
│   │       ├── tasks/
│   │       │   └── route.ts      # タスクCRUD操作
│   │       └── projects/
│   │           └── route.ts      # プロジェクト操作
│   │
│   ├── components/               # Reactコンポーネント
│   │   ├── layout/               # レイアウトコンポーネント
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── ConnectionStatus.tsx
│   │   ├── tasks/                # タスク関連コンポーネント
│   │   │   ├── TaskList.tsx
│   │   │   ├── TaskItem.tsx
│   │   │   ├── TaskDetail.tsx
│   │   │   └── TaskCreateForm.tsx
│   │   ├── projects/             # プロジェクトコンポーネント
│   │   │   ├── ProjectList.tsx
│   │   │   └── ProjectCreateForm.tsx
│   │   ├── ui/                   # 再利用可能なUIプリミティブ
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── SearchBox.tsx
│   │   │   └── Toast.tsx
│   │   └── shared/               # 共有ユーティリティ
│   │       ├── Loading.tsx
│   │       └── ErrorBoundary.tsx
│   │
│   ├── lib/                      # ビジネスロジック & ユーティリティ
│   │   ├── api/                  # APIクライアント抽象化
│   │   │   ├── client.ts         # ベースfetchラッパー
│   │   │   ├── tasks.ts          # タスクAPIメソッド
│   │   │   ├── projects.ts       # プロジェクトAPIメソッド
│   │   │   ├── areas.ts          # エリアAPIメソッド
│   │   │   └── health.ts         # ヘルスチェック
│   │   ├── mock/                 # 開発用モックデータ
│   │   │   ├── tasks.ts
│   │   │   ├── areas.ts
│   │   │   └── projects.ts
│   │   ├── types/                # TypeScript型定義
│   │   │   ├── task.ts
│   │   │   ├── project.ts
│   │   │   └── api.ts
│   │   └── utils/                # ヘルパー関数
│   │       ├── date.ts
│   │       ├── validation.ts
│   │       └── format.ts
│   │
│   ├── hooks/                    # カスタムReact Hooks
│   │   ├── useTasks.ts           # タスクデータフェッチング
│   │   ├── useAutoRefresh.ts     # 自動更新ロジック
│   │   ├── useAreas.ts           # エリアデータ
│   │   ├── useSearch.ts          # 検索機能
│   │   ├── useHealthCheck.ts     # ヘルス監視
│   │   └── useTaskCreate.ts      # タスク作成
│   │
│   └── styles/                   # グローバルスタイル
│       └── globals.css           # Tailwindインポート + カスタムCSS
│
├── public/                       # 静的アセット
│   ├── icons/
│   └── images/
│
├── .env.local                    # ローカル環境変数（gitignore）
├── .env.example                  # 環境変数テンプレート
├── next.config.js                # Next.js設定
├── tailwind.config.js            # Tailwind CSS設定
├── tsconfig.json                 # TypeScript設定
├── package.json
└── README.md
```

### 主な組織原則

1. **`src/`ディレクトリを使用**
   - よりクリーンなルートディレクトリ
   - 関心の分離の改善
   - 2026年の業界標準

2. **組織化のためのRoute Groups**
   - URLに影響を与えずに論理的なグループ化のため`(marketing)`、`(dashboard)`を使用
   - シンプルなルーティング構造には不要

3. **コロケーション戦略**
   - コンポーネントは`app/`ディレクトリ内のルート近くに配置可能
   - **当プロジェクトの選択**: ルート間での再利用性のため、集中化された`components/`

4. **機能ベースの組織化**（代替案）
   - `features/tasks/`、`features/projects/`を好むチームもある
   - **当プロジェクトの選択**: ナビゲーションの容易さのため、コンポーネントタイプ別組織化（tasks/、projects/）

**情報源:**
- [はじめに: プロジェクト構造 | Next.js](https://nextjs.org/docs/app/getting-started/project-structure)
- [Next.js 15 2025を整理するベストプラクティス](https://dev.to/bajrayejoon/best-practices-for-organizing-your-nextjs-15-2025-53ji)
- [App Router内部: Next.jsファイルとディレクトリ構造のベストプラクティス（2025年版）](https://medium.com/better-dev-nextjs-react/inside-the-app-router-best-practices-for-next-js-file-and-directory-structure-2025-edition-ed6bc14a8da3)

---

## 4. 環境変数管理

### 設定ファイル

#### `.env.local`（Gitignore - ローカル開発）

```bash
# API設定
NEXT_PUBLIC_API_BASE_URL=http://100.64.1.123:8000  # 実際のTailscale IPに置き換え

# 開発設定
NEXT_PUBLIC_MOCK_MODE=false                         # モックデータの場合はtrueに設定
NEXT_PUBLIC_AUTO_REFRESH_INTERVAL=60000            # ミリ秒単位で60秒

# 内部API（Route Handlers） - クライアントに公開されない
API_BASE_URL=http://100.64.1.123:8000              # サーバーサイドのみで使用
API_TIMEOUT=10000                                  # 10秒
API_MAX_RETRIES=3
```

#### `.env.example`（Gitにコミット - テンプレート）

```bash
# このファイルを.env.localにコピーして値を入力してください

# Mac APIサーバーURL（Tailscale IP）
NEXT_PUBLIC_API_BASE_URL=http://YOUR_MAC_TAILSCALE_IP:8000

# 開発モード
NEXT_PUBLIC_MOCK_MODE=false

# 自動更新間隔（ミリ秒）
NEXT_PUBLIC_AUTO_REFRESH_INTERVAL=60000

# 内部API設定（サーバーサイドのみ）
API_BASE_URL=http://YOUR_MAC_TAILSCALE_IP:8000
API_TIMEOUT=10000
API_MAX_RETRIES=3
```

### 環境変数の命名規則

1. **`NEXT_PUBLIC_*`プレフィックス**
   - ブラウザに公開（クライアントサイド）
   - 用途: クライアントコンポーネントで必要なAPI URL
   - **セキュリティ注意**: ここにシークレット（APIキー、トークン）を配置しない

2. **プレフィックスなし**
   - サーバーサイドのみ
   - 用途: 内部API設定、シークレット
   - Server ComponentsとRoute Handlersでアクセス可能

### ベストプラクティス

1. **セキュリティ**
   - `.env.local`をGitにコミットしない
   - `.env*.local`を`.gitignore`に追加
   - 開発/ステージング/本番で異なるTailscale IPを使用

2. **型安全性**

```typescript
// lib/config.ts
export const config = {
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000',
    timeout: Number(process.env.API_TIMEOUT) || 10000,
    maxRetries: Number(process.env.API_MAX_RETRIES) || 3,
  },
  features: {
    mockMode: process.env.NEXT_PUBLIC_MOCK_MODE === 'true',
    autoRefreshInterval: Number(process.env.NEXT_PUBLIC_AUTO_REFRESH_INTERVAL) || 60000,
  },
} as const;

// 型安全なアクセス
import { config } from '@/lib/config';
const url = config.api.baseUrl; // TypeScriptオートコンプリートが機能
```

3. **ランタイム検証**

```typescript
// lib/config.ts
function validateConfig() {
  const required = ['NEXT_PUBLIC_API_BASE_URL'];
  const missing = required.filter(key => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}

validateConfig();
```

### README.mdセットアップ手順

```markdown
## 環境セットアップ

1. 環境変数テンプレートをコピー:
   ```bash
   cp .env.example .env.local
   ```

2. `.env.local`を編集してプレースホルダーを置き換え:
   - `YOUR_MAC_TAILSCALE_IP`: MacのTailscale IPを`tailscale ip`で確認
   - ポートは`8000`のまま（デフォルトのFastAPIポート）

3. Mac APIサーバーなしで開発する場合:
   ```bash
   NEXT_PUBLIC_MOCK_MODE=true
   ```

4. 設定を確認:
   ```bash
   npm run dev
   ```
   ブラウザコンソールで接続状態を確認。
```

**情報源:**
- [Next.js環境変数ドキュメント](https://nextjs.org/docs/app/getting-started/project-structure)
- 2026年の記事からのコミュニティベストプラクティス

---

## 5. 追加の推奨事項

### TypeScript設定

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "jsx": "preserve",
    "module": "esnext",
    "moduleResolution": "bundler",
    "strict": true,
    "noEmit": true,
    "incremental": true,
    "esModuleInterop": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### ESLint + Prettier設定

**インストール:**
```bash
npm install -D eslint prettier eslint-config-prettier eslint-plugin-react
```

**.eslintrc.json:**
```json
{
  "extends": ["next/core-web-vitals", "prettier"],
  "rules": {
    "react/no-unescaped-entities": "off",
    "@next/next/no-page-custom-font": "off"
  }
}
```

**.prettierrc:**
```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100
}
```

### パフォーマンス最適化

1. **モーダルの遅延ロード**
```typescript
import dynamic from 'next/dynamic';

const TaskCreateModal = dynamic(() => import('@/components/tasks/TaskCreateForm'), {
  loading: () => <ModalSkeleton />,
});
```

2. **画像最適化**
```typescript
import Image from 'next/image';

<Image src="/icons/task.svg" alt="Task" width={24} height={24} />
```

3. **ルートプリフェッチ**
```typescript
import Link from 'next/link';

<Link href="/today" prefetch={true}>Today</Link>
```

---

## 結論

**実装のための主要な決定事項:**

1. ✅ **App Routerを使用**（Pages Routerではなく）
2. ✅ **Server Components**で初期データロード
3. ✅ **Client Components + SWR**でインタラクティブ機能
4. ✅ **Route Handlers**でクライアントサイドAPIプロキシ
5. ✅ **`src/`ディレクトリ**と機能ベースの組織化
6. ✅ **`.env.local`**で環境設定
7. ✅ **TypeScript strictモード**とパスエイリアス

このアーキテクチャは以下を提供:
- 最適なパフォーマンス（Server Componentsがバンドルサイズを削減）
- 開発者体験（明確な組織化、型安全性）
- 保守性（モジュラー構造、明確なデータフロー）
- スケーラビリティ（新機能の追加が容易）

---

**次のステップ:**
1. Architectがこの分析に基づいて詳細な実装計画を作成
2. Senior-Coderが推奨構造でプロジェクトスキャフォールディングをセットアップ
3. Designerがディレクトリ組織化に合ったUIコンポーネントを提供

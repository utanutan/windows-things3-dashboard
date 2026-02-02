# 技術推奨事項サマリー
**プロジェクト**: Windows Things3 Dashboard
**日付**: 2026-01-31
**リサーチャー**: Research Agent

---

## エグゼクティブサマリー

本ドキュメントは、Windows Things3 Dashboardプロジェクトの実行可能な推奨事項として、すべての調査結果を統合したものです。これらの推奨事項は、Next.jsアーキテクチャ、Things3 UIデザイン、状態管理オプション、API統合パターン、テスト戦略の包括的な分析に基づいています。

---

## 1. 技術スタック（最終推奨事項）

### コアフレームワーク

| コンポーネント | 推奨 | 理由 |
|-----------|----------------|-----------|
| **フレームワーク** | Next.js 15 (App Router) | モダンアーキテクチャ、Server Components、将来性 |
| **言語** | TypeScript (strictモード) | 型安全性、優れたDX、ランタイムエラーの削減 |
| **スタイリング** | Tailwind CSS v4 | ミニマルCSS、Things3風デザインシステム、高速イテレーション |
| **状態管理** | Zustand + SWR | シンプルAPI、優れたパフォーマンス、最小限のボイラープレート |
| **テスト** | Jest + RTL + Playwright | 包括的カバレッジ、業界標準、Next.js組み込みサポート |
| **パッケージマネージャー** | npm | ネイティブNext.jsサポート、ロックファイルの安定性 |

### 依存関係

**コア:**
```json
{
  "dependencies": {
    "next": "^15.0.0",
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "zustand": "^4.5.0",
    "swr": "^2.2.0",
    "@heroicons/react": "^2.1.0"
  },
  "devDependencies": {
    "typescript": "^5.3.0",
    "tailwindcss": "^4.0.0",
    "@types/react": "^18.3.0",
    "jest": "^29.7.0",
    "@testing-library/react": "^14.1.0",
    "@playwright/test": "^1.40.0",
    "eslint": "^8.56.0",
    "prettier": "^3.1.0"
  }
}
```

---

## 2. アーキテクチャの決定

### 2.1 Next.js App Router

**決定: App Routerを使用（Pages Routerではなく）**

**本プロジェクトの主な利点:**
- ✅ Server ComponentsがクライアントサイドのJavaScriptを削減
- ✅ 組み込みレイアウト（Sidebar + Header構造に最適）
- ✅ より良い体感パフォーマンスのためのストリーミングとSuspense
- ✅ 将来性（2026年の公式推奨）

**実装:**
```
src/app/
├── layout.tsx          # ルートレイアウト（Sidebar + Header）
├── page.tsx            # Inboxビュー（デフォルトルート）
├── today/page.tsx      # Todayビュー
├── search/page.tsx     # 検索結果
└── areas/
    ├── page.tsx        # エリア一覧
    └── [area_name]/page.tsx  # エリア詳細
```

### 2.2 データフェッチング戦略

**決定: ハイブリッドアプローチ（Server Components + SWR）**

**アーキテクチャ:**
```
┌─────────────────────────────────────────┐
│ データレイヤー          │ ソリューション     │
├─────────────────────────┼───────────────┤
│ 初期ページロード        │ Server Comp   │
│ 自動更新（60秒）        │ SWR           │
│ 楽観的更新             │ SWR mutate    │
│ 検索                   │ SWR           │
│ フォーム送信           │ Route Handler │
└─────────────────────────────────────────┘
```

**なぜReact QueryではなくSWRなのか？**
- バンドルサイズが小さい（~4KB vs ~12KB）
- VercelがNext.js用に構築
- 自動更新要件に最適
- ユースケースに対してよりシンプルなAPI

**例:**
```typescript
// Server Component（初期ロード）
async function InboxPage() {
  const tasks = await fetchInboxTasks(); // サーバーサイド
  return <TaskList initialData={tasks} />;
}

// Client Component（自動更新）
'use client';
function TaskList({ initialData }) {
  const { data, mutate } = useSWR('/api/tasks/inbox', fetcher, {
    fallbackData: initialData,
    refreshInterval: 60000, // 60秒自動更新
  });

  // 楽観的更新
  const completeTask = async (id) => {
    mutate(optimisticUpdate(id), false); // UIを即座に更新
    await api.completeTask(id);          // サーバーに送信
    mutate();                            // 再検証
  };
}
```

### 2.3 状態管理

**決定: クライアント状態にZustand、サーバー状態にSWR**

**Zustandのユースケース:**
- UI状態（サイドバー折りたたみ、モーダル開閉）
- 選択されたビュー（Inbox、Today、Upcoming）
- 検索クエリ（デバウンス付き）
- 一時的なクライアントサイドデータ

**SWRのユースケース:**
- タスクデータ（Inbox、Today、Upcoming）
- エリア/プロジェクトデータ
- 検索結果
- 自動更新

**なぜContext APIではないのか？**
- ❌ 頻繁な更新でのパフォーマンス問題（タスク完了、自動更新）
- ❌ 手動メモ化が必要
- ❌ 任意の変更で全コンシューマーが再レンダリング

**なぜJotaiではないのか？**
- ⚠️ アトミックモデルが不要な複雑さを追加
- ⚠️ Zustandより小さいコミュニティ
- ✅ 後で細かい反応性が必要な場合は良い選択

**実装:**
```typescript
// stores/uiStore.ts（Zustand）
export const useUIStore = create<UIStore>((set) => ({
  sidebarCollapsed: false,
  selectedView: 'inbox',
  searchQuery: '',
  taskModalOpen: false,

  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  setSelectedView: (view) => set({ selectedView: view }),
  setSearchQuery: (query) => set({ searchQuery: query }),
}));

// hooks/useTasks.ts（SWR）
export function useTasks(view: 'inbox' | 'today') {
  const { data, error, mutate } = useSWR(`/api/tasks/${view}`, fetcher, {
    refreshInterval: 60000,
  });

  return {
    tasks: data ?? [],
    loading: !data && !error,
    error,
    refresh: mutate,
  };
}
```

---

## 3. デザインシステム

### 3.1 カラーパレット（Things3風）

**Tailwind設定:**
```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
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
        text: {
          primary: '#1C1C1E',
          secondary: '#6E6E73',
          tertiary: '#AEAEB2',
        },
        status: {
          success: '#34C759',
          warning: '#FF9500',
          error: '#FF3B30',
        },
      },
      fontSize: {
        'xs': '11px',
        'sm': '13px',
        'base': '15px',
        'lg': '17px',
        'xl': '22px',
      },
      spacing: {
        'sidebar': '240px',
      },
    },
  },
};
```

### 3.2 タイポグラフィ

**フォントスタック:**
```css
font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
```

これにより以下を保証:
- macOS: San Francisco（Things3のネイティブフォント）
- Windows: Segoe UI（Windows 11のネイティブフォント）

### 3.3 レイアウト寸法

| 要素 | サイズ | 備考 |
|---------|------|-------|
| サイドバー幅 | 240px | 固定 |
| タスクアイテム高さ | 48px+ | メモ/タグで可変 |
| コンテンツパディング | 32px | デスクトップ |
| ボーダー半径 | 8px | ボタン、カード |
| チェックボックスサイズ | 20px | 円形 |
| アイコンサイズ | 16px（サイドバー）、20px（ボタン） | Heroicons |

---

## 4. API統合

### 4.1 アーキテクチャ

**決定: プロキシレイヤーとしてRoute Handlersを使用**

**なぜ直接クライアントサイドAPIコールではないのか？**
- ❌ クライアントにMac API URLを公開（セキュリティ懸念）
- ❌ TailscaleでのCORS問題
- ❌ Next.jsキャッシング機能を使用できない

**アーキテクチャ:**
```
クライアント（ブラウザ）
  ↓ fetch('/api/tasks/inbox')
Route Handler（Next.js API）
  ↓ fetch('http://MAC_IP:8000/todos/inbox')
Mac APIサーバー（FastAPI）
  ↓ Things3データベースクエリ
レスポンス
```

**実装:**
```typescript
// app/api/tasks/inbox/route.ts
export async function GET() {
  const res = await fetch(`${process.env.API_BASE_URL}/todos/inbox`, {
    next: { revalidate: 60 }, // 60秒キャッシュ
  });

  if (!res.ok) {
    return Response.json({ error: 'Failed to fetch tasks' }, { status: 502 });
  }

  return Response.json(await res.json());
}
```

### 4.2 エラーハンドリング & リトライロジック

**決定: カスタムラッパー付きfetchを使用**

**なぜAxiosではないのか？**
- ✅ Next.js組み込みキャッシングがネイティブ`fetch`で動作
- ✅ バンドルサイズが小さい（0KB vs ~13KB）
- ✅ より良いServer Components統合
- ⚠️ 手動リトライロジックが必要（しかし実装は簡単）

**実装:**
```typescript
// lib/api/client.ts
export async function fetchWithRetry(
  url: string,
  options: RequestInit = {},
  retries = 3
): Promise<Response> {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url, {
        ...options,
        signal: AbortSignal.timeout(10000), // 10秒タイムアウト
      });

      if (!res.ok && i < retries - 1) {
        await sleep(1000 * Math.pow(2, i)); // 指数バックオフ
        continue;
      }

      return res;
    } catch (error) {
      if (i === retries - 1) throw error;
      await sleep(1000 * Math.pow(2, i));
    }
  }
  throw new Error('Max retries reached');
}
```

### 4.3 環境変数

```bash
# .env.local（gitignore）
NEXT_PUBLIC_API_BASE_URL=http://100.64.1.123:8000  # クライアントサイド
API_BASE_URL=http://100.64.1.123:8000              # サーバーサイド
NEXT_PUBLIC_MOCK_MODE=false
NEXT_PUBLIC_AUTO_REFRESH_INTERVAL=60000
```

**セキュリティ:**
- ✅ サーバーサイドURLは`API_BASE_URL`を使用（クライアントに公開されない）
- ✅ クライアントサイドは`/api/*`のみ必要（Next.jsルート）
- ✅ APIキー（後で追加する場合）はサーバーサイドに留まる

---

## 5. テスト戦略

### 5.1 テストピラミッド

```
     /\
    /E2E\          Playwright（3-5フロー）
   /──────\
  /  API   \       MSW（モックAPIレスポンス）
 /──────────\
/  Component \     React Testing Library
──────────────
    Unit          Jest（ユーティリティ、ロジック）
```

### 5.2 カバレッジ目標

| レイヤー | ツール | カバレッジ目標 |
|-------|------|-----------------|
| ユニットテスト | Jest | 80%行 |
| コンポーネントテスト | RTL | 70% |
| E2Eテスト | Playwright | 3-5クリティカルフロー |

### 5.3 クリティカルE2Eフロー

1. **タスク完了フロー**
   - Inboxロード → タスクチェック → 完了確認 → リロード → まだ完了

2. **タスク作成フロー**
   - モーダル開く → フォーム入力 → 送信 → リストで確認

3. **検索フロー**
   - クエリ入力 → 結果表示 → クリア → 完全リスト復元

4. **自動更新フロー**
   - 60秒待機 → データ更新 → 手動更新動作

5. **ナビゲーションフロー**
   - Inbox → Today → Areas → Projects（すべて正しくロード）

### 5.4 CI/CD

```yaml
# .github/workflows/test.yml
- すべてのpushでユニットテスト
- mainへのPRでE2Eテスト
- Codecovへのカバレッジレポート
- Playwrightビジュアルリグレッションテスト
```

---

## 6. プロジェクト構造（最終版）

```
projects/windows-2-things-3/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx
│   │   ├── page.tsx            # Inbox（デフォルト）
│   │   ├── today/page.tsx
│   │   ├── search/page.tsx
│   │   ├── areas/
│   │   │   ├── page.tsx
│   │   │   └── [area_name]/page.tsx
│   │   └── api/                # Route Handlers
│   │       ├── tasks/
│   │       │   ├── inbox/route.ts
│   │       │   ├── today/route.ts
│   │       │   └── [id]/complete/route.ts
│   │       ├── projects/route.ts
│   │       └── health/route.ts
│   │
│   ├── components/
│   │   ├── layout/             # レイアウトコンポーネント
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── ConnectionStatus.tsx
│   │   ├── tasks/              # タスクコンポーネント
│   │   │   ├── TaskList.tsx
│   │   │   ├── TaskItem.tsx
│   │   │   ├── TaskDetail.tsx
│   │   │   └── TaskCreateForm.tsx
│   │   ├── projects/
│   │   │   └── ProjectCreateForm.tsx
│   │   ├── ui/                 # 再利用可能UI
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── SearchBox.tsx
│   │   │   └── Toast.tsx
│   │   └── shared/
│   │       ├── Loading.tsx
│   │       └── ErrorBoundary.tsx
│   │
│   ├── lib/
│   │   ├── api/                # APIクライアント
│   │   │   ├── client.ts       # ベースfetchラッパー
│   │   │   ├── tasks.ts
│   │   │   ├── projects.ts
│   │   │   └── areas.ts
│   │   ├── mock/               # モックデータ
│   │   │   ├── tasks.ts
│   │   │   └── areas.ts
│   │   ├── types/              # TypeScript型
│   │   │   ├── task.ts
│   │   │   ├── project.ts
│   │   │   └── api.ts
│   │   └── utils/              # ユーティリティ
│   │       ├── date.ts
│   │       └── validation.ts
│   │
│   ├── hooks/                  # カスタムフック
│   │   ├── useTasks.ts         # SWRフック
│   │   ├── useAutoRefresh.ts
│   │   ├── useSearch.ts
│   │   └── useHealthCheck.ts
│   │
│   ├── stores/                 # Zustandストア
│   │   └── uiStore.ts
│   │
│   └── styles/
│       └── globals.css
│
├── e2e/                        # Playwrightテスト
│   ├── tests/
│   │   ├── task-completion.spec.ts
│   │   └── task-creation.spec.ts
│   └── pages/                  # Page Object Models
│       └── inbox.page.ts
│
├── __tests__/                  # Jestテスト
│   ├── components/
│   ├── hooks/
│   └── lib/
│
├── public/                     # 静的アセット
├── .env.local                  # Gitignore
├── .env.example                # テンプレート
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
├── jest.config.js
├── playwright.config.ts
└── README.md
```

---

## 7. 開発ワークフロー

### 7.1 セットアップ

```bash
# 1. 依存関係をインストール
npm install

# 2. 環境変数テンプレートをコピー
cp .env.example .env.local

# 3. .env.localをMac Tailscale IPで編集
# NEXT_PUBLIC_API_BASE_URL=http://YOUR_MAC_IP:8000

# 4. 開発サーバーを起動
npm run dev

# 5. Mac APIなしで開発する場合:
# .env.localでNEXT_PUBLIC_MOCK_MODE=trueに設定
```

### 7.2 スクリプト

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "format": "prettier --write \"src/**/*.{ts,tsx}\"",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "type-check": "tsc --noEmit"
  }
}
```

### 7.3 Gitワークフロー

```bash
# フィーチャーブランチワークフロー
git checkout -b feature/task-completion
# 変更を加える
npm run lint && npm run type-check && npm run test
git commit -m "feat: タスク完了機能を追加"
git push origin feature/task-completion
# PR作成 → CIがテスト実行 → マージ
```

---

## 8. 実装フェーズ（更新版）

### フェーズ1: 基盤（スプリント1） - 第1週
**目標: 基本プロジェクト構造、モックデータ動作**

- [ ] App Router付きNext.jsプロジェクトセットアップ
- [ ] TypeScript設定（strictモード）
- [ ] カスタムテーマ付きTailwind CSSセットアップ
- [ ] Heroiconsインストール
- [ ] 基本レイアウト（Header + Sidebar + Main）
- [ ] モックデータ実装
- [ ] モックモードトグル付きRoute Handlers
- [ ] 環境変数設定

**成果物:**
- 動作する開発環境
- サイドバーナビゲーション（静的）
- モックタスクリスト表示
- セットアップ手順付きREADME

**受入基準:**
- `npm run dev`が動作
- サイドバーにInbox/Today/Upcomingが表示
- Inboxビューでモックタスクが表示
- 環境切り替えが動作（モック/APIモード）

---

### フェーズ2: コア機能（スプリント2） - 第2週
**目標: タスク表示、ナビゲーション、API統合**

- [ ] データフェッチング用SWRセットアップ
- [ ] UI状態用Zustandストア
- [ ] Inboxビュー（APIからタスク取得）
- [ ] Todayビュー
- [ ] Upcomingビュー
- [ ] サイドバーナビゲーション（ルート切り替え）
- [ ] タスク詳細表示
- [ ] ローディング状態（Suspense + スケルトン）
- [ ] エラーバウンダリ

**成果物:**
- すべてのビューが機能
- API統合が動作
- 適切なローディング/エラー状態

**受入基準:**
- Inbox/Today/Upcomingクリックで正しいタスクがロード
- タスクにタイトル、期限、タグが表示
- APIエラーでユーザーフレンドリーなメッセージ表示
- データ取得中にローディングスピナー表示

---

### フェーズ3: インタラクティビティ（スプリント3） - 第3週
**目標: タスク完了、自動更新、検索**

- [ ] タスク完了チェックボックス（楽観的更新）
- [ ] 自動更新（SWRで60秒間隔）
- [ ] 手動更新ボタン
- [ ] 検索ボックスコンポーネント
- [ ] 検索API統合
- [ ] デバウンス検索入力
- [ ] ヘルスチェックインジケータ
- [ ] 接続状態表示

**成果物:**
- ユーザーがタスクを完了可能
- データが自動的に更新
- すべてのタスクで検索が動作

**受入基準:**
- チェックボックスクリックでタスク完了（リロード後も維持）
- 60秒ごとにタスクが更新
- タイトル/メモ/タグで検索フィルター
- ヘルスインジケータが緑/赤ステータスを表示

---

### フェーズ4: エリア & プロジェクト（スプリント4） - 第4週
**目標: 完全なナビゲーション階層**

- [ ] エリアリストビュー
- [ ] エリア詳細ビュー（プロジェクト + タスク）
- [ ] プロジェクトタスクリスト
- [ ] 折りたたみ可能なサイドバーセクション
- [ ] プロジェクト作成フォーム
- [ ] プロジェクト作成API統合
- [ ] 動的ルーティング（[area_name]）

**成果物:**
- 完全なナビゲーション階層
- プロジェクト作成が動作

**受入基準:**
- エリアクリックでプロジェクトが表示
- プロジェクトクリックでタスクが表示
- 新規プロジェクトが即座にサイドバーに表示
- サイドバーセクションが展開/折りたたみ

---

### フェーズ5: タスク作成 & フォーム（スプリント5） - 第5週
**目標: ユーザーがタスクを作成可能**

- [ ] タスク作成モーダル
- [ ] フォームバリデーション（クライアントサイド）
- [ ] 日付ピッカーコンポーネント
- [ ] タグ入力コンポーネント
- [ ] タスク作成API統合
- [ ] 楽観的UI更新
- [ ] トースト通知
- [ ] フォームエラーハンドリング

**成果物:**
- 完全なタスク作成フロー
- バリデーションとエラーハンドリング

**受入基準:**
- 「新規タスク」ボタンでモーダルが開く
- フォームが必須フィールドを検証
- 作成後タスクが即座にリストに表示
- 成功トーストに「タスク作成完了」表示
- エラーがインラインで表示

---

### フェーズ6: 仕上げ & テスト（スプリント6） - 第6週
**目標: 本番環境対応品質**

- [ ] レスポンシブデザイン（タブレット/モバイル）
- [ ] アニメーション & トランジション
- [ ] アクセシビリティ改善（ARIA、キーボードナビゲーション）
- [ ] パフォーマンス最適化（React.memo、遅延ロード）
- [ ] ユニットテスト（80%カバレッジ）
- [ ] コンポーネントテスト
- [ ] E2Eテスト（5クリティカルフロー）
- [ ] CI/CDパイプラインセットアップ
- [ ] ドキュメント（JSDoc、README）

**成果物:**
- 本番環境対応アプリ
- 完全なテストカバレッジ
- CI/CDパイプライン

**受入基準:**
- 1024px+画面で動作
- CIですべてのテストが通過
- 80%コードカバレッジ
- アクセシビリティ監査合格
- パフォーマンススコア > 90（Lighthouse）

---

## 9. リスク軽減

### 技術的リスク

| リスク | 影響 | 軽減策 |
|------|--------|------------|
| **Mac APIサーバー利用不可** | 高 | 開発用モックモード |
| **Tailscale接続問題** | 高 | ローカルネットワークフォールバック、エラーハンドリング |
| **1000+タスクでのパフォーマンス** | 中 | 仮想化リスト、ページネーション |
| **ブラウザ互換性** | 低 | エバーグリーンブラウザのみをターゲット |
| **TypeScript学習曲線** | 低 | チームトレーニング、ペアプログラミング |

### タイムラインリスク

| リスク | 軽減策 |
|------|------------|
| **スコープクリープ** | フェーズ1の機能凍結を厳格に |
| **API変更** | APIエンドポイントのバージョン管理 |
| **テスト遅延** | 開発中の並行テスト記述 |
| **デザイン反復** | スプリント1からデザイナー関与 |

---

## 10. 成功指標

### 技術指標

- ✅ **パフォーマンス**: Lighthouseスコア > 90
- ✅ **アクセシビリティ**: WCAG AA準拠
- ✅ **テストカバレッジ**: 80%行、70%分岐
- ✅ **型安全性**: TypeScriptエラーゼロ
- ✅ **バンドルサイズ**: < 200KB gzip圧縮

### ユーザーエクスペリエンス指標

- ✅ **初期ロード**: < 3秒
- ✅ **タスク完了**: < 500ms体感レイテンシ
- ✅ **自動更新**: シームレス（UIジャンクなし）
- ✅ **検索**: 結果 < 300ms
- ✅ **エラー復旧**: 明確なエラーメッセージ + リトライ

### 開発指標

- ✅ **CI/CD**: テスト実行 < 5分
- ✅ **開発セットアップ**: クローンから開発サーバーまで < 10分
- ✅ **ホットリロード**: < 2秒
- ✅ **型チェック**: < 10秒

---

## 11. 最終チェックリスト

### 開発開始前

- [ ] PMがすべての技術的決定を承認
- [ ] デザイナーがカラーパレットとタイポグラフィをレビュー
- [ ] アーキテクトが詳細なスプリント計画を作成
- [ ] Mac APIサーバーエンドポイントを確認
- [ ] Tailscaleネットワークをテスト

### 各スプリント前

- [ ] スプリント目標を明確に定義
- [ ] 受入基準を文書化
- [ ] 依存関係を特定
- [ ] 機能と並行してテストを計画

### 本番デプロイ前

- [ ] すべてのテストが通過（ユニット + E2E）
- [ ] 80%コードカバレッジ達成
- [ ] アクセシビリティ監査合格
- [ ] パフォーマンスベンチマーク達成
- [ ] ドキュメント完成
- [ ] セキュリティレビュー（API URL、CORS）
- [ ] エラー監視セットアップ（Sentry/LogRocket）

---

## 12. 結論

この技術調査は、Windows Things3 Dashboardを構築するための包括的な基盤を提供します。推奨スタックは以下をバランスします:

- **モダンベストプラクティス**: App Router、Server Components、TypeScript
- **開発者体験**: 最小限のボイラープレート、高速イテレーション、優れたツール
- **パフォーマンス**: サーバーサイドレンダリング、楽観的更新、自動更新
- **保守性**: 明確な構造、包括的テスト、型安全性
- **美学**: Things3風デザイン、細部へのこだわり

**主要成功要因:**

1. ✅ **シンプルに始める**: 実証済みツールを使用（最初はJest > Vitest）
2. ✅ **高速イテレーション**: Tailwind + モックモードで迅速なプロトタイピング
3. ✅ **継続的テスト**: 機能と並行してテストを記述
4. ✅ **集中を維持**: 本番環境対応までフェーズ1機能のみ
5. ✅ **コミュニケーション**: PM、アーキテクト、デザイナー、コーダー間の定期的な同期

**次の即時アクション:**

1. **PM**: 技術スタックとフェーズ計画を承認
2. **アーキテクト**: スプリント1の詳細実装計画を作成
3. **デザイナー**: 調査カラーパレットを使用して高品質モックアップを作成
4. **シニアコーダー**: 推奨構造でNext.jsプロジェクトを初期化

---

## 情報源

すべての推奨事項は、2026-01-31に実施された包括的なWeb調査に基づいています:

**Next.js & アーキテクチャ:**
- [Next.jsのApp Router vs Pages Router — 実践的な詳細ガイド](https://dev.to/shyam0118/app-router-vs-pages-router-in-nextjs-a-deep-practical-guide-341g)
- [はじめに: データフェッチング | Next.js](https://nextjs.org/docs/app/getting-started/fetching-data)
- [Next.js 15 2025を整理するベストプラクティス](https://dev.to/bajrayejoon/best-practices-for-organizing-your-nextjs-15-2025-53ji)

**Things3 UIデザイン:**
- [Cultured CodeとThings 3への賛辞](https://medium.com/@jordanborth/an-ode-to-cultured-code-and-things-3-292e20112624)
- [Cultured CodeがThings 3をリリース](https://thesweetsetup.com/cultured-code-releases-things-3/)

**状態管理:**
- [2025年の状態管理: Context、Redux、Zustand、Jotaiをいつ使うか](https://dev.to/hijazi313/state-management-in-2025-when-to-use-context-redux-zustand-or-jotai-2d2k)
- [Zustand vs. Redux Toolkit vs. Jotai](https://betterstack.com/community/guides/scaling-nodejs/zustand-vs-redux-toolkit-vs-jotai/)

**API統合:**
- [Axios vs Fetch: 実践ガイド](https://dev.to/crit3cal/axios-vs-fetch-a-practical-guide-to-error-handling-interceptors-retry-strategies-2f1i)
- [Next.jsとTailwind CSS 2025ガイド](https://codeparrot.ai/blogs/nextjs-and-tailwind-css-2025-guide-setup-tips-and-best-practices)

**テスト:**
- [2026年のテスト: Jest、React Testing Library、フルスタックテスト戦略](https://www.nucamp.co/blog/testing-in-2026-jest-react-testing-library-and-full-stack-testing-strategies)
- [Next.JSをJest、React Testing Library、Playwrightでセットアップする方法](https://blog.jarrodwatts.com/how-to-set-up-nextjs-with-jest-react-testing-library-and-playwright)

---

**ドキュメントステータス**: 完成および実装準備完了
**作成者**: Research Agent
**レビュー要求先**: Project Manager、Architect-Plan
**日付**: 2026-01-31

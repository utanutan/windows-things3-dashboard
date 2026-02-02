# Implementation Plan - Windows Things3 Dashboard

**プロジェクト**: Windows Things3 ダッシュボード
**バージョン**: 1.0
**作成日**: 2026-02-01
**作成者**: Architect-Plan Agent
**ステータス**: 実装準備完了

---

## 1. プロジェクト概要

Mac上のThings3タスクデータを閲覧・管理するためのWindows用Webダッシュボード。バックエンド（Mac側FastAPI）からTailscale経由でデータを取得し、Things3風のミニマルUIで表示する。

### スコープ（Phase 1）
- タスク閲覧（Inbox, Today, Upcoming, Areas/Projects）
- タスク完了状態の変更
- タスク新規作成
- プロジェクト新規作成
- タスク検索
- 自動データ更新（60秒間隔）
- ヘルスチェック・接続ステータス表示
- モックデータモード

---

## 2. 技術スタック（確定版）

| カテゴリ | 技術 | バージョン | 理由 |
|---------|------|-----------|------|
| **フレームワーク** | Next.js (App Router) | 15.x | Server Components、ネストレイアウト、将来性 |
| **言語** | TypeScript | 5.3+ | strict mode、型安全性 |
| **スタイリング** | Tailwind CSS | v4 | ミニマルCSS、高速イテレーション |
| **状態管理（クライアント）** | Zustand | 4.5+ | 最小限ボイラープレート、セレクタ最適化 |
| **状態管理（サーバー）** | SWR | 2.2+ | 自動更新、楽観的更新、Next.js統合 |
| **アイコン** | Heroicons | 2.1+ | Things3風ミニマルデザイン |
| **テスト（ユニット）** | Jest + React Testing Library | 29.7+ / 14.1+ | Next.js組み込みサポート |
| **テスト（E2E）** | Playwright | 1.40+ | マルチブラウザ、公式Next.jsサポート |
| **APIモック** | MSW | 2.x | テスト時のAPI応答モック |
| **ユーティリティ** | clsx + tailwind-merge | latest | className合成 |
| **パッケージマネージャー** | npm | latest | Next.jsネイティブサポート |

### 依存関係

```json
{
  "dependencies": {
    "next": "^15.0.0",
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "zustand": "^4.5.0",
    "swr": "^2.2.0",
    "@heroicons/react": "^2.1.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.2.0"
  },
  "devDependencies": {
    "typescript": "^5.3.0",
    "tailwindcss": "^4.0.0",
    "@tailwindcss/postcss": "^4.0.0",
    "postcss": "^8.4.0",
    "@types/react": "^18.3.0",
    "@types/react-dom": "^18.3.0",
    "jest": "^29.7.0",
    "jest-environment-jsdom": "^29.7.0",
    "@testing-library/react": "^14.1.0",
    "@testing-library/jest-dom": "^6.1.0",
    "@testing-library/user-event": "^14.5.0",
    "msw": "^2.0.0",
    "@playwright/test": "^1.40.0",
    "eslint": "^8.56.0",
    "eslint-config-next": "^15.0.0",
    "prettier": "^3.1.0",
    "eslint-config-prettier": "^9.1.0"
  }
}
```

---

## 3. アーキテクチャ設計

### 3.1 ディレクトリ構造

```
projects/windows-2-things-3/src/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # ルートレイアウト（Header + Sidebar + Main）
│   ├── page.tsx                  # Inbox ビュー（デフォルトルート / ）
│   ├── loading.tsx               # グローバルローディングUI
│   ├── error.tsx                 # グローバルエラーバウンダリ
│   ├── today/
│   │   └── page.tsx              # Today ビュー
│   ├── upcoming/
│   │   └── page.tsx              # Upcoming ビュー
│   ├── search/
│   │   └── page.tsx              # 検索結果ビュー
│   ├── areas/
│   │   ├── page.tsx              # エリア一覧ビュー
│   │   └── [area_name]/
│   │       └── page.tsx          # エリア詳細（プロジェクト+タスク）
│   └── api/                      # Route Handlers（APIプロキシ）
│       ├── health/
│       │   └── route.ts
│       ├── tasks/
│       │   ├── inbox/route.ts
│       │   ├── today/route.ts
│       │   ├── upcoming/route.ts
│       │   ├── search/route.ts
│       │   ├── route.ts          # POST: タスク作成
│       │   └── [id]/
│       │       └── complete/route.ts  # PUT: タスク完了
│       ├── areas/
│       │   ├── route.ts          # GET: エリア一覧
│       │   └── [area_name]/route.ts   # GET: エリア詳細
│       └── projects/
│           ├── route.ts          # GET/POST: プロジェクト一覧/作成
│           └── [project_name]/
│               └── tasks/route.ts     # GET: プロジェクトタスク
│
├── components/
│   ├── layout/
│   │   ├── Header.tsx            # ヘッダー（タイトル+検索+ステータス+更新）
│   │   ├── Sidebar.tsx           # サイドバーナビゲーション
│   │   ├── ConnectionStatus.tsx  # 接続ステータスインジケータ
│   │   └── MainContent.tsx       # メインコンテンツラッパー
│   ├── tasks/
│   │   ├── TaskList.tsx          # タスクリスト
│   │   ├── TaskItem.tsx          # 個別タスクアイテム
│   │   ├── TaskDetail.tsx        # タスク詳細パネル
│   │   ├── TaskCreateForm.tsx    # タスク作成フォーム（モーダル）
│   │   └── TaskListSkeleton.tsx  # ローディングスケルトン
│   ├── projects/
│   │   ├── ProjectList.tsx       # プロジェクトリスト
│   │   └── ProjectCreateForm.tsx # プロジェクト作成フォーム
│   ├── ui/
│   │   ├── Button.tsx            # 汎用ボタン
│   │   ├── Input.tsx             # テキスト入力
│   │   ├── TextArea.tsx          # テキストエリア
│   │   ├── Select.tsx            # ドロップダウン
│   │   ├── Modal.tsx             # モーダルダイアログ
│   │   ├── SearchBox.tsx         # 検索ボックス
│   │   ├── Toast.tsx             # トースト通知
│   │   ├── RefreshButton.tsx     # 手動更新ボタン
│   │   └── DatePicker.tsx        # 日付ピッカー
│   └── shared/
│       ├── Loading.tsx           # ローディングスピナー
│       ├── ErrorBoundary.tsx     # エラーバウンダリ
│       └── EmptyState.tsx        # 空状態表示
│
├── lib/
│   ├── api/
│   │   ├── client.ts             # ベースfetchラッパー（リトライ、タイムアウト）
│   │   ├── tasks.ts              # タスクAPIメソッド
│   │   ├── projects.ts           # プロジェクトAPIメソッド
│   │   ├── areas.ts              # エリアAPIメソッド
│   │   └── health.ts             # ヘルスチェック
│   ├── mock/
│   │   ├── tasks.ts              # モックタスクデータ
│   │   ├── areas.ts              # モックエリアデータ
│   │   └── projects.ts           # モックプロジェクトデータ
│   ├── types/
│   │   ├── task.ts               # Task, CreateTaskRequest
│   │   ├── project.ts            # Project, CreateProjectRequest
│   │   ├── area.ts               # Area, AreaDetail
│   │   └── api.ts                # APIError, HealthResponse
│   ├── utils/
│   │   ├── cn.ts                 # className合成ユーティリティ
│   │   ├── date.ts               # 日付フォーマット
│   │   └── validation.ts         # バリデーションヘルパー
│   └── config.ts                 # 環境変数の型安全アクセス
│
├── hooks/
│   ├── useTasks.ts               # SWR: タスクデータフェッチ+楽観的更新
│   ├── useAreas.ts               # SWR: エリアデータ
│   ├── useProjects.ts            # SWR: プロジェクトデータ
│   ├── useSearch.ts              # SWR: 検索（デバウンス付き）
│   ├── useHealthCheck.ts         # ヘルスチェック
│   ├── useAutoRefresh.ts         # 自動更新制御
│   └── useDebounce.ts            # デバウンスフック
│
├── stores/
│   └── uiStore.ts                # Zustand: UI状態
│
└── styles/
    └── globals.css               # Tailwindインポート+カスタムCSS
```

### 3.2 コンポーネント階層

```
RootLayout (layout.tsx)
├── Header
│   ├── Logo / AppTitle
│   ├── SearchBox
│   ├── ConnectionStatus
│   └── RefreshButton
├── Sidebar
│   ├── NavItem (Inbox)
│   ├── NavItem (Today)
│   ├── NavItem (Upcoming)
│   ├── AreaSection (折りたたみ可能)
│   │   ├── AreaItem
│   │   │   └── ProjectItem
│   │   └── AddProjectButton (+)
│   └── AddTaskButton
└── MainContent
    ├── [Inbox] TaskList → TaskItem[]
    ├── [Today] TaskList → TaskItem[]
    ├── [Upcoming] TaskList → TaskItem[]
    ├── [Search] SearchResults → TaskItem[]
    ├── [Areas] AreaList → AreaCard[]
    ├── [AreaDetail] ProjectList + TaskList
    ├── TaskDetail (右パネル/モーダル)
    ├── TaskCreateForm (モーダル)
    └── ProjectCreateForm (モーダル)
```

### 3.3 状態管理アーキテクチャ

```
┌─────────────────────────────────────────────────────┐
│ 状態タイプ           │ ソリューション │ 用途          │
├──────────────────────┼──────────────┼──────────────┤
│ サーバー状態         │ SWR          │ タスク、エリア、│
│（APIデータ）         │              │ プロジェクト   │
├──────────────────────┼──────────────┼──────────────┤
│ クライアントUI状態   │ Zustand      │ サイドバー折畳、│
│                      │              │ モーダル開閉、 │
│                      │              │ 選択タスクID   │
├──────────────────────┼──────────────┼──────────────┤
│ ローカル状態         │ useState     │ フォーム入力、 │
│                      │              │ 一時的UI状態   │
└──────────────────────┴──────────────┴──────────────┘
```

**Zustand Store（uiStore.ts）:**
- `sidebarCollapsed: boolean`
- `selectedView: 'inbox' | 'today' | 'upcoming' | 'search' | 'area'`
- `searchQuery: string`
- `taskCreateModalOpen: boolean`
- `projectCreateModalOpen: boolean`
- `selectedTaskId: string | null`
- `expandedAreas: string[]`

**SWR Hooks:**
- `useTasks(view)` → 60秒自動更新、楽観的更新（完了）
- `useAreas()` → エリア一覧
- `useProjects(areaName)` → プロジェクト一覧
- `useSearch(query)` → デバウンス300ms付き検索
- `useHealthCheck()` → 5分間隔ヘルスチェック

### 3.4 API統合アーキテクチャ

```
ブラウザ (SWR)
  ↓ fetch('/api/tasks/inbox')
Next.js Route Handler（サーバーサイド）
  ↓ fetchWithRetry(MAC_API_URL + '/todos/inbox')
Mac FastAPI サーバー（Tailscale経由）
  ↓ Things3 DB query
レスポンス（JSON）
```

**Route Handlerパターン:**
- クライアントからMac API URLを隠す（セキュリティ）
- CORS問題を回避
- Next.jsキャッシング活用
- 集中エラーハンドリング
- リトライロジック（指数バックオフ: 1s→2s→4s、最大3回）
- タイムアウト: 10秒

### 3.5 ルーティング構造

| パス | ビュー | データソース |
|------|--------|-------------|
| `/` | Inbox | `GET /api/tasks/inbox` |
| `/today` | Today | `GET /api/tasks/today` |
| `/upcoming` | Upcoming | `GET /api/tasks/upcoming` |
| `/search?q=...` | 検索結果 | `GET /api/tasks/search?q=...` |
| `/areas` | エリア一覧 | `GET /api/areas` |
| `/areas/[area_name]` | エリア詳細 | `GET /api/areas/[area_name]` |

---

## 4. 並列トラック分割

### Track A: 基盤・インフラ

目的: 開発環境とプロジェクト基盤を構築

| # | タスク | 依存関係 | 推定工数 |
|---|--------|---------|---------|
| A-1 | Next.js 15プロジェクト初期化（App Router, TypeScript strict） | なし | 0.5h |
| A-2 | Tailwind CSS v4セットアップ（カスタムテーマ、デザインシステム色） | A-1 | 1h |
| A-3 | Heroiconsインストール + アイコンマッピング定義 | A-1 | 0.5h |
| A-4 | ESLint + Prettier設定 | A-1 | 0.5h |
| A-5 | TypeScript型定義（Task, Area, Project, API型） | A-1 | 1h |
| A-6 | 環境変数設定（.env.example, config.ts） | A-1 | 0.5h |
| A-7 | ベースAPIクライアント（fetchラッパー、リトライ、タイムアウト、APIError） | A-5, A-6 | 2h |
| A-8 | モックデータ実装（tasks, areas, projects） | A-5 | 1h |
| A-9 | Route Handlers実装（全APIプロキシエンドポイント） | A-7, A-8 | 3h |
| A-10 | cnユーティリティ（clsx + tailwind-merge） | A-1 | 0.5h |
| A-11 | 日付フォーマットユーティリティ | A-1 | 0.5h |
| A-12 | バリデーションユーティリティ | A-1 | 0.5h |
| A-13 | Jest + RTLセットアップ（jest.config, jest.setup） | A-1 | 1h |
| A-14 | MSWハンドラー定義 | A-5, A-8 | 1h |

**Track A 依存関係グラフ:**
```
A-1 ─┬─ A-2
     ├─ A-3
     ├─ A-4
     ├─ A-5 ─┬─ A-7 ── A-9
     │        ├─ A-8 ─┘
     │        └─ A-14
     ├─ A-6 ── A-7
     ├─ A-10
     ├─ A-11
     ├─ A-12
     └─ A-13
```

---

### Track B: コアコンポーネント

目的: UI コンポーネントとレイアウトを構築

| # | タスク | 依存関係 | 推定工数 |
|---|--------|---------|---------|
| B-1 | UIプリミティブ: Button（Primary, Secondary, Ghost, Icon） | A-2, A-10 | 1h |
| B-2 | UIプリミティブ: Input, TextArea, Select | A-2, A-10 | 1h |
| B-3 | UIプリミティブ: Modal（オーバーレイ、アニメーション、Escで閉じる） | A-2, A-10 | 1.5h |
| B-4 | UIプリミティブ: Toast通知（success, error, warning, info） | A-2, A-10 | 1h |
| B-5 | UIプリミティブ: SearchBox（デバウンス入力、クリアボタン） | A-2, A-10 | 1h |
| B-6 | UIプリミティブ: DatePicker | A-2, A-10 | 1h |
| B-7 | 共有: Loading, EmptyState, ErrorBoundary | A-2 | 1h |
| B-8 | レイアウト: Header（タイトル、検索、接続ステータス、更新ボタン） | B-1, B-5 | 2h |
| B-9 | レイアウト: Sidebar（ナビゲーション、折りたたみ、エリア/プロジェクト階層） | B-1, A-3 | 3h |
| B-10 | レイアウト: ConnectionStatus（緑/赤/灰色インジケータ） | A-2 | 1h |
| B-11 | レイアウト: RefreshButton（回転アニメーション、最終更新時刻） | B-1 | 0.5h |
| B-12 | ルートレイアウト統合（layout.tsx: Header + Sidebar + MainContent） | B-8, B-9 | 1.5h |
| B-13 | TaskItem（チェックボックス、タイトル、期限、タグ、メモアイコン） | A-2, A-5, A-11 | 2h |
| B-14 | TaskList（TaskItem[]、ローディングスケルトン、空状態） | B-13, B-7 | 1.5h |
| B-15 | TaskDetail（右パネル/モーダル、全情報表示） | B-3, B-13 | 2h |
| B-16 | TaskListSkeleton（アニメーションプレースホルダー） | A-2 | 0.5h |

**Track B 依存関係グラフ:**
```
A-2, A-10 ─┬─ B-1 ─┬─ B-8 ─── B-12
            │       ├─ B-9 ──┘
            │       └─ B-11
            ├─ B-2
            ├─ B-3 ── B-15
            ├─ B-4
            ├─ B-5 ── B-8
            ├─ B-6
            ├─ B-7 ── B-14
            └─ B-10
A-3 ────── B-9
A-5, A-11 ─ B-13 ── B-14
                  └─ B-15
B-16 (独立)
```

---

### Track C: 機能実装

目的: データフェッチ、インタラクション、業務ロジックを実装

| # | タスク | 依存関係 | 推定工数 |
|---|--------|---------|---------|
| C-1 | Zustand UIストア（uiStore.ts） | A-1 | 1h |
| C-2 | SWRセットアップ + フェッチャー定義 | A-7 | 0.5h |
| C-3 | useTasks フック（inbox/today/upcoming、自動更新60秒） | C-2, A-9 | 2h |
| C-4 | useAreas フック | C-2, A-9 | 1h |
| C-5 | useProjects フック | C-2, A-9 | 1h |
| C-6 | useSearch フック（デバウンス300ms） | C-2, A-9 | 1.5h |
| C-7 | useHealthCheck フック（5分間隔） | C-2, A-9 | 1h |
| C-8 | useDebounce フック | A-1 | 0.5h |
| C-9 | Inboxページ（page.tsx: Server Component + Client TaskList） | B-14, C-3 | 1.5h |
| C-10 | Todayページ | B-14, C-3 | 1h |
| C-11 | Upcomingページ | B-14, C-3 | 1h |
| C-12 | 検索結果ページ | B-14, C-6 | 1.5h |
| C-13 | エリア一覧ページ | C-4, B-7 | 1.5h |
| C-14 | エリア詳細ページ（[area_name]） | C-4, C-5, B-14 | 2h |
| C-15 | タスク完了機能（楽観的更新 + ロールバック） | C-3, B-13 | 2h |
| C-16 | タスク作成フォーム + API連携 | B-2, B-3, B-6, C-3 | 3h |
| C-17 | プロジェクト作成フォーム + API連携 | B-2, B-3, C-5 | 2h |
| C-18 | サイドバーナビゲーション統合（ルート切替、アクティブ状態） | B-9, C-1 | 1.5h |
| C-19 | ヘルスチェック + ConnectionStatus統合 | C-7, B-10 | 1h |
| C-20 | 自動更新 + RefreshButton統合 | C-3, B-11 | 1h |
| C-21 | トースト通知統合（タスク完了、作成成功/失敗） | B-4, C-15, C-16 | 1h |
| C-22 | レスポンシブデザイン（768px以下サイドバー折りたたみ） | B-12, C-1 | 2h |
| C-23 | アクセシビリティ改善（ARIA、キーボードナビ、フォーカス管理） | 全コンポーネント | 2h |
| C-24 | パフォーマンス最適化（React.memo、dynamic import、Suspense） | 全ページ | 2h |

**Track C 依存関係グラフ:**
```
C-1 (独立)
C-2 ── C-3 ─┬─ C-9, C-10, C-11
             ├─ C-15 ── C-21
             └─ C-20
     ── C-4 ─┬─ C-13
              └─ C-14
     ── C-5 ── C-14, C-17
     ── C-6 ── C-12
     ── C-7 ── C-19
C-8 (独立)
C-16 (B-2,B-3,B-6,C-3)
C-18 (B-9, C-1)
C-22 (B-12, C-1)
C-23, C-24 (最後)
```

---

## 5. Sprint計画（6スプリント）

### Sprint 1: 基盤構築（第1週）

**目標**: 開発環境セットアップ、モックデータで基本表示が動作

**タスク:**
- A-1: Next.jsプロジェクト初期化
- A-2: Tailwind CSSセットアップ
- A-3: Heroiconsインストール
- A-4: ESLint + Prettier設定
- A-5: TypeScript型定義
- A-6: 環境変数設定
- A-7: ベースAPIクライアント
- A-8: モックデータ実装
- A-9: Route Handlers実装
- A-10: cnユーティリティ
- A-11: 日付フォーマットユーティリティ
- A-12: バリデーションユーティリティ
- A-13: Jest + RTLセットアップ
- B-1: Button
- B-7: Loading, EmptyState, ErrorBoundary

**完了基準:**
- `npm run dev` が正常に動作
- モックモードでInboxのタスクが表示される
- TypeScript型エラーがゼロ
- ESLint + Prettier設定済み
- Jest テスト環境が動作

---

### Sprint 2: コア表示（第2週）

**目標**: レイアウト完成、全ビューでタスク表示、ナビゲーション動作

**タスク:**
- B-2: Input, TextArea, Select
- B-3: Modal
- B-5: SearchBox
- B-8: Header
- B-9: Sidebar
- B-10: ConnectionStatus
- B-11: RefreshButton
- B-12: ルートレイアウト統合
- B-13: TaskItem
- B-14: TaskList
- B-16: TaskListSkeleton
- C-1: Zustand UIストア
- C-2: SWRセットアップ
- C-3: useTasksフック
- C-9: Inboxページ
- C-10: Todayページ
- C-11: Upcomingページ
- C-18: サイドバーナビゲーション統合

**完了基準:**
- Sidebar/Header/MainContentの3カラムレイアウトが表示
- Inbox/Today/Upcomingビュー切替が動作
- タスクリストにタイトル、期限、タグが表示
- ローディングスケルトンが表示
- モックモードとAPIモード両方で動作

---

### Sprint 3: インタラクション（第3週）

**目標**: タスク完了、自動更新、検索が動作

**タスク:**
- C-4: useAreasフック
- C-6: useSearchフック
- C-7: useHealthCheckフック
- C-8: useDebounceフック
- C-15: タスク完了機能（楽観的更新）
- C-12: 検索結果ページ
- C-19: ヘルスチェック + ConnectionStatus統合
- C-20: 自動更新 + RefreshButton統合
- B-4: Toast通知
- C-21: トースト通知統合
- B-15: TaskDetail
- A-14: MSWハンドラー定義

**完了基準:**
- チェックボックスクリックでタスク完了（楽観的更新+ロールバック）
- 60秒自動更新が動作
- 手動更新ボタンが動作
- 検索ボックス入力 → デバウンス → 結果表示
- ヘルスインジケータが緑/赤/灰色で表示
- タスククリックで詳細パネル表示
- トースト通知表示

---

### Sprint 4: エリア・プロジェクト（第4週）

**目標**: エリア/プロジェクト階層、プロジェクト作成

**タスク:**
- C-5: useProjectsフック
- C-13: エリア一覧ページ
- C-14: エリア詳細ページ
- C-17: プロジェクト作成フォーム + API連携
- B-6: DatePicker

**完了基準:**
- サイドバーにエリア/プロジェクト階層が表示
- エリアの折りたたみ/展開が動作
- エリアクリックでプロジェクト+タスク表示
- プロジェクト作成フォームからAPI送信が動作
- 作成後サイドバーに即座に反映

---

### Sprint 5: タスク作成 & フォーム（第5週）

**目標**: タスク作成フロー完成

**タスク:**
- C-16: タスク作成フォーム + API連携
- C-22: レスポンシブデザイン

**完了基準:**
- 「新規タスク」ボタンでモーダルが開く
- タイトル（必須）、メモ、期限、タグ、所属先を入力可能
- バリデーションエラーがインライン表示
- 作成成功でトースト + リスト更新
- 1024px以上でデスクトップレイアウト正常
- 768px以下でサイドバー折りたたみ動作

---

### Sprint 6: 仕上げ & テスト（第6週）

**目標**: 品質基準達成、本番環境対応

**タスク:**
- C-23: アクセシビリティ改善
- C-24: パフォーマンス最適化
- ユニットテスト作成（ユーティリティ、フック）
- コンポーネントテスト作成（TaskItem, TaskList, Sidebar, SearchBox, Modal, Button）
- E2Eテスト作成（5クリティカルフロー）
  1. タスク完了フロー
  2. タスク作成フロー
  3. 検索フロー
  4. ナビゲーションフロー
  5. 自動更新フロー
- Playwrightセットアップ
- CI/CDパイプライン（GitHub Actions）
- README.md（セットアップ手順）
- .env.example

**完了基準:**
- テストカバレッジ80%以上（行）
- TypeScriptエラーゼロ
- ESLint警告ゼロ
- 5つのE2Eフローが全ブラウザで通過
- Lighthouseスコア > 90
- README.mdにセットアップ手順記載
- モックモード/APIモード両方で全機能動作

---

## 6. 実装優先順位

```
【最高】基盤（A-1〜A-9）→ 他の全てが依存
  ↓
【高】 コアUI（B-8,B-9,B-12,B-13,B-14）→ ユーザーに見える部分
  ↓
【高】 データフェッチ（C-2,C-3,C-9〜C-11）→ 主要機能
  ↓
【中】 インタラクション（C-15,C-6,C-12,C-20）→ ユーザー体験
  ↓
【中】 エリア/プロジェクト（C-4,C-5,C-13,C-14,C-17）→ 階層構造
  ↓
【中】 タスク作成（C-16）→ 書き込み機能
  ↓
【低】 品質（C-22,C-23,C-24,テスト）→ 仕上げ
```

---

## 7. リスクと軽減策

| リスク | 影響度 | 発生確率 | 軽減策 |
|--------|--------|---------|--------|
| Mac APIサーバー利用不可 | 高 | 中 | モックモードで全機能開発可能にする（A-8） |
| Tailscale接続不安定 | 高 | 中 | リトライロジック(3回)、ヘルスチェック、エラー表示(A-7) |
| 1000+タスクでのパフォーマンス低下 | 中 | 低 | React.memo、仮想化リスト（Phase 2検討）、Suspense(C-24) |
| Tailwind CSS v4の破壊的変更 | 中 | 低 | 安定版を固定、v3へのフォールバック計画 |
| SWR自動更新によるAPI負荷 | 低 | 中 | dedupingInterval、revalidateOnFocus制御(C-3) |
| TypeScript strict modeの学習コスト | 低 | 低 | 型定義を最初に整備（A-5） |
| ブラウザ互換性問題 | 低 | 低 | Chrome/Edgeのみサポート、Playwright E2Eで検証 |

---

## 8. 次のステップ（Senior-Coderへの指示準備）

### Track A 最初のタスク詳細仕様（A-1: Next.jsプロジェクト初期化）

**作業内容:**
1. `npx create-next-app@latest` で新規プロジェクト作成
   - App Router: Yes
   - TypeScript: Yes
   - Tailwind CSS: Yes
   - ESLint: Yes
   - `src/` directory: Yes
   - Import alias: `@/*`
2. `tsconfig.json` に `strict: true` を確認
3. 不要なデフォルトファイルを削除（page.tsx のデフォルト内容等）
4. `.gitignore` に `.env.local`, `.env*.local` を追加
5. `package.json` の scripts に追加:
   - `"type-check": "tsc --noEmit"`
   - `"format": "prettier --write \"src/**/*.{ts,tsx}\""`

**成果物:**
- 動作するNext.js 15プロジェクト（`npm run dev` で起動確認）
- `src/app/layout.tsx` と `src/app/page.tsx` が存在

### Senior-Coderに渡すべき参照ドキュメントリスト

1. **本ドキュメント** (`spec/implementation_plan.md`) - 全体設計・タスク一覧
2. `docs/requirements.md` - 詳細要件（API仕様、データモデル、UI仕様）
3. `docs/design_system.md` - デザインシステム（色、フォント、コンポーネント定義）
4. `research/recommendations_summary.md` - 技術スタック推奨（依存関係、設定例）
5. `research/api_integration_tailwind.md` - APIクライアント実装パターン、Tailwind設定
6. `research/testing_strategy.md` - テスト設定、パターン例
7. `resources/mockups/` - 全UIモックアップ（dashboard, inbox, today, areas_projects, task_create_form, search）

### 実装時の注意事項

1. **実装コードは書かない**（設計のみ） - これはArchitectの制約。Senior-Coderが実装する。
2. **モックモード優先**: Mac APIが無くても開発できるよう、モックモードを最初に実装すること。
3. **型定義先行**: `lib/types/` の型定義をTrack Aの早期段階で完成させ、全コンポーネントで共有。
4. **Server Components vs Client Components**: データ表示はServer Component、インタラクティブ機能は `'use client'` を明示。
5. **Route Handlers**: クライアントからMac APIへ直接アクセスしない。必ずNext.js Route Handler経由。
6. **環境変数**: `NEXT_PUBLIC_` プレフィックスはクライアント公開用、サーバーサイド専用は `API_BASE_URL`。
7. **楽観的更新**: タスク完了はUI即更新 → API送信 → 失敗時ロールバック。
8. **デバウンス**: 検索入力は300msデバウンス。
9. **アイコン**: Heroiconsのoutlineスタイルを優先。
10. **テスト**: 実装と並行してテストを書くこと（Sprint 6で追加も可だが、早期開始推奨）。

---

**Report To**: Project-Manager
**作成者**: Architect-Plan Agent
**作成日**: 2026-02-01

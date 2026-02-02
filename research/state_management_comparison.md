# 状態管理の比較
**プロジェクト**: Windows Things3 ダッシュボード
**日付**: 2026-01-31
**調査者**: Research Agent

---

## エグゼクティブサマリー

Windows Things3 ダッシュボードに対しては、**Zustand をクライアント側の状態管理ソリューションの主要ツール**として推奨します。本分析では Context API、Zustand、Jotai を複数の次元で比較し、明確な推奨事項を提示します。

---

## 1. オプションの概要

### Context API（React 内蔵）

**説明:**
React の Context API は状態を保持する「Provider」を作成し、ネストされたコンポーネントが Props バケツリレーなしにその状態を「消費」できるようにします。

**メリット:**
- React に直接組み込まれている（依存関係なし）
- 追加のバンドルサイズなし
- 小規模な状態に対して使いやすい
- 静的または変更されないデータ（テーマ、ユーザー設定）に適している

**デメリット:**
- パフォーマンスの問題：Context を消費するすべてのコンポーネントは任意の値が変わるたびに再レンダリングされる
- ビルトインセレクタまたは最適化がない
- 過度な再レンダリングを防ぐために手動メモ化が必要
- 複雑な状態に対してボイラープレートが多い

**使用時期:**
- 小規模なアプリケーション
- 静的な設定（テーマ、国際化）
- Props バケツリレーの解決策
- パフォーマンスが重要でない状態

**情報源:**
- [2025年における状態管理：Context、Redux、Zustand、Jotaiの使い分け](https://dev.to/hijazi313/state-management-in-2025-when-to-use-context-redux-zustand-or-jotai-2d2k)
- [React 状態管理：Context、Zustand、Jotai の効率的な使用方法](https://javascript-conference.com/blog/react-state-management-context-zustand-jotai/)

---

### Zustand

**説明:**
Zustand は、単一ストア構造でボイラープレートが最小限の、小型で高速な状態管理ライブラリです。Poimandres（react-spring と react-three-fiber の開発者）によって開発されています。

**メリット:**
- 小さいバンドルサイズ（gzip 圧縮で約 3KB）
- ボイラープレートが最小限
- ビルトインセレクタベースのサブスクリプション（不要な再レンダリングなし）
- シンプルな API（学習曲線 30 分未満）
- TypeScript サポートが優秀
- ミドルウェアサポート（永続化、開発者ツール、immer）
- React コンポーネント外で機能
- Provider ラッピングが不要

**デメリット:**
- 単一ストアアーキテクチャ（大きくなる可能性がある）
- アトミックなアプローチより粒度が粗い
- Redux より小さいエコシステム

**使用時期:**
- 中規模から大規模なアプリケーション
- シンプルで高性能な状態管理が必要
- Redux のボイラープレートを避けたい
- 多くのコンポーネント間で グローバル状態が必要

**採用統計（2026年）:**
- 前年比 30% 以上の成長率
- 新規 React プロジェクトの約 40% で使用
- React コミュニティで強い勢い

**情報源:**
- [2025年における状態管理：Context、Redux、Zustand、Jotaiの使い分け](https://dev.to/hijazi313/state-management-in-2025-when-to-use-context-redux-zustand-or-jotai-2d2k)
- [Zustand vs. Redux Toolkit vs. Jotai](https://betterstack.com/community/guides/scaling-nodejs/zustand-vs-redux-toolkit-vs-jotai/)
- [比較 - Zustand](https://zustand.docs.pmnd.rs/getting-started/comparison)

---

### Jotai

**説明:**
Jotai は Recoil にインスパイアされた、アトミックなアプローチを採用する状態管理ライブラリです。単一のストアではなく、状態は小さな独立した「アトム」で構成されます。

**メリット:**
- アトミックモデル（粒度の細かい再レンダリング）
- 極めて軽量（約 3KB）
- TypeScript 推論が優秀
- ボトムアップなアプローチ（アトムを合成）
- ビルトインの非同期サポート
- Provider ボイラープレートなし（内部で React コンテキストを使用）
- 複雑に相互依存する状態に最適

**デメリット:**
- 異なるメンタルモデル（学習曲線が急）
- シンプルなユースケースではより複雑
- Zustand より小さいコミュニティ
- 整理しないとアトムの増殖につながる可能性がある

**使用時期:**
- 複雑で相互依存する状態の関係性
- 最大限の再レンダリング最適化が必要
- リアクティブで合成可能な状態が必要
- Recoil またはアトミックパターンに精通している

**情報源:**
- [比較 — Jotai、React のためのプリミティブで柔軟な状態管理](https://jotai.org/docs/basics/comparison)
- [React における状態管理：Zustand と Jotai の比較](https://zohaibfazlani.medium.com/state-management-in-react-a-comparison-of-zustand-and-jotai-40de9d2e851a)
- [Stunk vs Jotai vs Zustand：React 状態管理の深掘り解説](https://medium.com/@dev_azeez/stunk-vs-jotai-vs-zustand-a-deep-dive-into-react-state-management-76f2fa72528d)

---

## 2. 詳細比較

### 機能マトリックス

| 機能 | Context API | Zustand | Jotai |
|---------|------------|---------|-------|
| **バンドルサイズ** | 0KB（ビルトイン） | 約 3KB | 約 3KB |
| **ボイラープレート** | 中程度 | 最小限 | 最小限 |
| **学習曲線** | 簡単 | 非常に簡単 | 中程度 |
| **パフォーマンス** | 低い（セレクタなし） | 優秀 | 優秀 |
| **TypeScript サポート** | 良好 | 優秀 | 優秀 |
| **開発者ツール** | ❌ | ✅（ミドルウェア） | ✅（devtools） |
| **永続化** | 手動 | ✅（ミドルウェア） | ✅（atomWithStorage） |
| **非同期サポート** | 手動 | ✅ | ✅（ビルトイン） |
| **React 外での動作** | ❌ | ✅ | ❌ |
| **Provider が必要** | ✅ | ❌ | ❌ |
| **エコシステム** | 大規模（React） | 成長中 | 中程度 |

### Code Comparison

#### Context API の例

```typescript
// context/TaskContext.tsx
import { createContext, useContext, useState } from 'react';

interface TaskContextType {
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);

  return (
    <TaskContext.Provider value={{ tasks, setTasks, loading, setLoading }}>
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TaskContext);
  if (!context) throw new Error('useTasks must be used within TaskProvider');
  return context;
}

// 使用例
function App() {
  return (
    <TaskProvider>
      <Dashboard />
    </TaskProvider>
  );
}

function TaskList() {
  const { tasks, loading } = useTasks(); // ⚠️ 任意の値が変わるたびに再レンダリング
  // ...
}
```

**問題点:**
- `TaskList` は `loading` が変わるときに再レンダリングされるが、`tasks` のみを使用している場合でも再レンダリングされる
- `useMemo`、`React.memo` などを使用した手動最適化が必要

---

#### Zustand の例

```typescript
// stores/taskStore.ts
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface TaskStore {
  tasks: Task[];
  loading: boolean;
  error: string | null;

  // アクション
  setTasks: (tasks: Task[]) => void;
  addTask: (task: Task) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useTaskStore = create<TaskStore>()(
  devtools(
    persist(
      (set) => ({
        tasks: [],
        loading: false,
        error: null,

        setTasks: (tasks) => set({ tasks }),
        addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
        updateTask: (id, updates) =>
          set((state) => ({
            tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
          })),
        deleteTask: (id) =>
          set((state) => ({ tasks: state.tasks.filter((t) => t.id !== id) })),
        setLoading: (loading) => set({ loading }),
        setError: (error) => set({ error }),
      }),
      { name: 'task-store' }
    )
  )
);

// 使用例（Provider は不要！）
function TaskList() {
  const tasks = useTaskStore((state) => state.tasks); // ✅ tasks が変わるときのみ再レンダリング
  const loading = useTaskStore((state) => state.loading);
  // ...
}

function AddTaskButton() {
  const addTask = useTaskStore((state) => state.addTask); // ✅ 再レンダリングされない
  // ...
}
```

**メリット:**
- Provider ボイラープレートなし
- ビルトインセレクタ最適化
- ミドルウェアサポート（永続化、開発者ツール）
- クリーンで直感的な API

---

#### Jotai の例

```typescript
// atoms/taskAtoms.ts
import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

// プリミティブアトム
export const tasksAtom = atomWithStorage<Task[]>('tasks', []);
export const loadingAtom = atom(false);
export const errorAtom = atom<string | null>(null);

// 導出アトム
export const completedTasksAtom = atom((get) => {
  const tasks = get(tasksAtom);
  return tasks.filter((t) => t.status === 'completed');
});

export const taskCountAtom = atom((get) => get(tasksAtom).length);

// アクションアトム
export const addTaskAtom = atom(
  null,
  (get, set, task: Task) => {
    set(tasksAtom, [...get(tasksAtom), task]);
  }
);

export const updateTaskAtom = atom(
  null,
  (get, set, { id, updates }: { id: string; updates: Partial<Task> }) => {
    set(tasksAtom, get(tasksAtom).map((t) => (t.id === id ? { ...t, ...updates } : t)));
  }
);

// 使用例
import { useAtom, useAtomValue, useSetAtom } from 'jotai';

function TaskList() {
  const tasks = useAtomValue(tasksAtom); // ✅ tasks が変わるときのみ再レンダリング
  const loading = useAtomValue(loadingAtom);
  // ...
}

function TaskCount() {
  const count = useAtomValue(taskCountAtom); // ✅ 自動的に再計算
  return <div>{count} 個のタスク</div>;
}

function AddTaskButton() {
  const addTask = useSetAtom(addTaskAtom); // ✅ 再レンダリングされない
  // ...
}
```

**メリット:**
- アトミック合成（状態の導出が簡単）
- 自動依存追跡
- ビルトイン非同期サポート
- 最小限の再レンダリング

---

## 3. パフォーマンス比較

### 再レンダリング動作

**シナリオ:** 単一のタスクの完了状態を更新

| ソリューション | 再レンダリングされるコンポーネント |
|----------|------------------------|
| Context API | すべてのコンシューマー（TaskList、Sidebar、Header） |
| Context API + memo | TaskList（すべてのアイテム）、最適化されたコンシューマー |
| Zustand | `tasks` 配列を選択するコンポーネントのみ |
| Zustand + セレクタ | 適切なセレクタで変更されたタスクの TaskItem のみ |
| Jotai | 影響を受けるアトムを使用するコンポーネントのみ |

### ベンチマーク（1000 タスク、100 更新/秒）

| ソリューション | 平均レンダリング時間 | メモリ使用量 | バンドルサイズ |
|----------|------------------|--------------|-------------|
| Context API | 45ms | 12MB | 0KB |
| Zustand | 8ms | 10MB | 3KB |
| Jotai | 7ms | 11MB | 3KB |

*（シンセティックベンチマーク - 実際のパフォーマンスは異なる場合があります）*

**情報源:**
- [useState 以上の状態管理：Context API vs Redux vs Zustand vs Jotai](https://medium.com/@karanssoni2002/state-management-beyond-usestate-context-api-vs-redux-vs-zustand-vs-jotai-ee6627b45d1b)
- [Zustand vs. Redux Toolkit vs. Jotai](https://betterstack.com/community/guides/scaling-nodejs/zustand-vs-redux-toolkit-vs-jotai/)

---

## 4. 当プロジェクトの推奨事項

### **主要な推奨：Zustand**

#### 根拠

1. **プロジェクト規模**：中程度の複雑さ（1000 以上のタスク、複数のビュー、リアルタイム更新）
   - Context API だけでは複雑すぎる
   - アトミックな粒度が必要なほど複雑ではない

2. **チームの親和性**：シンプルなメンタルモデル
   - 学習曲線 1 時間未満
   - ボイラープレートのない Redux 的なアクション

3. **パフォーマンス**：最小限の労力で優秀
   - ビルトインセレクタ最適化
   - 手動メモ化が不要

4. **機能適合性**:
   - ✅ 永続化ミドルウェア（ローカルキャッシュ）
   - ✅ DevTools ミドルウェア（デバッグ）
   - ✅ 自動リフレッシュ統合（簡単に再フェッチをトリガー）
   - ✅ オプティミスティック更新（タスク完了）

5. **バンドルサイズ**：3KB は当ユースケースではほぼ無視できる

6. **エコシステム**：2026 年で強い勢い（新規プロジェクトの 40% で採用）

---

### ハイブリッドアーキテクチャ（推奨）

**すべてのことに単一のソリューションを使用しないでください！** 最新の React アプリケーションはハイブリッドなアプローチから恩恵を受けます：

```
┌─────────────────────────────────────────────┐
│ 状態タイプ         │ ソリューション         │
├────────────────────┼────────────────────────┤
│ サーバー状態       │ SWR / React Query      │
│ （タスク、プロジェクト） │ （自動リフレッシュ付き） │
├────────────────────┼────────────────────────┤
│ クライアント状態   │ Zustand                │
│ （UI 状態、フィルタ）│ （グローバルクライアント状態） │
├────────────────────┼────────────────────────┤
│ ローカル状態       │ useState / useReducer  │
│ （フォーム入力）   │ （コンポーネントローカルのみ） │
├────────────────────┼────────────────────────┤
│ 環境状態           │ Context API            │
│ （テーマ、設定）   │ （静的、変更されない） │
└─────────────────────────────────────────────┘
```

**情報源:**
- [2026年における状態管理：Redux、Context API、およびモダンパターン](https://www.nucamp.co/blog/state-management-in-2026-redux-context-api-and-modern-patterns)
- [React 状態管理 2025：Zustand vs. Redux vs. Jotai vs. Context](https://www.meerako.com/blogs/react-state-management-zustand-vs-redux-vs-context-2025)

---

### 実装計画

#### サーバー状態（SWR）

Mac API からのすべてのデータフェッチを処理：

```typescript
// hooks/useTasks.ts
import useSWR from 'swr';
import { fetcher } from '@/lib/api/client';

export function useTasks() {
  const { data, error, mutate } = useSWR<Task[]>('/api/tasks/inbox', fetcher, {
    refreshInterval: 60000, // 60 秒ごとに自動リフレッシュ
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
  });

  return {
    tasks: data ?? [],
    loading: !data && !error,
    error,
    refresh: mutate,
  };
}
```

#### クライアント状態（Zustand）

UI 状態、フィルタ、および一時的なクライアント側状態を処理：

```typescript
// stores/uiStore.ts
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface UIStore {
  // サイドバー
  sidebarCollapsed: boolean;
  selectedView: 'inbox' | 'today' | 'upcoming' | 'search';

  // 検索
  searchQuery: string;
  searchOpen: boolean;

  // モーダル
  taskCreateModalOpen: boolean;
  projectCreateModalOpen: boolean;

  // タスク詳細
  selectedTaskId: string | null;

  // アクション
  toggleSidebar: () => void;
  setSelectedView: (view: UIStore['selectedView']) => void;
  setSearchQuery: (query: string) => void;
  openTaskCreateModal: () => void;
  closeTaskCreateModal: () => void;
  selectTask: (id: string) => void;
}

export const useUIStore = create<UIStore>()(
  devtools((set) => ({
    sidebarCollapsed: false,
    selectedView: 'inbox',
    searchQuery: '',
    searchOpen: false,
    taskCreateModalOpen: false,
    projectCreateModalOpen: false,
    selectedTaskId: null,

    toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
    setSelectedView: (view) => set({ selectedView: view }),
    setSearchQuery: (query) => set({ searchQuery: query }),
    openTaskCreateModal: () => set({ taskCreateModalOpen: true }),
    closeTaskCreateModal: () => set({ taskCreateModalOpen: false }),
    selectTask: (id) => set({ selectedTaskId: id }),
  }))
);
```

#### ローカル状態（useState）

フォーム入力、一時的なインタラクション：

```typescript
// components/tasks/TaskCreateForm.tsx
function TaskCreateForm() {
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [dueDate, setDueDate] = useState('');

  // フォーム状態はローカルに保つ - グローバル状態の必要なし
}
```

#### 環境状態（Context API）

テーマ、設定（静的、変更されない）：

```typescript
// context/ThemeContext.tsx
const ThemeContext = createContext<'light' | 'dark'>('light');

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
}
```

---

## 5. 代替選択肢の検討：Jotai

### Jotai の方が優れている場合

プロジェクトが以下を含むように進化する場合：
- 複雑に相互依存する状態（複数のフィルタに基づく計算タスクリストなど）
- 粒度の細かいサブスクリプションが必要（大規模なタスクリストの再レンダリングを避ける）
- リアクティブなデータフロー（変更がアトムを通じて自動的にカスケード）

### 移行パス

必要に応じて Zustand → Jotai の移行は比較的直感的です：

```typescript
// 移行前（Zustand）
const tasks = useTaskStore((state) => state.tasks);
const addTask = useTaskStore((state) => state.addTask);

// 移行後（Jotai）
const tasks = useAtomValue(tasksAtom);
const addTask = useSetAtom(addTaskAtom);
```

**推奨事項:** Zustand で開始してください。パフォーマンスプロファイリングがボトルネックを明らかにする場合にのみ Jotai に移行してください。

---

## 6. Context API の使用（限定的）

### Context API をまだ使用する場所

1. **テーマ/設定**（静的、変更されない）
2. **認証状態**（将来のフェーズ 2 機能）
3. **API 設定**（ベース URL、モックモード）

**例：**

```typescript
// context/ConfigContext.tsx
import { createContext, useContext } from 'react';

interface Config {
  apiBaseUrl: string;
  mockMode: boolean;
  autoRefreshInterval: number;
}

const ConfigContext = createContext<Config | undefined>(undefined);

export function ConfigProvider({ children }: { children: React.ReactNode }) {
  const config: Config = {
    apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || '',
    mockMode: process.env.NEXT_PUBLIC_MOCK_MODE === 'true',
    autoRefreshInterval: Number(process.env.NEXT_PUBLIC_AUTO_REFRESH_INTERVAL) || 60000,
  };

  return <ConfigContext.Provider value={config}>{children}</ConfigContext.Provider>;
}

export function useConfig() {
  const context = useContext(ConfigContext);
  if (!context) throw new Error('useConfig must be used within ConfigProvider');
  return context;
}
```

---

## 7. 実装チェックリスト

### フェーズ 1：セットアップ（スプリント 1）
- [ ] Zustand をインストール：`npm install zustand`
- [ ] SWR をインストール：`npm install swr`
- [ ] `stores/` ディレクトリを作成
- [ ] `uiStore.ts` を基本的な UI 状態でセットアップ
- [ ] `hooks/useTasks.ts` を SWR 統合で作成

### フェーズ 2：コア状態（スプリント 2）
- [ ] SWR でタスクデータフェッチを実装
- [ ] UI 状態ストア（サイドバー、モーダル、選択されたアイテム）を作成
- [ ] Zustand DevTools ミドルウェアを追加
- [ ] タスク完了のオプティミスティック更新を実装

### フェーズ 3：高度な機能（スプリント 3）
- [ ] 永続化ミドルウェアを追加（UI 状態をキャッシュ）
- [ ] 検索状態管理を実装
- [ ] 自動リフレッシュロジックを追加（SWR + 手動トリガー）
- [ ] フィルタ状態を作成（必要な場合）

### フェーズ 4：ポーランド（スプリント 4）
- [ ] パフォーマンスのためにセレクタを最適化
- [ ] エラーバウンダリを追加
- [ ] リトライロジックを実装
- [ ] ページ再読み込み時の状態永続化をテスト

---

## 8. 最終推奨事項の要約

### プライマリスタック

| 状態タイプ | ソリューション | 根拠 |
|------------|----------|-----------|
| **サーバー状態** | **SWR** | 自動リフレッシュ、キャッシュ、オプティミスティック更新 |
| **クライアント状態** | **Zustand** | シンプル、高性能、最小限のボイラープレート |
| **ローカル状態** | **useState** | コンポーネントローカル、グローバル状態不要 |
| **設定状態** | **Context API** | 静的、変更されない |

### なぜ他のものではないのか？

- **Redux Toolkit**：このプロジェクトサイズではオーバーキル、Zustand よりボイラープレートが多い
- **Jotai**：優秀な選択肢だが、アトミックモデルは現在必要でない複雑さを追加する
- **Recoil**：Meta 支援だが 2026 年では Jotai より勢いが低い
- **Context API のみ**：頻繁な更新（タスク完了、自動リフレッシュ）でパフォーマンスの問題

### 決定マトリックス

```
プロジェクト複雑度：中程度（7/10）
チームサイズ：小規模（1～3 名の開発者）
パフォーマンス要件：高い（1000 以上のタスク、60 秒の自動リフレッシュ）
学習曲線許容度：低い（快速ランプアップ）

→ Zustand が最適な選択肢
```

---

## 情報源

- [2025年における状態管理：Context、Redux、Zustand、Jotaiの使い分け](https://dev.to/hijazi313/state-management-in-2025-when-to-use-context-redux-zustand-or-jotai-2d2k)
- [比較 — Jotai、React のためのプリミティブで柔軟な状態管理](https://jotai.org/docs/basics/comparison)
- [React 状態管理：Context、Zustand、Jotai の効率的な使用方法](https://javascript-conference.com/blog/react-state-management-context-zustand-jotai/)
- [Zustand vs. Redux Toolkit vs. Jotai](https://betterstack.com/community/guides/scaling-nodejs/zustand-vs-redux-toolkit-vs-jotai/)
- [useState 以上の状態管理：Context API vs Redux vs Zustand vs Jotai](https://medium.com/@karanssoni2002/state-management-beyond-usestate-context-api-vs-redux-vs-zustand-vs-jotai-ee6627b45d1b)
- [2026年における状態管理：Redux、Context API、およびモダンパターン](https://www.nucamp.co/blog/state-management-in-2026-redux-context-api-and-modern-patterns)
- [比較 - Zustand](https://zustand.docs.pmnd.rs/getting-started/comparison)
- [React 状態管理 2025：Zustand vs. Redux vs. Jotai vs. Context](https://www.meerako.com/blogs/react-state-management-zustand-vs-redux-vs-context-2025)

---

**次のステップ:**
1. PM が状態管理戦略を承認
2. Architect が実装計画に組み込む
3. Senior-Coder が Zustand ストアと SWR フックをスキャフォルディング

# テスト戦略（Testing Strategy）
**プロジェクト**: Windows Things3 ダッシュボード
**日付**: 2026-01-31
**研究担当**: Research Agent

---

## 概要（Executive Summary）

Windows Things3 ダッシュボード向けの包括的なテスト戦略。レイヤード・アプローチ（階層化テスト）を採用し、**Jest + React Testing Library** をコンポーネント/ユニットテストに、**Playwright** をE2Eテストに使用します。セットアップ、ベストプラクティス、カバレッジ目標、2026年のトレンドをカバーします。

---

## 1. テスト哲学（2026年）

### レイヤード・テスト戦略（階層化テスト戦略）

2026年の最新フルスタックテストはピラミッド・アプローチに従います：

```
         /\
        /E2E\         ← Playwright（3～5個の重要フロー）
       /──────\
      /  API   \      ← Supertest + MSW（API統合テスト）
     /──────────\
    / Component  \    ← React Testing Library（ユーザー視点テスト）
   /──────────────\
  /  Unit Tests   \   ← Jest（ロジック、ユーティリティテスト）
 /────────────────\
```

**カバレッジ目標:**
- ユニットテスト: 80%以上のカバレッジ
- コンポーネントテスト: 70%以上のカバレッジ
- 統合テスト: 50%以上のカバレッジ
- E2Eテスト: 3～5個の重要ユーザーフロー

**情報源:**
- [2026年のテスト戦略: Jest、React Testing Library、フルスタックテスト](https://www.nucamp.co/blog/testing-in-2026-jest-react-testing-library-and-full-stack-testing-strategies)
- [Next.JS を Jest、React Testing Library、Playwright でセットアップする方法](https://blog.jarrodwatts.com/how-to-set-up-nextjs-with-jest-react-testing-library-and-playwright)

---

## 2. テストツール

### Jest（ユニット・統合テスト）

**説明:**
組み込みのモッキング、アサーション、カバレッジレポート機能を備えたJavaScriptテスティングフレームワーク。

**メリット:**
- ✅ Next.js組み込みサポート（v12以降）
- ✅ スナップショットテスト
- ✅ コードカバレッジレポート
- ✅ 高速ウォッチモード
- ✅ 大規模なエコシステム

**デメリット:**
- ❌ 大規模プロジェクトではVitestより遅い
- ❌ ESMサポートが複雑

**代替案: Vitest**
- 大規模コードベースで10～20倍高速
- ESM/Viteサポートに優れている
- Jest互換の置き換えが可能

**本プロジェクトの推奨: Jest**
- Next.jsの組み込み設定対応
- エンタープライズレベルの安定性実証済み
- 大規模なコミュニティ（解決策が見つけやすい）

**情報源:**
- [最適化: テスト | Next.js](https://nextjs.org/docs/13/pages/building-your-application/optimizing/testing)
- [2026年のテスト戦略: Jest、React Testing Library、フルスタックテスト](https://www.nucamp.co/blog/testing-in-2026-jest-react-testing-library-and-full-stack-testing-strategies)

---

### React Testing Library（コンポーネントテスト）

**説明:**
実装の詳細ではなく、ユーザー視点からコンポーネントをテストすることを推奨するテスティングライブラリ。

**フィロソフィー:**
> 「テストがソフトウェアの実際の使用方法に近いほど、より信頼性が高まります。」

**メリット:**
- ✅ ユーザー中心のテスト（テキスト、ロール、ラベルで検索）
- ✅ アクセシビリティコードを推奨（セマンティックHTML、ARIA）
- ✅ Next.js/React統合に優れている
- ✅ 小規模なAPI表面（習得しやすい）
- ✅ 実装詳細のテストを推奨しない

**デメリット:**
- ❌ 複雑なインタラクションでは冗長になる可能性がある
- ❌ 非同期テストは注意深い処理が必要

**重要な原則:**
動作をテストし、実装をテストしない。内部状態またはメソッドをテストしない。

**情報源:**
- [ガイド: テスト | Next.js](https://nextjs.org/docs/app/guides/testing)
- [Jest、React Testing Library、Playwrightの比較](https://dev.to/padmajothi_athimoolam_23d/comparing-jest-react-testing-library-and-playwright-testing-approaches-for-react-applications-15ic)

---

### Playwright（E2Eテスト）

**説明:**
Chromium、Firefox、WebKit全体でリアルなブラウザインタラクションを自動化するエンドツーエンドテスティングフレームワーク。

**メリット:**
- ✅ マルチブラウザサポート（Chromium、Firefox、WebKit）
- ✅ 高速、信頼性が高く、並列化可能
- ✅ スクリーンショット、ビデオ録画組み込み
- ✅ ネットワークインターセプション
- ✅ 優れたデバッグツール
- ✅ 公式Next.jsサポート

**デメリット:**
- ❌ ユニットテストより遅い
- ❌ よりもろい（UI変更でテストが壊れる）
- ❌ フルアプリの実行が必要（ビルド+サーバー）

**2026年、Cypress上でPlaywrightを選ぶ理由:**
- より優れたパフォーマンス（10～30%高速）
- マルチブラウザサポートがすぐに利用可能
- クリーンなAPI
- TypeScriptサポートに優れている

**情報源:**
- [テスト: Playwright | Next.js](https://nextjs.org/docs/pages/guides/testing/playwright)
- [Vitest & PlaywrightによるユニットテストとE2Eテスト](https://strapi.io/blog/nextjs-testing-guide-unit-and-e2e-tests-with-vitest-and-playwright)

---

## 3. セットアップと設定

### Jest + React Testing Library セットアップ

#### インストール

```bash
npm install -D jest jest-environment-jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

#### 設定

**jest.config.js:**
```javascript
const nextJest = require('next/jest');

const createJestConfig = nextJest({
  // next.config.jsと.envファイルを読み込むNext.jsアプリケーションへのパス
  dir: './',
});

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.tsx',
    '!src/**/_app.tsx',
    '!src/**/_document.tsx',
  ],
  coverageThresholds: {
    global: {
      branches: 70,
      functions: 70,
      lines: 80,
      statements: 80,
    },
  },
  testPathIgnorePatterns: [
    '<rootDir>/.next/',
    '<rootDir>/node_modules/',
    '<rootDir>/e2e/',  // Playwrightテストを除外
  ],
};

module.exports = createJestConfig(customJestConfig);
```

**jest.setup.js:**
```javascript
import '@testing-library/jest-dom';

// Next.jsルーターをモック
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
    };
  },
  usePathname() {
    return '/';
  },
}));

// 環境変数をモック
process.env = {
  ...process.env,
  NEXT_PUBLIC_API_BASE_URL: 'http://localhost:8000',
  NEXT_PUBLIC_MOCK_MODE: 'true',
};
```

**package.json スクリプト:**
```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:ci": "jest --ci --coverage --maxWorkers=2"
  }
}
```

**情報源:**
- [最適化: テスト | Next.js](https://nextjs.org/docs/13/pages/building-your-application/optimizing/testing)
- [Next.JS を Jest、React Testing Library、Playwright でセットアップする方法](https://blog.jarrodwatts.com/how-to-set-up-nextjs-with-jest-react-testing-library-and-playwright)

---

### Playwright セットアップ

#### インストール

```bash
npm install -D @playwright/test
npx playwright install
```

#### 設定

**playwright.config.ts:**
```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: process.env.CI ? 'html' : 'list',

  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],

  webServer: {
    command: 'npm run build && npm run start',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

**package.json スクリプト:**
```json
{
  "scripts": {
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:e2e:debug": "playwright test --debug"
  }
}
```

**ディレクトリ構造:**
```
e2e/
├── fixtures/           # テストデータ
├── helpers/            # ヘルパー関数
├── pages/              # Page Object Models
│   ├── inbox.page.ts
│   ├── today.page.ts
│   └── sidebar.page.ts
└── tests/
    ├── task-completion.spec.ts
    ├── task-creation.spec.ts
    └── search.spec.ts
```

**情報源:**
- [テスト: Playwright | Next.js](https://nextjs.org/docs/pages/guides/testing/playwright)
- [Next.JS を Jest、React Testing Library、Playwright でセットアップする方法](https://blog.jarrodwatts.com/how-to-set-up-nextjs-with-jest-react-testing-library-and-playwright)

---

## 4. テストパターンと例

### ユニットテスト（Jest）

純粋な関数、ユーティリティ、ビジネスロジックをテストします。

**例: 日付フォーマットユーティリティ**

```typescript
// lib/utils/date.ts
export function formatDueDate(dateString: string): string {
  const date = new Date(dateString);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (date.toDateString() === today.toDateString()) return 'Today';
  if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// lib/utils/date.test.ts
import { formatDueDate } from './date';

describe('formatDueDate', () => {
  it('returns "Today" for today\'s date', () => {
    const today = new Date().toISOString().split('T')[0];
    expect(formatDueDate(today)).toBe('Today');
  });

  it('returns "Tomorrow" for tomorrow\'s date', () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateString = tomorrow.toISOString().split('T')[0];
    expect(formatDueDate(dateString)).toBe('Tomorrow');
  });

  it('returns formatted date for future dates', () => {
    expect(formatDueDate('2026-02-15')).toBe('Feb 15');
  });
});
```

---

### コンポーネントテスト（React Testing Library）

ユーザー視点からコンポーネントをテストします。

**例: TaskItem コンポーネント**

```typescript
// components/tasks/TaskItem.tsx
interface TaskItemProps {
  task: Task;
  onToggleComplete: (id: string) => void;
}

export function TaskItem({ task, onToggleComplete }: TaskItemProps) {
  return (
    <div role="listitem">
      <input
        type="checkbox"
        checked={task.status === 'completed'}
        onChange={() => onToggleComplete(task.id)}
        aria-label={`Mark "${task.title}" as complete`}
      />
      <span className={task.status === 'completed' ? 'line-through' : ''}>
        {task.title}
      </span>
      {task.due_date && <span>{formatDueDate(task.due_date)}</span>}
    </div>
  );
}

// components/tasks/TaskItem.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TaskItem } from './TaskItem';

describe('TaskItem', () => {
  const mockTask: Task = {
    id: '1',
    title: 'Buy milk',
    status: 'open',
    due_date: '2026-02-01',
  };

  it('renders task title', () => {
    render(<TaskItem task={mockTask} onToggleComplete={jest.fn()} />);
    expect(screen.getByText('Buy milk')).toBeInTheDocument();
  });

  it('shows unchecked checkbox for open task', () => {
    render(<TaskItem task={mockTask} onToggleComplete={jest.fn()} />);
    const checkbox = screen.getByRole('checkbox', { name: /mark "buy milk" as complete/i });
    expect(checkbox).not.toBeChecked();
  });

  it('calls onToggleComplete when checkbox is clicked', async () => {
    const user = userEvent.setup();
    const onToggleComplete = jest.fn();

    render(<TaskItem task={mockTask} onToggleComplete={onToggleComplete} />);

    const checkbox = screen.getByRole('checkbox');
    await user.click(checkbox);

    expect(onToggleComplete).toHaveBeenCalledWith('1');
    expect(onToggleComplete).toHaveBeenCalledTimes(1);
  });

  it('applies line-through style for completed task', () => {
    const completedTask = { ...mockTask, status: 'completed' as const };
    render(<TaskItem task={completedTask} onToggleComplete={jest.fn()} />);

    const title = screen.getByText('Buy milk');
    expect(title).toHaveClass('line-through');
  });

  it('displays formatted due date', () => {
    render(<TaskItem task={mockTask} onToggleComplete={jest.fn()} />);
    expect(screen.getByText(/Feb 1/i)).toBeInTheDocument();
  });
});
```

**重要な原則:**
- ロール、ラベル、またはテキストで検索する（クラスやテストIDではない）
- インタラクション向けに `userEvent` を使用する（`fireEvent` より現実的）
- ユーザー向けの動作をテストし、実装詳細ではない

---

### 統合テスト（SWR + API）

モッキングでAPI統合をテストします。

**例: useTasks フック with MSW**

```typescript
// __tests__/hooks/useTasks.test.tsx
import { renderHook, waitFor } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { SWRConfig } from 'swr';
import { useTasks } from '@/hooks/useTasks';

const server = setupServer(
  rest.get('/api/tasks/inbox', (req, res, ctx) => {
    return res(
      ctx.json([
        { id: '1', title: 'Task 1', status: 'open' },
        { id: '2', title: 'Task 2', status: 'completed' },
      ])
    );
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

function wrapper({ children }: { children: React.ReactNode }) {
  return (
    <SWRConfig value={{ dedupingInterval: 0, provider: () => new Map() }}>
      {children}
    </SWRConfig>
  );
}

describe('useTasks', () => {
  it('fetches and returns tasks', async () => {
    const { result } = renderHook(() => useTasks(), { wrapper });

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.tasks).toHaveLength(2);
    expect(result.current.tasks[0].title).toBe('Task 1');
  });

  it('handles API errors', async () => {
    server.use(
      rest.get('/api/tasks/inbox', (req, res, ctx) => {
        return res(ctx.status(500));
      })
    );

    const { result } = renderHook(() => useTasks(), { wrapper });

    await waitFor(() => {
      expect(result.current.error).toBeDefined();
    });
  });
});
```

---

### E2Eテスト（Playwright）

実ブラウザで完全なユーザーフローをテストします。

**例: タスク完了フロー**

```typescript
// e2e/tests/task-completion.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Task Completion', () => {
  test('should complete a task by clicking checkbox', async ({ page }) => {
    // Inboxに移動
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Inbox' })).toBeVisible();

    // 最初のタスクを検索
    const firstTask = page.getByRole('listitem').first();
    const checkbox = firstTask.getByRole('checkbox');
    const taskTitle = await firstTask.getByText(/buy milk/i).textContent();

    // 最初はチェック外
    await expect(checkbox).not.toBeChecked();

    // クリックして完了
    await checkbox.click();

    // チェックされている必要がある
    await expect(checkbox).toBeChecked();

    // タイトルは線引きスタイルが必要
    const titleElement = firstTask.getByText(taskTitle!);
    await expect(titleElement).toHaveClass(/line-through/);

    // APIが呼ばれたことを確認（ネットワークリクエストをチェック）
    // これは高度な方法 - page.route()を使用してインターセプト可能
  });

  test('should persist completion after page reload', async ({ page }) => {
    await page.goto('/');

    // タスクを完了
    const checkbox = page.getByRole('checkbox').first();
    await checkbox.click();
    await expect(checkbox).toBeChecked();

    // ページをリロード
    await page.reload();

    // リロード後もチェックされたままでなければならない
    const checkboxAfterReload = page.getByRole('checkbox').first();
    await expect(checkboxAfterReload).toBeChecked();
  });
});
```

**例: タスク作成フロー**

```typescript
// e2e/tests/task-creation.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Task Creation', () => {
  test('should create a new task', async ({ page }) => {
    await page.goto('/');

    // 「新規タスク」ボタンをクリック
    await page.getByRole('button', { name: /new task/i }).click();

    // モーダルが表示される必要がある
    const modal = page.getByRole('dialog', { name: /new task/i });
    await expect(modal).toBeVisible();

    // フォームに入力
    await page.getByLabel(/task title/i).fill('Test Task');
    await page.getByLabel(/notes/i).fill('This is a test task');
    await page.getByLabel(/due date/i).fill('2026-02-15');

    // 送信
    await page.getByRole('button', { name: /create/i }).click();

    // モーダルが閉じられる必要がある
    await expect(modal).not.toBeVisible();

    // 新しいタスクがリストに表示される必要がある
    await expect(page.getByText('Test Task')).toBeVisible();

    // 成功トーストが表示される必要がある
    await expect(page.getByText(/task created/i)).toBeVisible();
  });

  test('should validate required fields', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /new task/i }).click();

    // タイトルなしで送信を試みる
    await page.getByRole('button', { name: /create/i }).click();

    // エラーメッセージが表示される必要がある
    await expect(page.getByText(/title is required/i)).toBeVisible();

    // モーダルが開いたままでなければならない
    await expect(page.getByRole('dialog')).toBeVisible();
  });
});
```

**Page Object Model パターン:**

```typescript
// e2e/pages/inbox.page.ts
import { Page } from '@playwright/test';

export class InboxPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/');
  }

  async getTaskByTitle(title: string) {
    return this.page.getByRole('listitem').filter({ hasText: title });
  }

  async completeTask(title: string) {
    const task = await this.getTaskByTitle(title);
    await task.getByRole('checkbox').click();
  }

  async openNewTaskModal() {
    await this.page.getByRole('button', { name: /new task/i }).click();
  }

  async createTask(data: { title: string; notes?: string; dueDate?: string }) {
    await this.openNewTaskModal();
    await this.page.getByLabel(/task title/i).fill(data.title);
    if (data.notes) await this.page.getByLabel(/notes/i).fill(data.notes);
    if (data.dueDate) await this.page.getByLabel(/due date/i).fill(data.dueDate);
    await this.page.getByRole('button', { name: /create/i }).click();
  }
}

// テストでの使用
import { InboxPage } from '../pages/inbox.page';

test('create task using page object', async ({ page }) => {
  const inboxPage = new InboxPage(page);
  await inboxPage.goto();
  await inboxPage.createTask({
    title: 'Test Task',
    notes: 'Test notes',
    dueDate: '2026-02-15',
  });

  await expect(page.getByText('Test Task')).toBeVisible();
});
```

---

## 5. 重要なテストシナリオ

### 必須テスト（80%カバレッジ目標）

#### ユニットテスト
- [ ] 日付フォーマットユーティリティ
- [ ] フォーム検証ロジック
- [ ] APIクライアントエラーハンドリング
- [ ] データ変換関数

#### コンポーネントテスト
- [ ] TaskItem（チェックボックス、タイトル、期日、タグ）
- [ ] TaskList（レンダリング、空状態、ロード状態）
- [ ] Sidebar（ナビゲーション、選択、折りたたみ）
- [ ] SearchBox（入力、デバウンス、クリア）
- [ ] TaskCreateForm（検証、送信、エラーハンドリング）
- [ ] Modal（開く、閉じる、背景クリック）
- [ ] Button（バリアント、無効状態、ロード状態）

#### 統合テスト
- [ ] useTasks フック（フェッチ、ロード、エラー）
- [ ] useAutoRefresh（間隔、手動トリガー）
- [ ] useSearch（クエリ、結果、デバウンス）
- [ ] タスク完了オプティミスティック更新

#### E2Eテスト（3～5個の重要フロー）
1. [ ] **タスク完了フロー**
   - Inboxを読み込む
   - タスクチェックボックスをチェック
   - 完了状態が持続することを確認
   - APIコールを確認

2. [ ] **タスク作成フロー**
   - モーダルを開く
   - 有効なデータでフォームに入力
   - 送信
   - タスクがリストに表示されることを確認

3. [ ] **検索フロー**
   - 検索クエリを入力
   - 結果がフィルタリングされることを確認
   - 検索をクリア
   - 完全なリストが復元されることを確認

4. [ ] **ナビゲーションフロー**
   - Inbox をクリック → タスクが読み込まれることを確認
   - Today をクリック → タスクが読み込まれることを確認
   - Area をクリック → プロジェクト/タスクが読み込まれることを確認

5. [ ] **自動更新フロー**
   - 60秒待機
   - データが更新されることを確認
   - 手動更新ボタンが動作することを確認

---

## 6. モックデータ戦略

### MSW（Mock Service Worker）

**セットアップ:**
```bash
npm install -D msw
```

**設定:**
```typescript
// __tests__/mocks/handlers.ts
import { rest } from 'msw';

export const handlers = [
  rest.get('/api/tasks/inbox', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        {
          id: '1',
          title: 'Buy milk',
          status: 'open',
          due_date: '2026-02-01',
          tags: ['shopping'],
        },
        {
          id: '2',
          title: 'Write report',
          status: 'completed',
          due_date: '2026-01-30',
          tags: ['work'],
        },
      ])
    );
  }),

  rest.put('/api/tasks/:id/complete', (req, res, ctx) => {
    const { id } = req.params;
    return res(
      ctx.status(200),
      ctx.json({ id, status: 'completed' })
    );
  }),

  rest.post('/api/tasks', async (req, res, ctx) => {
    const body = await req.json();
    return res(
      ctx.status(201),
      ctx.json({ id: 'new-task-id', ...body })
    );
  }),
];

// __tests__/mocks/server.ts
import { setupServer } from 'msw/node';
import { handlers } from './handlers';

export const server = setupServer(...handlers);
```

**テストでの使用:**
```typescript
// jest.setup.js
import { server } from './__tests__/mocks/server';

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

---

## 7. CI/CDインテグレーション

### GitHub Actions ワークフロー

```yaml
# .github/workflows/test.yml
name: Test

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - run: npm ci
      - run: npm run test:ci
      - run: npm run test:coverage

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/coverage-final.json

  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - run: npm ci
      - run: npx playwright install --with-deps

      - run: npm run build
      - run: npm run test:e2e

      - name: Upload Playwright Report
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: playwright-report/
```

---

## 8. テスティングトレンド（2026年）

### AI支援テスト

- **GitHub Copilot / Cursor**: テスト作成が60%高速化可能
- **AI使用**: アシスタント、ストラテジーオーナーとして扱わない
- **人間の責任**: テスト設計とメンテナンス

### Vitest採用

- 大規模コードベースで10～20倍高速フィードバック
- 企業の62%がJest/Vitest/Playwright/Cypressを使用

### 推奨

- **Jest で開始**（証明された安定性、Next.js組み込みサポート）
- **パフォーマンスが問題になる場合はVitestに移行**

**情報源:**
- [2026年のテスト戦略: Jest、React Testing Library、フルスタックテスト](https://www.nucamp.co/blog/testing-in-2026-jest-react-testing-library-and-full-stack-testing-strategies)

---

## 9. 実装タイムライン

### Sprint 1: 基礎構築
- [ ] Jest + React Testing Library をセットアップ
- [ ] カバレッジ閾値を設定
- [ ] 最初のユニットテストを作成（ユーティリティ）
- [ ] MSW for API モッキングをセットアップ

### Sprint 2: コンポーネントテスト
- [ ] コアコンポーネントをテスト（TaskItem、TaskList）
- [ ] UIコンポーネントをテスト（Button、Input、Modal）
- [ ] フォームをテスト（TaskCreateForm）
- [ ] カバレッジを50%に達成

### Sprint 3: 統合テスト
- [ ] SWR フックをテスト（useTasks、useAreas）
- [ ] Zustand ストアをテスト
- [ ] 自動更新ロジックをテスト
- [ ] カバレッジを70%に達成

### Sprint 4: E2Eテスト
- [ ] Playwright をセットアップ
- [ ] 3～5個の重要フローを作成
- [ ] CI/CDパイプラインをセットアップ
- [ ] 総カバレッジを80%に達成

---

## 10. ベストプラクティス概要

### すべきこと（Do's）
- ✅ ユーザー動作をテスト、実装ではない
- ✅ セマンティッククエリを使用（getByRole、getByLabelText）
- ✅ 外部依存関係をモック（APIコール）
- ✅ バグ修正前にテストを作成（リグレッションテスト）
- ✅ テストを高速に保つ（フルスイートで5分未満）
- ✅ 説明的なテスト名を使用（「X の時に Y すべき」）
- ✅ テストを分離する（共有状態なし）

### してはいけないこと（Don'ts）
- ❌ 実装詳細をテスト（状態、プライベートメソッド）
- ❌ getByTestId を最初の選択肢として使用
- ❌ もろいE2Eテストを作成（CSSセレクタを避ける）
- ❌ エラーシナリオをスキップ
- ❌ 不安定なテストを無視
- ❌ 過度なモック（可能なら実際の動作をテスト）

---

## 11. カバレッジ目標

### 最小カバレッジ閾値

```javascript
// jest.config.js
coverageThresholds: {
  global: {
    branches: 70,    // 70%のブランチがカバー
    functions: 70,   // 70%の関数がカバー
    lines: 80,       // 80%の行がカバー
    statements: 80,  // 80%のステートメントがカバー
  },
  './src/lib/': {
    branches: 90,    // ビジネスロジックの高い閾値
    functions: 90,
    lines: 95,
    statements: 95,
  },
}
```

### テストの内容（優先順序）

1. **重要なパス**（100%カバレッジ）
   - タスク完了ロジック
   - APIエラーハンドリング
   - フォーム検証

2. **コア機能**（80%以上のカバレッジ）
   - タスク CRUD 操作
   - 検索機能
   - 自動更新

3. **UIコンポーネント**（70%以上のカバレッジ）
   - インタラクティブコンポーネント
   - フォーム
   - モーダル

4. **エッジケース**（50%以上のカバレッジ）
   - エラーバウンダリ
   - ロード状態
   - 空状態

---

## 結論

### 推奨スタック

| テストタイプ | ツール | カバレッジ目標 |
|-----------|------|---------------|
| ユニットテスト | Jest | 80% |
| コンポーネントテスト | React Testing Library | 70% |
| 統合テスト | Jest + MSW | 50% |
| E2Eテスト | Playwright | 3～5フロー |

### 成功メトリクス

- ✅ 総コードカバレッジ 80%
- ✅ すべての重要フローをテスト（E2E）
- ✅ テストが 5 分未満で実行
- ✅ 不安定なテストはゼロ
- ✅ すべてのPRでCI/CDパイプラインが成功

### 次のステップ

1. PM がテスト戦略を承認
2. Architect が実装プランに組み込む
3. Senior-Coder がテストインフラをセットアップ（Sprint 1）
4. QA-Tester が E2E テストを作成（Sprint 4）

---

## 情報源

- [2026年のテスト戦略: Jest、React Testing Library、フルスタックテスト](https://www.nucamp.co/blog/testing-in-2026-jest-react-testing-library-and-full-stack-testing-strategies)
- [Next.JS を Jest、React Testing Library、Playwright でセットアップする方法](https://blog.jarrodwatts.com/how-to-set-up-nextjs-with-jest-react-testing-library-and-playwright)
- [Vitest & PlaywrightによるユニットテストとE2Eテスト](https://strapi.io/blog/nextjs-testing-guide-unit-and-e2e-tests-with-vitest-and-playwright)
- [最適化: テスト | Next.js](https://nextjs.org/docs/13/pages/building-your-application/optimizing/testing)
- [テスト: Playwright | Next.js](https://nextjs.org/docs/pages/guides/testing/playwright)
- [ガイド: テスト | Next.js](https://nextjs.org/docs/app/guides/testing)
- [Jest、React Testing Library、Playwrightの比較](https://dev.to/padmajothi_athimoolam_23d/comparing-jest-react-testing-library-and-playwright-testing-approaches-for-react-applications-15ic)

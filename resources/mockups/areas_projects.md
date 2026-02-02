# UIモックアップ仕様: エリア/プロジェクト画面

**画面名**: Areas & Projects View
**作成日**: 2026-02-01
**作成者**: Designer Agent

---

## 概要

エリア/プロジェクト画面は、タスクを大分類（エリア）と中分類（プロジェクト）で整理して表示します。Things3の"Areas"機能に相当し、仕事・個人などのカテゴリ別にプロジェクトとタスクを管理できます。

---

## レイアウト構造

### エリア一覧ビュー

```
┌───────────────────────────────────────────────────────────┐
│ Areas                            [+ New Project]          │
│ (28px, bold)                     (プライマリボタン)       │
├───────────────────────────────────────────────────────────┤
│                                                           │
│ ┌─────────────────────────────────────────────────────┐ │
│ │  [FolderIcon]                                       │ │
│ │  仕事                                    5 projects  │ │
│ │  (17px, semibold)                     (13px, gray) │ │
│ │                                                     │ │
│ │  プロジェクトA • プロジェクトB • プロジェクトC...   │ │
│ │  (13px, secondary)                                  │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                           │
│ ┌─────────────────────────────────────────────────────┐ │
│ │  [FolderIcon]                                       │ │
│ │  個人                                    2 projects  │ │
│ │                                                     │ │
│ │  健康 • 趣味                                        │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                           │
│ 2 areas                                                   │
└───────────────────────────────────────────────────────────┘
```

### エリア詳細ビュー（プロジェクト・タスク表示）

```
┌───────────────────────────────────────────────────────────┐
│ 仕事                             [+ New Project]          │
│ (28px, bold)                     (プライマリボタン)       │
├───────────────────────────────────────────────────────────┤
│                                                           │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│ PROJECTS - 5                                              │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                                           │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ ▶ プロジェクトA                            3 tasks │ │
│ │   ウェブサイト改修                          2/15   │ │
│ │   (15px, medium)                         (期限)    │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                           │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ ▼ プロジェクトB                            7 tasks │ │
│ │   マーケティングキャンペーン                       │ │
│ │                                                     │ │
│ │   [ ] ランディングページ作成            Today    │ │
│ │   [ ] SNS広告デザイン                    2/5     │ │
│ │   [✓] 競合分析                                    │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                           │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│ STANDALONE TASKS - 2                                      │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                                           │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ [ ] 経費精算                               2/10   │ │
│ │     [仕事]                                        │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                           │
└───────────────────────────────────────────────────────────┘
```

---

## コンポーネント詳細

### 1. エリア一覧ビュー

#### ヘッダーセクション

**レイアウト:**
```
┌────────────────────────────────────────────────┐
│ Areas                         [+ New Project]  │
└────────────────────────────────────────────────┘
```

**要素:**

1. **ビュータイトル**
   - テキスト: "Areas"
   - フォントサイズ: 28px
   - フォントウェイト: 700
   - カラー: text-primary

2. **New Projectボタン**
   - スタイル: プライマリボタン
   - テキスト: "+ New Project"
   - クリック: プロジェクト作成モーダルを開く

#### エリアカード

**構造:**
```
┌─────────────────────────────────────────────────────┐
│  [FolderIcon]                                       │
│  仕事                                    5 projects  │
│                                                     │
│  プロジェクトA • プロジェクトB • プロジェクトC...   │
└─────────────────────────────────────────────────────┘
```

**要素:**

1. **アイコン**
   - アイコン: FolderIcon
   - サイズ: 24x24px
   - カラー: primary (#4A90E2)
   - 位置: 左上

2. **エリア名**
   - フォントサイズ: 17px
   - フォントウェイト: 600
   - カラー: text-primary
   - 位置: アイコンの右、上段

3. **プロジェクト数**
   - テキスト: "5 projects"
   - フォントサイズ: 13px
   - カラー: text-secondary
   - 位置: 右上

4. **プロジェクトプレビュー**
   - フォントサイズ: 13px
   - カラー: text-secondary
   - 形式: "プロジェクトA • プロジェクトB • ..."
   - 最大3件まで表示、超過時は "..."
   - マージン上: 8px

**スタイル:**
```css
.area-card {
  display: flex;
  flex-direction: column;
  padding: 20px;
  background-color: var(--color-background-main);
  border: 1px solid var(--color-border-light);
  border-radius: 12px;
  margin-bottom: 16px;
  transition: all 0.15s ease;
  cursor: pointer;
}

.area-card:hover {
  background-color: var(--color-background-sidebar);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.area-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.area-card-header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.area-card-icon {
  width: 24px;
  height: 24px;
  color: var(--color-primary);
}

.area-card-name {
  font-size: 17px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.area-card-count {
  font-size: 13px;
  color: var(--color-text-secondary);
}

.area-card-preview {
  font-size: 13px;
  color: var(--color-text-secondary);
  margin-top: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
```

#### フッター

**レイアウト:**
```
┌────────────────────────────────────────────────┐
│ 2 areas                                        │
└────────────────────────────────────────────────┘
```

**要素:**
- エリア件数表示
- フォントサイズ: 11px
- カラー: text-tertiary
- 中央寄せ

---

### 2. エリア詳細ビュー

#### ヘッダーセクション

**レイアウト:**
```
┌────────────────────────────────────────────────┐
│ 仕事                          [+ New Project]  │
└────────────────────────────────────────────────┘
```

**要素:**

1. **エリア名**
   - フォントサイズ: 28px
   - フォントウェイト: 700
   - カラー: text-primary

2. **Breadcrumb（オプション）**
   - テキスト: "Areas > 仕事"
   - フォントサイズ: 13px
   - カラー: text-secondary
   - 位置: エリア名の上

3. **New Projectボタン**
   - このエリア配下にプロジェクトを作成

---

#### プロジェクトセクション

**セクションヘッダー:**
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PROJECTS - 5
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**スタイル:**
```css
.section-header {
  margin: 24px 0 16px 0;
}

.section-header-title {
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  color: var(--color-text-secondary);
  padding: 8px 0;
  border-top: 1px solid var(--color-divider);
  border-bottom: 1px solid var(--color-divider);
}
```

#### プロジェクトカード（折りたたみ式）

**構造 - 閉じた状態:**
```
┌─────────────────────────────────────────────────────┐
│ ▶ プロジェクトA                            3 tasks │
│   ウェブサイト改修                          2/15   │
└─────────────────────────────────────────────────────┘
```

**構造 - 開いた状態:**
```
┌─────────────────────────────────────────────────────┐
│ ▼ プロジェクトB                            7 tasks │
│   マーケティングキャンペーン                       │
│                                                     │
│   [ ] ランディングページ作成            Today    │
│   [ ] SNS広告デザイン                    2/5     │
│   [✓] 競合分析                                    │
│   [✓] 競合調査レポート                            │
│                                                     │
│   + 3 more tasks                                   │
└─────────────────────────────────────────────────────┘
```

**要素:**

1. **折りたたみアイコン**
   - アイコン: ChevronRightIcon / ChevronDownIcon
   - サイズ: 16x16px
   - カラー: text-secondary
   - トランジション: 0.3s ease

2. **プロジェクト名**
   - フォントサイズ: 15px
   - フォントウェイト: 600
   - カラー: text-primary

3. **プロジェクト説明**（オプション）
   - フォントサイズ: 13px
   - カラー: text-secondary
   - 1行のみ表示

4. **タスク数バッジ**
   - テキスト: "3 tasks"
   - フォントサイズ: 13px
   - カラー: text-secondary
   - 位置: 右上

5. **プロジェクト期限**（あれば）
   - フォントサイズ: 13px
   - カラー: warning/error（期限による）
   - 位置: 右上、タスク数の下

6. **タスクリスト**（展開時のみ）
   - プロジェクト配下のタスクを表示
   - 最大5件まで表示、超過時は "+ X more tasks"
   - インデント: 24px

**スタイル:**
```css
.project-card {
  display: flex;
  flex-direction: column;
  padding: 16px;
  background-color: var(--color-background-main);
  border: 1px solid var(--color-border-light);
  border-radius: 8px;
  margin-bottom: 12px;
  transition: all 0.15s ease;
  cursor: pointer;
}

.project-card:hover {
  background-color: var(--color-background-hover);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.project-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.project-card-header-left {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
}

.project-card-chevron {
  width: 16px;
  height: 16px;
  color: var(--color-text-secondary);
  transition: transform 0.3s ease;
  flex-shrink: 0;
}

.project-card-chevron.expanded {
  transform: rotate(90deg);
}

.project-card-info {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.project-card-name {
  font-size: 15px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.project-card-description {
  font-size: 13px;
  color: var(--color-text-secondary);
  margin-top: 2px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.project-card-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
}

.project-card-count {
  font-size: 13px;
  color: var(--color-text-secondary);
}

.project-card-tasks {
  margin-top: 12px;
  padding-left: 24px;
  overflow: hidden;
  transition: max-height 0.3s ease;
}

.project-card-tasks.collapsed {
  max-height: 0;
  margin-top: 0;
}

.project-card-more {
  margin-top: 8px;
  font-size: 13px;
  color: var(--color-primary);
  cursor: pointer;
  padding-left: 24px;
}

.project-card-more:hover {
  text-decoration: underline;
}
```

---

#### Standalone Tasksセクション

**セクションヘッダー:**
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STANDALONE TASKS - 2
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**説明:**
- プロジェクトに属さないタスク
- エリアに直接属するタスク
- 標準のタスクアイテム表示

---

### 3. 空状態

#### エリア一覧が空

```
┌────────────────────────────────────────────────┐
│                                                │
│          [FolderIcon (64px)]                   │
│                                                │
│          No areas yet                          │
│    Organize your tasks with areas              │
│                                                │
│          [+ New Project]                       │
│                                                │
└────────────────────────────────────────────────┘
```

#### エリア詳細でプロジェクトが空

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PROJECTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    [RectangleStackIcon (48px)]

    No projects in this area
    Create a project to get started

    [+ New Project]
```

---

## インタラクション仕様

### エリアカード

**クリック:**
- エリア詳細ビューに遷移
- URL: `/areas/{area_name}`
- パラメータをエンコード

**ホバー:**
- 背景色: background-sidebar
- シャドウ: 0 4px 12px rgba(0, 0, 0, 0.1)
- 上方向に2px移動（transform: translateY(-2px)）

### プロジェクトカード

**ヘッダークリック:**
- プロジェクトを展開/折りたたみ
- Chevronアイコンを回転
- タスクリストをアニメーション表示/非表示
- トランジション: 300ms ease

**プロジェクト名クリック（オプション）:**
- 専用のプロジェクト詳細ビューに遷移
- URL: `/projects/{project_name}`

**"+ X more tasks" クリック:**
- プロジェクト詳細ビューに遷移
- または全タスクを表示（展開）

### New Projectボタン

**クリック:**
- プロジェクト作成モーダルを開く
- エリア一覧ビュー: エリア選択可能
- エリア詳細ビュー: 現在のエリアが自動選択

---

## データ連携

### API エンドポイント

**エリア一覧取得:**
```
GET /areas
Response: Area[]
```

**レスポンス例:**
```json
[
  {
    "id": "area-1",
    "name": "仕事",
    "project_count": 5
  },
  {
    "id": "area-2",
    "name": "個人",
    "project_count": 2
  }
]
```

**エリア詳細取得:**
```
GET /areas/{area_name}
Response: AreaDetail
```

**レスポンス例:**
```json
{
  "projects": [
    {
      "id": "proj-1",
      "name": "ウェブサイト改修",
      "task_count": 3,
      "description": "コーポレートサイトのリニューアル",
      "deadline": "2026-02-15"
    }
  ],
  "standalone_tasks": [
    {
      "id": "task-1",
      "title": "経費精算",
      "status": "open",
      "due_date": "2026-02-10",
      "tags": ["仕事"]
    }
  ]
}
```

**プロジェクトタスク取得:**
```
GET /projects/{project_name}/tasks
Response: Task[]
```

### クライアント側処理

**プロジェクトプレビュー生成:**
```typescript
const getProjectPreview = (projects: Project[]): string => {
  const names = projects.slice(0, 3).map(p => p.name);
  const preview = names.join(' • ');
  return projects.length > 3 ? `${preview}...` : preview;
};
```

**タスク件数計算:**
```typescript
const getTotalTasks = (areaDetail: AreaDetail): number => {
  const projectTasks = areaDetail.projects.reduce((sum, p) => sum + p.task_count, 0);
  const standaloneTasks = areaDetail.standalone_tasks.length;
  return projectTasks + standaloneTasks;
};
```

---

## ローディング状態

### エリア一覧スケルトン

```
┌─────────────────────────────────────────────────────┐
│ ▯▯ ▯▯▯▯▯▯▯▯▯▯▯▯▯▯▯▯▯▯▯    ▯▯▯▯▯▯▯▯▯▯▯▯▯       │
│     ▯▯▯▯▯▯▯▯▯ • ▯▯▯▯▯▯▯▯▯ • ▯▯▯▯▯▯▯▯▯          │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ ▯▯ ▯▯▯▯▯▯▯▯▯▯▯▯▯▯▯▯▯▯▯    ▯▯▯▯▯▯▯▯▯▯▯▯▯       │
│     ▯▯▯▯▯▯▯▯▯ • ▯▯▯▯▯▯▯▯▯                       │
└─────────────────────────────────────────────────────┘
```

### エリア詳細スケルトン

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
▯▯▯▯▯▯▯▯▯▯▯▯▯▯
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

┌─────────────────────────────────────────────────────┐
│ ▶ ▯▯▯▯▯▯▯▯▯▯▯▯▯▯▯▯▯▯▯▯▯    ▯▯▯▯▯▯▯            │
│   ▯▯▯▯▯▯▯▯▯▯▯▯▯▯▯▯                             │
└─────────────────────────────────────────────────────┘
```

---

## レスポンシブ対応

### デスクトップ (≥ 1024px)
- エリアカード: 2カラムグリッド（オプション）
- プロジェクトカード: 単一カラム
- パディング: 32px

### タブレット (768px - 1023px)
- エリアカード: 単一カラム
- パディング: 24px

### モバイル (< 768px)
- エリアカード: 単一カラム、コンパクト表示
- プロジェクトプレビュー: 非表示
- パディング: 16px

---

## アクセシビリティ

### ARIAラベル

```html
<!-- エリア一覧 -->
<div role="list" aria-label="Areas">
  <div role="listitem" aria-label="Area: 仕事, 5 projects">
    <button
      aria-expanded="false"
      aria-label="View 仕事 area details"
    >
      <!-- エリアカード内容 -->
    </button>
  </div>
</div>

<!-- プロジェクトカード -->
<div role="listitem">
  <button
    aria-expanded="false"
    aria-controls="project-tasks-1"
    aria-label="Expand プロジェクトA, 3 tasks"
  >
    <!-- プロジェクトヘッダー -->
  </button>
  <div id="project-tasks-1" role="list" aria-label="Project tasks">
    <!-- タスクリスト -->
  </div>
</div>
```

### キーボードナビゲーション

- `Tab`: 次のエリア/プロジェクトにフォーカス
- `Enter` / `Space`: エリア詳細表示、またはプロジェクト展開/折りたたみ
- `↑` / `↓`: エリア/プロジェクト間を移動

---

## 実装ノート

1. **遅延読み込み**: プロジェクトのタスクは展開時にAPI取得（オプション）
2. **状態保持**: プロジェクトの展開/折りたたみ状態をlocalStorageに保存
3. **キャッシュ**: エリア一覧とプロジェクトデータをキャッシュして高速化
4. **無限スクロール**: プロジェクト数が多い場合は無限スクロール実装

---

**関連ドキュメント:**
- `docs/design_system.md` - デザインシステム全体
- `resources/mockups/dashboard.md` - ダッシュボード全体構造
- `resources/mockups/task_create_form.md` - タスク作成フォーム
- `resources/mockups/project_create_form.md` - プロジェクト作成フォーム（未作成）

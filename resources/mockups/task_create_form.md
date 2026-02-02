# UIモックアップ仕様: タスク作成フォーム

**画面名**: Task Create Form (Modal)
**作成日**: 2026-02-01
**作成者**: Designer Agent

---

## 概要

タスク作成フォームは、新規タスクを作成するためのモーダルダイアログです。Things3のQuick Entryに相当し、最小限の入力で素早くタスクを追加できる一方、必要に応じて詳細情報も設定可能です。

---

## レイアウト構造

```
     ┌────────────────────────────────────────────────┐
     │                  Overlay                       │
     │     ┌──────────────────────────────────┐       │
     │     │  [×]               New Task      │       │
     │     ├──────────────────────────────────┤       │
     │     │                                  │       │
     │     │  Title *                         │       │
     │     │  ┌────────────────────────────┐ │       │
     │     │  │ タスク名を入力...           │ │       │
     │     │  └────────────────────────────┘ │       │
     │     │                                  │       │
     │     │  Notes                           │       │
     │     │  ┌────────────────────────────┐ │       │
     │     │  │ メモを入力...（任意）      │ │       │
     │     │  │                            │ │       │
     │     │  │                            │ │       │
     │     │  └────────────────────────────┘ │       │
     │     │                                  │       │
     │     │  Due Date                        │       │
     │     │  ┌────────────────────────────┐ │       │
     │     │  │ [📅] 期限を選択（任意）    │ │       │
     │     │  └────────────────────────────┘ │       │
     │     │                                  │       │
     │     │  Tags                            │       │
     │     │  ┌────────────────────────────┐ │       │
     │     │  │ [#] タグを追加...           │ │       │
     │     │  └────────────────────────────┘ │       │
     │     │  [買い物] [家事]               │       │
     │     │                                  │       │
     │     │  Destination                     │       │
     │     │  ┌────────────────────────────┐ │       │
     │     │  │ 📥 Inbox            ▼      │ │       │
     │     │  └────────────────────────────┘ │       │
     │     │                                  │       │
     │     ├──────────────────────────────────┤       │
     │     │  [Cancel]          [Create Task] │       │
     │     └──────────────────────────────────┘       │
     │                                                │
     └────────────────────────────────────────────────┘
```

---

## コンポーネント詳細

### 1. モーダルオーバーレイ

**スタイル:**
```css
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
```

**インタラクション:**
- オーバーレイクリック: モーダルを閉じる（変更がある場合は確認ダイアログ）
- Escキー: モーダルを閉じる

---

### 2. モーダルコンテナ

**寸法:**
- 幅: 600px
- 最大高さ: 90vh
- パディング: 24px
- ボーダーラディウス: 12px
- 背景: white
- シャドウ: 0 20px 60px rgba(0, 0, 0, 0.2)

**スタイル:**
```css
.modal-content {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
  max-width: 600px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  animation: slideUp 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
```

---

### 3. ヘッダー

**レイアウト:**
```
┌──────────────────────────────────┐
│  [×]               New Task      │
└──────────────────────────────────┘
```

**要素:**

1. **タイトル**
   - テキスト: "New Task"
   - フォントサイズ: 20px
   - フォントウェイト: 600
   - カラー: text-primary
   - 中央寄せ

2. **閉じるボタン**
   - 位置: 右上
   - アイコン: XMarkIcon (20px)
   - サイズ: 36x36px
   - スタイル: アイコンボタン
   - カラー: text-secondary
   - ホバー: background-hover

**スタイル:**
```css
.modal-header {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--color-border-light);
}

.modal-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.modal-close-button {
  position: absolute;
  top: 0;
  right: 0;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background-color: transparent;
  color: var(--color-text-secondary);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.15s ease;
}

.modal-close-button:hover {
  background-color: var(--color-background-hover);
  color: var(--color-text-primary);
}
```

---

### 4. フォームフィールド

#### タイトル（必須）

**レイアウト:**
```
Title *
┌────────────────────────────┐
│ タスク名を入力...           │
└────────────────────────────┘
```

**要素:**
- ラベル: "Title *"
- フォントサイズ: 13px
- フォントウェイト: 600
- カラー: text-primary
- マージン下: 8px

**入力フィールド:**
- タイプ: text
- プレースホルダー: "タスク名を入力..."
- 必須項目
- オートフォーカス（モーダル表示時）

**バリデーション:**
- 空の場合: "タスク名は必須です"
- 最大長: 500文字

**スタイル:**
```css
.form-field {
  margin-bottom: 20px;
}

.form-label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: 8px;
}

.form-label-required::after {
  content: " *";
  color: var(--color-error);
}

.form-input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid var(--color-border-light);
  border-radius: 6px;
  font-size: 15px;
  color: var(--color-text-primary);
  transition: all 0.15s ease;
  background-color: white;
}

.form-input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px var(--color-primary-light);
}

.form-input::placeholder {
  color: var(--color-text-tertiary);
}

.form-input.error {
  border-color: var(--color-error);
}

.form-error {
  font-size: 12px;
  color: var(--color-error);
  margin-top: 4px;
}
```

---

#### メモ（任意）

**レイアウト:**
```
Notes
┌────────────────────────────┐
│ メモを入力...（任意）      │
│                            │
│                            │
└────────────────────────────┘
```

**入力フィールド:**
- タイプ: textarea
- プレースホルダー: "メモを入力...（任意）"
- 行数: 4行
- リサイズ: vertical（縦方向のみ）
- 最大長: 2000文字

**スタイル:**
```css
.form-textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid var(--color-border-light);
  border-radius: 6px;
  font-size: 15px;
  color: var(--color-text-primary);
  font-family: var(--font-sans);
  resize: vertical;
  min-height: 80px;
  transition: all 0.15s ease;
}

.form-textarea:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px var(--color-primary-light);
}

.form-textarea::placeholder {
  color: var(--color-text-tertiary);
}
```

---

#### 期限（任意）

**レイアウト:**
```
Due Date
┌────────────────────────────┐
│ [📅] 期限を選択（任意）    │
└────────────────────────────┘
```

**入力フィールド:**
- タイプ: date
- プレースホルダー: "期限を選択（任意）"
- アイコン: CalendarIcon (左側、16px)
- 最小日付: 今日
- カレンダーピッカー表示

**クイック選択オプション（オプション機能）:**
```
┌────────────────────────────┐
│ [📅] 期限を選択（任意）    │
│                            │
│ • Today                    │
│ • Tomorrow                 │
│ • This Weekend             │
│ • Next Week                │
│ • Custom...                │
└────────────────────────────┘
```

**スタイル:**
```css
.form-date-input {
  width: 100%;
  padding: 10px 12px 10px 40px;
  border: 1px solid var(--color-border-light);
  border-radius: 6px;
  font-size: 15px;
  color: var(--color-text-primary);
  background-color: white;
  cursor: pointer;
  transition: all 0.15s ease;
  position: relative;
}

.form-date-input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px var(--color-primary-light);
}

.form-date-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  color: var(--color-text-secondary);
  pointer-events: none;
}

.form-date-shortcuts {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-top: 8px;
  padding: 8px;
  background-color: var(--color-background-sidebar);
  border-radius: 6px;
}

.form-date-shortcut {
  padding: 8px 12px;
  background: white;
  border: 1px solid var(--color-border-light);
  border-radius: 4px;
  font-size: 13px;
  color: var(--color-text-primary);
  cursor: pointer;
  transition: all 0.15s ease;
  text-align: left;
}

.form-date-shortcut:hover {
  background-color: var(--color-background-hover);
  border-color: var(--color-primary);
}
```

---

#### タグ（任意）

**レイアウト:**
```
Tags
┌────────────────────────────┐
│ [#] タグを追加...           │
└────────────────────────────┘
[買い物] [家事] [重要]
```

**入力フィールド:**
- タイプ: text
- プレースホルダー: "タグを追加..."
- アイコン: TagIcon (左側、16px)
- Enterキー: タグを追加
- カンマ区切り: 複数タグ一括入力

**タグバッジ:**
- 追加されたタグを下部に表示
- クリックで削除
- カラー: ランダムまたは選択可能
- スタイル: design_system.md参照

**オートコンプリート（オプション）:**
- 既存タグの候補を表示
- 矢印キーで選択
- Enterで追加

**スタイル:**
```css
.form-tag-input-wrapper {
  position: relative;
}

.form-tag-input {
  width: 100%;
  padding: 10px 12px 10px 40px;
  border: 1px solid var(--color-border-light);
  border-radius: 6px;
  font-size: 15px;
  color: var(--color-text-primary);
  transition: all 0.15s ease;
}

.form-tag-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  color: var(--color-text-secondary);
  pointer-events: none;
}

.form-tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 8px;
}

.form-tag-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  color: white;
  background-color: var(--color-tag-blue);
  cursor: pointer;
  transition: all 0.15s ease;
}

.form-tag-badge:hover {
  opacity: 0.8;
}

.form-tag-remove {
  width: 14px;
  height: 14px;
  color: white;
}

.form-tag-autocomplete {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 4px;
  background: white;
  border: 1px solid var(--color-border-light);
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  max-height: 200px;
  overflow-y: auto;
  z-index: 10;
}

.form-tag-suggestion {
  padding: 8px 12px;
  font-size: 13px;
  color: var(--color-text-primary);
  cursor: pointer;
  transition: all 0.15s ease;
}

.form-tag-suggestion:hover,
.form-tag-suggestion.active {
  background-color: var(--color-background-selected);
}
```

---

#### 所属先（任意）

**レイアウト:**
```
Destination
┌────────────────────────────┐
│ 📥 Inbox            ▼      │
└────────────────────────────┘
```

**入力フィールド:**
- タイプ: select
- デフォルト: "Inbox"
- オプション:
  - Inbox
  - Today
  - エリア名
    - プロジェクト名（インデント）

**ドロップダウン構造:**
```
┌────────────────────────────┐
│ 📥 Inbox                   │
│ 📅 Today                   │
│ ───────────────────────── │
│ 📂 仕事                    │
│   • プロジェクトA          │
│   • プロジェクトB          │
│ 📂 個人                    │
│   • 健康                   │
│   • 趣味                   │
└────────────────────────────┘
```

**スタイル:**
```css
.form-select-wrapper {
  position: relative;
}

.form-select {
  width: 100%;
  padding: 10px 40px 10px 40px;
  border: 1px solid var(--color-border-light);
  border-radius: 6px;
  font-size: 15px;
  color: var(--color-text-primary);
  background-color: white;
  cursor: pointer;
  appearance: none;
  transition: all 0.15s ease;
}

.form-select:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px var(--color-primary-light);
}

.form-select-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  color: var(--color-text-secondary);
  pointer-events: none;
}

.form-select-chevron {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  color: var(--color-text-secondary);
  pointer-events: none;
}

.form-select option {
  padding: 8px;
}

.form-select option[data-indent="1"] {
  padding-left: 32px;
}
```

---

### 5. フッター（アクションボタン）

**レイアウト:**
```
┌──────────────────────────────────┐
│  [Cancel]          [Create Task] │
└──────────────────────────────────┘
```

**要素:**

1. **Cancelボタン**
   - スタイル: セカンダリボタン
   - テキスト: "Cancel"
   - クリック: モーダルを閉じる（変更確認あり）

2. **Create Taskボタン**
   - スタイル: プライマリボタン
   - テキスト: "Create Task"
   - クリック: フォーム送信
   - 無効化: タイトルが空の場合

**スタイル:**
```css
.modal-footer {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid var(--color-border-light);
}

.modal-footer-left {
  flex: 1;
}

.modal-footer-right {
  flex: 1;
  display: flex;
  justify-content: flex-end;
}
```

---

## インタラクション仕様

### フォーム送信

**フロー:**
1. バリデーションチェック
2. タイトルが空の場合: エラー表示、送信中断
3. すべて有効な場合:
   - ボタン無効化
   - ローディングインジケータ表示
   - API呼び出し (`POST /todos`)
4. 成功時:
   - トースト通知 "タスクを作成しました"
   - モーダルを閉じる
   - タスクリストを更新
5. 失敗時:
   - エラーメッセージ表示
   - ボタン再有効化
   - リトライ可能

**API リクエスト:**
```json
POST /todos
Content-Type: application/json

{
  "title": "牛乳を買う",
  "notes": "低脂肪乳",
  "due_date": "2026-02-01",
  "tags": ["買い物", "家事"],
  "list": "inbox"
}
```

### キーボードショートカット

- `Enter`: フォーカスがボタン以外の場合、フォーム送信（タイトルが必須）
- `Esc`: モーダルを閉じる
- `Tab`: 次のフィールドに移動
- `Shift + Tab`: 前のフィールドに移動

### バリデーション

**リアルタイム:**
- タイトル入力中: 文字数カウント表示（オプション）
- タイトルが空: Create Taskボタン無効化
- 期限: 過去の日付は選択不可

**送信時:**
- タイトル必須チェック
- 文字数制限チェック
- エラーがある場合: 該当フィールドにフォーカス + エラーメッセージ

---

## ローディング状態

### 送信中

```
┌──────────────────────────────────┐
│  [Cancel]     [⟳ Creating...]    │
└──────────────────────────────────┘
```

**スタイル:**
```css
.button-loading {
  position: relative;
  color: transparent;
}

.button-loading::after {
  content: "";
  position: absolute;
  width: 16px;
  height: 16px;
  top: 50%;
  left: 50%;
  margin-left: -8px;
  margin-top: -8px;
  border: 2px solid white;
  border-radius: 50%;
  border-top-color: transparent;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
```

---

## レスポンシブ対応

### デスクトップ (≥ 1024px)
- モーダル幅: 600px
- フォームフィールド: フル幅

### タブレット (768px - 1023px)
- モーダル幅: 90vw
- フォームフィールド: フル幅

### モバイル (< 768px)
- モーダル幅: 95vw
- モーダル高さ: 全画面（100vh）
- パディング: 16px
- フォントサイズ: やや縮小

---

## アクセシビリティ

### ARIAラベル

```html
<div
  role="dialog"
  aria-labelledby="modal-title"
  aria-modal="true"
>
  <h2 id="modal-title">New Task</h2>

  <form>
    <label for="task-title">
      Title <span aria-label="required">*</span>
    </label>
    <input
      id="task-title"
      type="text"
      required
      aria-required="true"
      aria-invalid="false"
      aria-describedby="title-error"
    />
    <span id="title-error" role="alert" class="form-error">
      <!-- エラーメッセージ -->
    </span>

    <!-- 他のフィールド -->
  </form>
</div>
```

### フォーカス管理

- モーダル表示時: タイトル入力にフォーカス
- モーダル内でフォーカストラップ（Tabキー循環）
- モーダル閉じる時: 開いたボタンにフォーカス戻す

---

## 実装ノート

1. **フォーム状態管理**: React Hook Form または Formik を使用
2. **バリデーション**: Zod または Yup でスキーマ定義
3. **日付ピッカー**: `react-datepicker` または Native HTML5 date input
4. **オートコンプリート**: `downshift` または `react-select`
5. **フォーカストラップ**: `focus-trap-react` ライブラリ使用

---

**関連ドキュメント:**
- `docs/design_system.md` - デザインシステム全体
- `resources/mockups/dashboard.md` - ダッシュボード全体構造
- `resources/mockups/inbox.md` - Inbox画面
- `resources/mockups/search.md` - 検索画面

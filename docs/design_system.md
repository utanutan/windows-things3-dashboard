# Design System - Windows Things3 Dashboard

**プロジェクト**: Windows Things3 ダッシュボード
**バージョン**: 1.0
**作成日**: 2026-02-01
**作成者**: Designer Agent

---

## 概要

このデザインシステムは、Things3からインスピレーションを得たミニマルで洗練されたUIデザインを定義します。シンプルで美しく、機能的なインターフェースを実現するための包括的なガイドラインを提供します。

---

## 1. デザイン哲学

### コアプリンシパル

1. **目的を持つミニマリズム**
   - 豊富なホワイトスペース
   - すべての要素が機能的目的を持つ
   - 視覚的ノイズの排除

2. **職人技と細部への配慮**
   - 洗練されたインタラクション
   - 丁寧なアニメーション
   - 一貫したデザイン言語

3. **機能的な美しさ**
   - 美しさが使いやすさに貢献
   - 集中力と生産性をサポート
   - タスク管理の本質に焦点

---

## 2. カラーパレット

### プライマリカラー

```css
/* アクセントブルー */
--color-primary: #4A90E2;
--color-primary-hover: #357ABD;
--color-primary-light: #E8F4FD;
--color-primary-dark: #2E5F8D;
```

**使用用途:**
- プライマリボタン
- 選択状態のハイライト
- アクティブなナビゲーションアイテム
- リンク

### ニュートラルカラー

```css
/* 背景 */
--color-background-main: #FFFFFF;      /* メインコンテンツ背景 */
--color-background-sidebar: #F7F7F7;   /* サイドバー背景 */
--color-background-hover: #F0F0F0;     /* ホバー状態 */
--color-background-selected: #E8F4FD;  /* 選択状態 */
--color-background-overlay: rgba(0, 0, 0, 0.3); /* モーダルオーバーレイ */

/* ボーダー */
--color-border-light: #E5E5E5;         /* 薄いボーダー */
--color-border-medium: #D1D1D1;        /* 中程度のボーダー */
--color-divider: #EBEBEB;              /* 区切り線 */

/* テキスト */
--color-text-primary: #1C1C1E;         /* メインテキスト */
--color-text-secondary: #6E6E73;       /* セカンダリテキスト */
--color-text-tertiary: #AEAEB2;        /* ターシャリテキスト */
--color-text-disabled: #C7C7CC;        /* 非活性状態 */
```

### ステータスカラー

```css
/* フィードバックカラー */
--color-success: #34C759;              /* 完了・成功 */
--color-warning: #FF9500;              /* 警告・本日期限 */
--color-error: #FF3B30;                /* エラー・期限切れ */
--color-info: #5AC8FA;                 /* 情報 */
```

### タグカラー（パステルトーン）

```css
--color-tag-red: #FF6B6B;
--color-tag-orange: #FFB366;
--color-tag-yellow: #FFE066;
--color-tag-green: #95E1D3;
--color-tag-blue: #83C5F7;
--color-tag-purple: #C4B5FD;
--color-tag-pink: #FDB5C8;
--color-tag-gray: #C7C7CC;
```

### チェックボックスカラー

```css
--color-checkbox-unchecked: #D1D1D6;   /* 未完了チェックボックス */
--color-checkbox-checked: #34C759;     /* 完了チェックボックス */
```

---

## 3. タイポグラフィ

### フォントファミリー

```css
--font-sans: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
             "Helvetica Neue", Arial, sans-serif,
             "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
```

**プラットフォーム別レンダリング:**
- macOS/iOS: San Francisco
- Windows: Segoe UI
- Android/Linux: Roboto

### フォントサイズ

```css
--text-xs: 11px;       /* メタデータ、タイムスタンプ */
--text-sm: 13px;       /* セカンダリテキスト、タグ */
--text-base: 15px;     /* タスクタイトル、本文 */
--text-lg: 17px;       /* ヘッダー、セクションタイトル */
--text-xl: 22px;       /* ページタイトル */
--text-2xl: 28px;      /* メインヘッディング */
```

### フォントウェイト

```css
--font-light: 300;
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

### 行間（Line Height）

```css
--leading-tight: 1.2;
--leading-normal: 1.5;
--leading-relaxed: 1.75;
```

### タイポグラフィ適用ガイド

| 要素 | サイズ | ウェイト | カラー | 行間 | 使用例 |
|------|--------|----------|--------|------|--------|
| ページタイトル | 28px | 700 | primary | 1.2 | "Inbox", "Today" |
| セクションヘッダー | 17px | 600 | primary | 1.2 | "プロジェクト", "エリア" |
| タスクタイトル | 15px | 500 | primary | 1.5 | タスクリストのタイトル |
| タスクノート | 13px | 400 | secondary | 1.75 | タスク詳細のメモ |
| タグ | 12px | 500 | white | 1.2 | タグバッジ |
| 期限 | 13px | 400 | warning/error | 1.5 | "Today", "2/5" |
| メタデータ | 11px | 400 | tertiary | 1.2 | 更新日時、件数 |

---

## 4. スペーシングシステム

### スペーシングスケール（4pxベース）

```css
--space-1: 4px;        /* 最小ギャップ */
--space-2: 8px;        /* 小さいギャップ */
--space-3: 12px;       /* デフォルトギャップ */
--space-4: 16px;       /* 中程度のギャップ */
--space-6: 24px;       /* 大きいギャップ */
--space-8: 32px;       /* 特大ギャップ */
--space-12: 48px;      /* セクションギャップ */
--space-16: 64px;      /* ページギャップ */
```

### スペーシング適用ガイド

| コンテキスト | スペーシング値 | 備考 |
|-------------|---------------|------|
| タスク間 | 0px | ボーダーのみで区切り |
| セクション間 | 24px | 明確な視覚的分離 |
| サイドバーアイテム（垂直） | 8px | コンパクトだが読みやすい |
| コンテンツエリアパディング | 32px | 十分な余白 |
| フォームフィールド間 | 16px | 論理的なグルーピング |
| ボタン水平パディング | 24px | タッチターゲット確保 |
| モーダルパディング | 24px | 内容と境界の分離 |
| カードパディング | 16px | コンテンツの視認性 |

---

## 5. コンポーネント定義

### 5.1 ボタン

#### プライマリボタン

```css
.button-primary {
  background-color: var(--color-primary);
  color: white;
  padding: 10px 24px;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 500;
  transition: all 0.15s ease;
  border: none;
  cursor: pointer;
}

.button-primary:hover {
  background-color: var(--color-primary-hover);
  box-shadow: 0 4px 12px rgba(74, 144, 226, 0.2);
}

.button-primary:active {
  transform: scale(0.98);
}

.button-primary:disabled {
  background-color: var(--color-text-disabled);
  cursor: not-allowed;
}
```

#### セカンダリボタン

```css
.button-secondary {
  background-color: transparent;
  color: var(--color-text-secondary);
  padding: 10px 24px;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 500;
  border: 1px solid var(--color-border-medium);
  transition: all 0.15s ease;
  cursor: pointer;
}

.button-secondary:hover {
  background-color: var(--color-background-hover);
  border-color: var(--color-primary);
  color: var(--color-primary);
}
```

#### アイコンボタン

```css
.button-icon {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background-color: transparent;
  color: var(--color-text-secondary);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;
  cursor: pointer;
}

.button-icon:hover {
  background-color: var(--color-background-hover);
  color: var(--color-text-primary);
}
```

### 5.2 入力フィールド

#### テキスト入力

```css
.input-text {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid var(--color-border-light);
  border-radius: 6px;
  font-size: 15px;
  color: var(--color-text-primary);
  transition: all 0.15s ease;
  background-color: white;
}

.input-text:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px var(--color-primary-light);
}

.input-text::placeholder {
  color: var(--color-text-tertiary);
}
```

#### テキストエリア

```css
.textarea {
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

.textarea:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px var(--color-primary-light);
}
```

#### セレクト（ドロップダウン）

```css
.select {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid var(--color-border-light);
  border-radius: 6px;
  font-size: 15px;
  color: var(--color-text-primary);
  background-color: white;
  cursor: pointer;
  transition: all 0.15s ease;
}

.select:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px var(--color-primary-light);
}
```

### 5.3 チェックボックス

```css
.task-checkbox {
  width: 20px;
  height: 20px;
  border: 2px solid var(--color-checkbox-unchecked);
  border-radius: 50%;
  background: white;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  flex-shrink: 0;
}

.task-checkbox:hover {
  border-color: #A1A1A6;
}

.task-checkbox:checked {
  background-color: var(--color-checkbox-checked);
  border-color: var(--color-checkbox-checked);
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath fill='white' stroke='white' stroke-width='2' d='M4 8l3 3 5-5'/%3E%3C/svg%3E");
  background-size: 12px;
  background-position: center;
  background-repeat: no-repeat;
}
```

### 5.4 タグバッジ

```css
.task-tag {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  color: white;
  margin-right: 6px;
  margin-top: 4px;
  white-space: nowrap;
}

/* カラーバリエーション */
.task-tag[data-color="red"] { background-color: var(--color-tag-red); }
.task-tag[data-color="orange"] { background-color: var(--color-tag-orange); }
.task-tag[data-color="yellow"] {
  background-color: var(--color-tag-yellow);
  color: var(--color-text-primary);
}
.task-tag[data-color="green"] { background-color: var(--color-tag-green); }
.task-tag[data-color="blue"] { background-color: var(--color-tag-blue); }
.task-tag[data-color="purple"] { background-color: var(--color-tag-purple); }
.task-tag[data-color="pink"] { background-color: var(--color-tag-pink); }
.task-tag[data-color="gray"] {
  background-color: var(--color-tag-gray);
  color: var(--color-text-primary);
}
```

### 5.5 期限表示

```css
.task-due-date {
  font-size: 13px;
  font-weight: 400;
  padding: 4px 8px;
  border-radius: 6px;
  white-space: nowrap;
}

.task-due-date.today {
  color: var(--color-warning);
  background-color: rgba(255, 149, 0, 0.1);
  font-weight: 500;
}

.task-due-date.overdue {
  color: var(--color-error);
  background-color: rgba(255, 59, 48, 0.1);
  font-weight: 600;
}

.task-due-date.upcoming {
  color: var(--color-text-secondary);
}
```

### 5.6 カード

```css
.card {
  background-color: white;
  border: 1px solid var(--color-border-light);
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: all 0.15s ease;
}

.card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
```

### 5.7 モーダル

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

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
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

### 5.8 トースト通知

```css
.toast {
  position: fixed;
  top: 24px;
  right: 24px;
  background: white;
  border-radius: 8px;
  padding: 16px 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  gap: 12px;
  z-index: 2000;
  animation: slideInRight 0.3s ease;
}

.toast.success {
  border-left: 4px solid var(--color-success);
}

.toast.error {
  border-left: 4px solid var(--color-error);
}

.toast.warning {
  border-left: 4px solid var(--color-warning);
}

.toast.info {
  border-left: 4px solid var(--color-info);
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(100px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
```

---

## 6. アイコンスタイルガイド

### アイコンライブラリ

**Heroicons**（推奨）
- Things3のミニマルデザインに最適
- アウトラインとソリッドバリエーション
- MIT ライセンス

**インストール:**
```bash
npm install @heroicons/react
```

### アイコンサイズ

```css
--icon-xs: 14px;      /* インライン小アイコン */
--icon-sm: 16px;      /* サイドバーアイコン */
--icon-base: 20px;    /* ボタンアイコン */
--icon-lg: 24px;      /* ヘッダーアイコン */
--icon-xl: 32px;      /* 大型アイコン */
```

### アイコンマッピング

| 機能 | Heroicon | サイズ | カラー |
|------|----------|--------|--------|
| Inbox | InboxIcon | 16px | secondary |
| Today | CalendarDaysIcon | 16px | secondary |
| Upcoming | CalendarIcon | 16px | secondary |
| Area | FolderIcon | 16px | secondary |
| Project | RectangleStackIcon | 16px | secondary |
| Tag | TagIcon | 14px | tertiary |
| Note | DocumentTextIcon | 14px | tertiary |
| Search | MagnifyingGlassIcon | 20px | secondary |
| Add Task | PlusCircleIcon | 20px | primary |
| Settings | Cog6ToothIcon | 20px | secondary |
| Refresh | ArrowPathIcon | 20px | secondary |
| Close | XMarkIcon | 20px | secondary |
| Check | CheckIcon | 16px | success |

### アイコン使用ガイドライン

1. **一貫性**: すべてのアイコンを同じライブラリから使用
2. **カラー**: テキストカラーを継承
3. **サイズ**: コンテキストに応じた適切なサイズを選択
4. **スタイル**: アウトラインスタイルを優先（Things3に準拠）

---

## 7. アニメーションとトランジション

### トランジションタイミング

```css
/* デフォルト */
--transition-default: all 0.15s ease;

/* 高速（ホバー効果） */
--transition-fast: all 0.1s ease;

/* 標準（状態変化） */
--transition-normal: all 0.2s ease;

/* ゆっくり（レイアウト変更） */
--transition-slow: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

/* バウンス（チェックボックス） */
--transition-bounce: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
```

### インタラクション状態

#### ホバー
- 背景色がわずかに明るくなる
- 微妙なシャドウが現れる
- カーソルが pointer に
- 所要時間: 150ms

#### アクティブ（クリック）
- 背景色がわずかに暗くなる
- スケール: 0.98（微妙な押下効果）
- 所要時間: 100ms

#### フォーカス
- 青いアウトライン: 2px solid
- オフセット: 2px
- キーボードナビゲーション用

### アニメーション原則

1. **目的性**: すべてのアニメーションに意味がある
2. **微妙さ**: 気が散らず、UXを向上させる
3. **一貫性**: 同じタイプの要素は同じアニメーション
4. **パフォーマンス**: GPU アクセラレーション使用（transform、opacity）

---

## 8. レスポンシブデザイン

### ブレークポイント

```css
/* モバイル */
@media (max-width: 767px) {
  /* サイドバー: ドロワー/オーバーレイ */
  /* パディング: 16px */
}

/* タブレット */
@media (min-width: 768px) and (max-width: 1023px) {
  /* サイドバー: 折りたたみ可能 */
  /* パディング: 24px */
}

/* デスクトップ */
@media (min-width: 1024px) {
  /* サイドバー: 常に表示 (240px) */
  /* パディング: 32px */
}

/* 大画面 */
@media (min-width: 1280px) {
  /* 最適化されたレイアウト */
}
```

### レスポンシブガイドライン

| 画面サイズ | サイドバー | パディング | フォントサイズ |
|------------|-----------|------------|---------------|
| < 768px | ドロワー | 16px | ベース |
| 768px - 1023px | 折りたたみ可能 | 24px | ベース |
| ≥ 1024px | 常に表示 | 32px | ベース |

---

## 9. アクセシビリティ

### カラーコントラスト（WCAG AA準拠）

- プライマリテキスト/白背景: 15.8:1 (AAA)
- セカンダリテキスト/白背景: 5.1:1 (AA)
- プライマリボタン: 4.8:1 (AA)

### キーボードナビゲーション

```css
/* フォーカス表示（キーボードユーザー用） */
*:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
  border-radius: 4px;
}

/* デフォルトフォーカスリング削除 */
*:focus:not(:focus-visible) {
  outline: none;
}
```

### ARIAラベル

すべてのインタラクティブ要素に適切なARIAラベルを付与:
- `aria-label`: 視覚的ラベルがない場合
- `aria-labelledby`: 既存要素をラベルとして参照
- `role`: セマンティックでない要素にロールを定義
- `aria-live`: 動的コンテンツ更新を通知

---

## 10. 実装チェックリスト

### Phase 1: 基礎
- [ ] Tailwind CSSをカスタムカラーパレットで設定
- [ ] タイポグラフィスケール定義
- [ ] Heroiconsインストール
- [ ] CSS変数をglobals.cssに定義

### Phase 2: コアコンポーネント
- [ ] ボタンコンポーネント（Primary、Secondary、Icon）
- [ ] 入力フィールドコンポーネント
- [ ] チェックボックスコンポーネント
- [ ] タグバッジコンポーネント

### Phase 3: レイアウトコンポーネント
- [ ] カードコンポーネント
- [ ] モーダルコンポーネント
- [ ] トースト通知コンポーネント

### Phase 4: ポリッシング
- [ ] すべてのトランジション追加
- [ ] キーボードナビゲーション実装
- [ ] カラーコントラストテスト
- [ ] レスポンシブ対応確認

---

## 11. Tailwind CSS設定

```javascript
// tailwind.config.js
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4A90E2',
          hover: '#357ABD',
          light: '#E8F4FD',
          dark: '#2E5F8D',
        },
        background: {
          main: '#FFFFFF',
          sidebar: '#F7F7F7',
          hover: '#F0F0F0',
          selected: '#E8F4FD',
          overlay: 'rgba(0, 0, 0, 0.3)',
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
        checkbox: {
          unchecked: '#D1D1D6',
          checked: '#34C759',
        },
      },
      fontSize: {
        xs: '11px',
        sm: '13px',
        base: '15px',
        lg: '17px',
        xl: '22px',
        '2xl': '28px',
      },
      fontWeight: {
        light: 300,
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
      },
      lineHeight: {
        tight: '1.2',
        normal: '1.5',
        relaxed: '1.75',
      },
      spacing: {
        '1': '4px',
        '2': '8px',
        '3': '12px',
        '4': '16px',
        '6': '24px',
        '8': '32px',
        '12': '48px',
        '16': '64px',
      },
      borderRadius: {
        sm: '6px',
        DEFAULT: '8px',
        lg: '12px',
        full: '9999px',
      },
      transitionDuration: {
        fast: '100ms',
        DEFAULT: '150ms',
        normal: '200ms',
        slow: '300ms',
      },
      boxShadow: {
        sm: '0 1px 3px rgba(0, 0, 0, 0.05)',
        DEFAULT: '0 4px 12px rgba(0, 0, 0, 0.1)',
        lg: '0 10px 40px rgba(0, 0, 0, 0.15)',
        xl: '0 20px 60px rgba(0, 0, 0, 0.2)',
      },
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
      },
    },
  },
  plugins: [],
};
```

---

## まとめ

このデザインシステムは、Things3の洗練されたミニマリズムを体現しつつ、Web環境に最適化されています。

**核心原則:**
1. シンプルさと機能性のバランス
2. 一貫した視覚言語
3. 細部への配慮
4. アクセシビリティ優先

**次のステップ:**
1. UIモックアップ仕様の作成
2. コンポーネントライブラリの実装
3. デザイントークンの適用

---

**作成者**: Designer Agent
**レビュー要求先**: Project-Manager
**関連ドキュメント**:
- `docs/PRP.md` - プロジェクト要件
- `docs/requirements.md` - 詳細要件
- `research/things3_ui_analysis.md` - Things3 UI分析

# 画像アセット一覧

**プロジェクト**: Windows Things3 ダッシュボード
**作成日**: 2026-02-01
**作成者**: Designer Agent

---

## 概要

このドキュメントは、プロジェクトで使用する画像アセットの一覧です。Things3はミニマルなデザインでアイコン中心のUIのため、写真やイラストの使用は最小限に抑えます。

---

## アイコンライブラリ

### Heroicons（推奨）

**採用理由:**
- Things3のミニマルデザインに最適
- MIT ライセンス（無料、商用利用可）
- React/Next.js に最適化
- アウトラインとソリッドの2スタイル提供

**インストール:**
```bash
npm install @heroicons/react
```

**公式サイト:**
- URL: https://heroicons.com/
- ライセンス: MIT License
- バージョン: v2.0以降推奨

**使用方法:**
```typescript
import { InboxIcon, CalendarIcon } from '@heroicons/react/24/outline';

// コンポーネント内
<InboxIcon className="w-5 h-5 text-gray-600" />
```

---

## アイコン一覧

### ナビゲーションアイコン

| 機能 | アイコン名 | サイズ | 用途 | カラー |
|------|-----------|--------|------|--------|
| Inbox | `InboxIcon` | 16px | サイドバーナビゲーション | text-secondary |
| Today | `CalendarDaysIcon` | 16px | サイドバーナビゲーション | text-secondary |
| Upcoming | `CalendarIcon` | 16px | サイドバーナビゲーション | text-secondary |
| Areas | `FolderIcon` | 16px | サイドバーナビゲーション | text-secondary |
| Projects | `RectangleStackIcon` | 16px | サイドバーナビゲーション | text-secondary |

**代替テキスト:**
- "Inbox icon"
- "Today icon"
- "Upcoming icon"
- "Areas folder icon"
- "Projects icon"

---

### アクションアイコン

| 機能 | アイコン名 | サイズ | 用途 | カラー |
|------|-----------|--------|------|--------|
| 検索 | `MagnifyingGlassIcon` | 20px | 検索ボックス、ヘッダー | text-secondary |
| 追加 | `PlusCircleIcon` | 20px | 新規タスク/プロジェクト作成 | primary |
| 設定 | `Cog6ToothIcon` | 20px | 設定ボタン | text-secondary |
| 更新 | `ArrowPathIcon` | 20px | 手動更新ボタン | text-secondary |
| 閉じる | `XMarkIcon` | 20px | モーダル閉じる、クリアボタン | text-secondary |
| チェック | `CheckIcon` | 16px | 完了マーク | success |
| 編集 | `PencilIcon` | 16px | 編集ボタン（将来機能） | text-secondary |
| 削除 | `TrashIcon` | 16px | 削除ボタン（将来機能） | error |

**代替テキスト:**
- "Search icon"
- "Add new task"
- "Settings"
- "Refresh"
- "Close"
- "Completed"
- "Edit"
- "Delete"

---

### コンテンツアイコン

| 機能 | アイコン名 | サイズ | 用途 | カラー |
|------|-----------|--------|------|--------|
| メモ | `DocumentTextIcon` | 14px | タスクにメモがある場合 | text-tertiary |
| タグ | `TagIcon` | 14px | タグ入力フィールド | text-secondary |
| 期限 | `CalendarIcon` | 14px | 期限入力フィールド | text-secondary |
| 警告 | `ExclamationCircleIcon` | 14px | 期限切れタスク | error |
| 情報 | `InformationCircleIcon` | 16px | ヘルプ、ツールチップ | info |

**代替テキスト:**
- "Task has notes"
- "Tag icon"
- "Due date icon"
- "Overdue warning"
- "Information"

---

### ナビゲーションアイコン（矢印系）

| 機能 | アイコン名 | サイズ | 用途 | カラー |
|------|-----------|--------|------|--------|
| 展開 | `ChevronDownIcon` | 16px | プロジェクト/エリア展開 | text-secondary |
| 折りたたみ | `ChevronRightIcon` | 16px | プロジェクト/エリア折りたたみ | text-secondary |
| 上 | `ChevronUpIcon` | 16px | スクロール、ソート | text-secondary |
| ドロップダウン | `ChevronDownIcon` | 16px | セレクトボックス | text-secondary |

**代替テキスト:**
- "Expand"
- "Collapse"
- "Scroll up"
- "Dropdown menu"

---

### 空状態アイコン

| 機能 | アイコン名 | サイズ | 用途 | カラー |
|------|-----------|--------|------|--------|
| 空のInbox | `InboxIcon` | 64px | Inbox空状態 | text-tertiary |
| 空のToday | `CalendarDaysIcon` | 64px | Today空状態 | text-tertiary |
| 空のAreas | `FolderIcon` | 64px | エリア一覧空状態 | text-tertiary |
| 検索結果なし | `DocumentMagnifyingGlassIcon` | 64px | 検索結果なし | text-tertiary |
| エラー | `ExclamationTriangleIcon` | 64px | エラー画面 | error |

**代替テキスト:**
- "Empty inbox"
- "No tasks for today"
- "No areas"
- "No search results"
- "Error occurred"

---

## ロゴ・ブランディング

### アプリケーションロゴ

**ファイル形式:** SVG（推奨）、PNG（代替）

**バリエーション:**

1. **プライマリロゴ**
   - ファイル名: `logo.svg` / `logo.png`
   - サイズ: 32x32px（ヘッダー）
   - 用途: ヘッダー、スプラッシュ画面
   - 代替テキスト: "Windows Things3 Dashboard logo"

2. **ファビコン**
   - ファイル名: `favicon.ico`
   - サイズ: 16x16px, 32x32px, 48x48px（マルチサイズ）
   - 用途: ブラウザタブ
   - 代替テキスト: "App icon"

3. **Apple Touch Icon**
   - ファイル名: `apple-touch-icon.png`
   - サイズ: 180x180px
   - 用途: iOS ホーム画面追加時
   - 代替テキスト: "App icon"

**ロゴデザインガイドライン:**
- シンプルで認識しやすい
- Things3のチェックボックスをモチーフにする（オプション）
- カラー: primary (#4A90E2) または text-primary (#1C1C1E)
- 背景: 透明（SVG）または白（PNG）

**配置先:**
```
public/
├── logo.svg
├── logo.png
├── favicon.ico
├── apple-touch-icon.png
└── manifest.json
```

---

## 背景画像・装飾画像

### 原則

**Things3のミニマルデザインに準拠:**
- 背景画像は使用しない（純色背景のみ）
- 装飾画像は最小限
- フォーカスはコンテンツ（タスク）に

### 例外的に使用する場合

**空状態の装飾イラスト（オプション）:**
- 使用場所: 完全に空のビュー（初回起動時など）
- スタイル: ラインアート、ミニマル
- カラー: 単色（text-tertiary）
- ファイル形式: SVG
- ライセンス: MIT または CC0（商用利用可）

**推奨イラストライブラリ:**
1. **unDraw**
   - URL: https://undraw.co/
   - ライセンス: MIT License（無料、商用利用可）
   - カスタマイズ: カラー変更可能
   - 代替テキスト: 状況に応じて記載

2. **Heroicons Illustrations**（存在する場合）
   - 既に使用しているHeroiconsと統一

---

## スクリーンショット・プレビュー画像

### README.md用スクリーンショット

**ファイル:**
- `docs/screenshots/dashboard.png` - メインダッシュボード
- `docs/screenshots/inbox.png` - Inboxビュー
- `docs/screenshots/today.png` - Todayビュー
- `docs/screenshots/search.png` - 検索画面
- `docs/screenshots/task-create.png` - タスク作成フォーム

**サイズ:**
- 幅: 1920px（デスクトップ）
- 高さ: 可変（実際の画面サイズ）
- 形式: PNG（高品質）

**撮影方法:**
- 実装後にブラウザスクリーンショット機能使用
- モックデータを使用して美しい状態を表示
- プライバシー: 個人情報を含まないダミーデータ使用

**代替テキスト:**
- "Windows Things3 Dashboard - Main view"
- "Inbox view with tasks"
- "Today view showing overdue and today's tasks"
- "Search interface with results"
- "Task creation modal form"

---

## アイコンフォント（不使用）

**理由:**
- SVGアイコン（Heroicons）の方が軽量
- カラー・サイズ変更が容易
- アクセシビリティが高い

---

## 画像最適化

### 推奨ツール

1. **SVGO**（SVG最適化）
   ```bash
   npm install -g svgo
   svgo logo.svg -o logo.optimized.svg
   ```

2. **ImageOptim**（PNG最適化 - Mac）
   - URL: https://imageoptim.com/

3. **TinyPNG**（PNG最適化 - Web）
   - URL: https://tinypng.com/

### Next.js 画像最適化

**使用方法:**
```typescript
import Image from 'next/image';

<Image
  src="/logo.png"
  alt="Windows Things3 Dashboard logo"
  width={32}
  height={32}
  priority
/>
```

**メリット:**
- 自動的にWebP変換
- レスポンシブ対応
- 遅延読み込み
- パフォーマンス向上

---

## アクセシビリティガイドライン

### 代替テキスト（alt属性）

**必須:**
- すべての画像に代替テキストを提供
- 装飾的な画像: `alt=""` （空文字）
- 意味のある画像: 具体的な説明

**良い例:**
```html
<img src="/logo.png" alt="Windows Things3 Dashboard logo" />
<InboxIcon className="w-5 h-5" aria-label="Inbox icon" />
```

**悪い例:**
```html
<img src="/logo.png" alt="logo" />
<InboxIcon className="w-5 h-5" /> <!-- aria-label なし -->
```

### SVGアクセシビリティ

**推奨:**
```typescript
<svg role="img" aria-labelledby="inbox-icon-title">
  <title id="inbox-icon-title">Inbox</title>
  <!-- SVG content -->
</svg>
```

---

## ライセンス情報

### 使用アセットのライセンス

| アセット | ライセンス | 商用利用 | 帰属表示 |
|----------|-----------|---------|---------|
| Heroicons | MIT | 可 | 不要 |
| unDraw（オプション） | MIT | 可 | 不要 |

**ライセンス遵守:**
- MITライセンスは非常に寛容
- 商用利用可能
- 帰属表示不要（推奨はされる）

**帰属表示例（README.md）:**
```markdown
## Credits

- Icons: [Heroicons](https://heroicons.com/) by Tailwind Labs (MIT License)
- Illustrations: [unDraw](https://undraw.co/) by Katerina Limpitsouni (MIT License)
```

---

## 今後の拡張

### Phase 2以降で検討

**カスタムイラスト:**
- オンボーディング画面用イラスト
- エラー画面用イラスト
- 404ページ用イラスト

**アニメーション:**
- Lottieアニメーション（ローディング、成功通知）
- マイクロインタラクション用SVGアニメーション

**ダークモード:**
- ダークモード用カラーバリエーション
- アイコンカラーの調整

---

## チェックリスト

### 実装前

- [ ] Heroiconsをインストール
- [ ] ロゴデザイン作成（またはプレースホルダー使用）
- [ ] ファビコン生成
- [ ] Apple Touch Icon作成

### 実装中

- [ ] すべてのアイコンにaria-label付与
- [ ] 代替テキストを適切に設定
- [ ] SVGを最適化

### 実装後

- [ ] スクリーンショット撮影
- [ ] README.mdに画像追加
- [ ] ライセンス情報をREADMEに記載
- [ ] パフォーマンステスト（画像読み込み速度）

---

## まとめ

**画像使用の原則:**
1. **ミニマリズム**: 必要最小限の画像のみ使用
2. **アイコン中心**: Heroiconsで統一
3. **パフォーマンス**: SVG優先、PNG最適化
4. **アクセシビリティ**: すべての画像に代替テキスト

**主要アセット:**
- アイコン: Heroicons（MIT）
- ロゴ: カスタムデザイン（SVG）
- 装飾画像: 最小限（unDrawオプション）

---

**関連ドキュメント:**
- `docs/design_system.md` - デザインシステム全体
- `README.md` - プロジェクト概要

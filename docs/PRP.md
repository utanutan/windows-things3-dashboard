# PRP.md (Windows Client Development Plan)

# プロジェクト概要
Mac上のThings3タスクデータを閲覧するためのWindows用Webダッシュボードを開発します。
バックエンド（Mac側）は別途Python/FastAPIで構築され、Tailscale経由でJSONデータを配信します。
本ドキュメントでは、**Windows側クライアント（フロントエンド）の開発内容、計画、および接続先となるAPIインターフェース**を定義します。

## 開発スコープ (Windows側)

### 要件
1.  **デザイン再現**: Things3のUI/UX（ミニマル、ホワイトスペース、タイポグラフィ）を忠実に再現する。
    - サイドバー（Inbox, Today, Upcoming, Areas/Projects）
    - メインタスクリスト（チェックボックス、タイトル、タグ、メモ、期限）
2.  **API連携**: Mac側のAPIサーバーからデータを非同期(`fetch`)で取得し表示する。
3.  **レスポンシブ**: デスクトップ利用を主とするが、ウィンドウサイズ変更に追従すること。
4.  **モック開発**: Mac環境が手元にない場合でも開発できるよう、モックデータを使用するモードを用意すること。

## API インターフェース仕様 (Mac API Server)

Mac側のAPIサーバーは以下のエンドポイントを提供します。Windowsクライアントはこれらを消費します。
**Base URL**: `http://<MAC_TAILSCALE_IP>:8000`

### 1. インボックス取得
- **Endpoint**: `GET /inbox`
- **Response**:
```json
[
  {
    "id": "taskId1",
    "title": "牛乳を買う",
    "notes": "低脂肪乳",
    "due_date": "2026-02-01",
    "tags": ["買い物", "家事"],
    "status": "open"
  }
]
```

### 2. "今日"のタスク取得
- **Endpoint**: `GET /today`
- **Response**: (同上)

### 3. エリア一覧取得
- **Endpoint**: `GET /areas`
- **Response**:
```json
[
  {
    "id": "areaId1",
    "name": "仕事",
    "project_count": 5
  },
  {
    "id": "areaId2",
    "name": "個人",
    "project_count": 2
  }
]
```

### 4. エリア詳細（プロジェクト・タスク含む）取得
- **Endpoint**: `GET /areas/{area_name}`
- **Response**:
```json
{
  "projects": [
    {
      "id": "projId1",
      "name": "ウェブサイト改修",
      "task_count": 3
    }
  ],
  "standalone_tasks": [
    {
       "id": "taskId2",
       "title": "経費精算",
       "status": "open"
    }
  ]
}
```
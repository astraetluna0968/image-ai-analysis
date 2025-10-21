# AI画像分析システム

## 概要

外部AI APIで画像を分析し、その結果をデータベースに保存するシステム。
実際のAPIが存在しないため、Mock実装で動作を再現しています。

**フルスタック実装**: バックエンドAPI + React UI

## 技術スタック

### バックエンド
- **言語**: TypeScript
- **フレームワーク**: Express
- **データベース**: MySQL 8.0
- **テストフレームワーク**: Vitest
- **ロギング**: Winston

### フロントエンド
- **言語**: TypeScript
- **フレームワーク**: React
- **ビルドツール**: Vite
- **スタイリング**: Tailwind CSS
- **HTTP通信**: Axios

## プロジェクト構造

```
image-ai-analysis-omata/
├── backend/
│   ├── src/
│   │   ├── adapters/           # 外部API抽象化層
│   │   │   ├── IAiApiAdapter.ts
│   │   │   └── MockAiApiAdapter.ts
│   │   ├── repositories/       # データアクセス層
│   │   │   └── AnalysisLogRepository.ts
│   │   ├── services/           # ビジネスロジック層
│   │   │   └── AnalysisService.ts
│   │   ├── controllers/        # HTTPリクエスト処理層
│   │   │   └── AnalysisController.ts
│   │   ├── middleware/
│   │   │   └── errorHandler.ts
│   │   ├── types.ts            # 型定義
│   │   ├── config.ts           # 設定
│   │   ├── logger.ts           # ロガー
│   │   ├── app.ts              # Expressアプリ
│   │   └── server.ts           # サーバー起動
│   ├── __tests__/              # テストコード
│   │   ├── services/
│   │   │   └── AnalysisService.test.ts
│   │   └── controllers/
│   │       └── AnalysisController.test.ts
│   ├── package.json
│   ├── tsconfig.json
│   └── vitest.config.ts
├── frontend/                   # React UI
│   ├── src/
│   │   ├── components/
│   │   │   ├── AnalysisForm.tsx
│   │   │   └── ResultDisplay.tsx
│   │   ├── hooks/
│   │   │   └── useAnalysis.ts
│   │   ├── api/
│   │   │   └── analysisApi.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.ts
│   └── tailwind.config.js
├── docker-compose.yml          # MySQL環境
├── init.sql                    # DB初期化スクリプト
└── README.md
```

## アーキテクチャ

### レイヤードアーキテクチャ

```
Controller層 → Service層 → Adapter層 / Repository層 → DB / 外部API
```

- **Controller層**: HTTPリクエスト/レスポンスの処理
- **Service層**: ビジネスロジック、バリデーション
- **Adapter層**: 外部APIの抽象化（Mock/実装の切り替え可能）
- **Repository層**: データベースアクセスの抽象化

### 設計の利点

1. **テスタビリティ**: 各層を独立してテスト可能
2. **保守性**: 責務が明確で変更の影響範囲が限定的
3. **拡張性**: 実際のAPIへの切り替えが容易（Adapterを差し替えるだけ）
4. **依存性注入**: 疎結合な設計

## セットアップ

### 前提条件

- Node.js 20.x 以上
- Docker

### インストール手順

```bash
# リポジトリクローン
git clone https://github.com/astraetluna0968/image-ai-analysis.git
cd image-ai-analysis

# Docker起動（MySQL）
docker compose up -d

# バックエンドセットアップ
cd backend
npm install
cp .env.example .env

# バックエンド起動
npm run dev
```

バックエンドサーバーが起動: `http://localhost:3001`

```bash
# フロントエンドセットアップ（別ターミナル）
cd frontend
npm install

# フロントエンド起動
npm run dev
```

フロントエンドが起動: `http://localhost:5174`

### 🎨 UIでの使い方

1. ブラウザで `http://localhost:5174` を開く
2. 画像パス入力フォームに `/image/test/sample.jpg` を入力
3. 「分析実行」ボタンをクリック
4. 結果が画面に表示される

**失敗パターンのテスト**: パスに `error` を含める（例: `/image/test/error.jpg`）

## API仕様（開発者向け参考資料）

以下は開発者がAPIを直接テストする際の参考情報です。
通常の利用はReact UI（`http://localhost:5174`）をご利用ください。

### POST /api/analyze

画像分析を実行し、結果をDBに保存

**cURLでのリクエスト例:**
```bash
# 成功ケース
curl -X POST http://localhost:3001/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"image_path": "/image/test/sample.jpg"}'

# 失敗ケース（パスに"error"を含む）
curl -X POST http://localhost:3001/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"image_path": "/image/test/error.jpg"}'

# バリデーションエラー例（/image/で始まらない）
curl -X POST http://localhost:3001/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"image_path": "/photos/test.jpg"}'

# バリデーションエラー例（不正な拡張子）
curl -X POST http://localhost:3001/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"image_path": "/image/test/sample.txt"}'
```

**レスポンス（成功時）:**
```json
{
  "id": 1,
  "success": true,
  "message": "success",
  "estimated_data": {
    "class": 3,
    "confidence": 0.8683
  },
  "requestTimestamp": "2025-10-20T15:21:51.952Z",
  "responseTimestamp": "2025-10-20T15:21:52.057Z"
}
```

**レスポンス（失敗時）:**
```json
{
  "id": 2,
  "success": false,
  "message": "Error:E50012",
  "estimated_data": {},
  "requestTimestamp": "2025-10-20T15:22:04.755Z",
  "responseTimestamp": "2025-10-20T15:22:04.857Z"
}
```

### GET /health

ヘルスチェック

**cURLでのリクエスト例:**
```bash
curl http://localhost:3001/health
```

**レスポンス:**
```json
{
  "status": "ok",
  "timestamp": "2025-10-20T15:22:59.219Z"
}
```

## バリデーション

画像パスには以下の制約があります：

- `/image/` で始まること
- `.jpg`, `.jpeg`, `.png`, `.gif` のいずれかで終わること
- 255文字以内であること

## テスト

```bash
cd backend

# テスト実行
npm test

# カバレッジ付きテスト
npm run test:coverage

# ウォッチモード
npm run test:watch
```

## データベース

### ai_analysis_log テーブル

| カラム名 | 型 | 説明 |
|---------|---|------|
| id | int(11) | 主キー（自動採番） |
| image_path | varchar(255) | 画像ファイルパス |
| success | tinyint(1) | 成功/失敗フラグ |
| message | varchar(255) | メッセージ |
| class | int(11) | 分類結果（NULL許可） |
| confidence | decimal(5,4) | 信頼度（NULL許可） |
| request_timestamp | datetime(6) | リクエスト時刻 |
| response_timestamp | datetime(6) | レスポンス時刻 |

### DB確認方法

```bash
docker exec ai_analysis_mysql mysql -u app_user -papp_password \
  -e "USE ai_analysis; SELECT * FROM ai_analysis_log;"
```

## Mock API実装

実際のAPIが存在しないため、`MockAiApiAdapter`を実装：

- **基本動作**: 成功レスポンス（class: 3, confidence: 0.8683）
- **失敗ケース**: 画像パスに`error`が含まれる場合は失敗レスポンスを返す
- **レスポンスタイム**: 100msのシミュレーション

本番環境では、`IAiApiAdapter`インターフェースを実装した実際のAPIアダプターに差し替えるだけで動作するようにしています。

## トラブルシューティング

### MySQLに接続できない

```bash
# Dockerコンテナの状態確認
docker compose ps

# ログ確認
docker compose logs db

# 再起動
docker compose restart db
```

### ポートが使用中

`.env`ファイルで`PORT`を変更：

```env
PORT=3001
```

### テストが失敗する

```bash
# 依存関係を再インストール
rm -rf node_modules package-lock.json
npm install
```


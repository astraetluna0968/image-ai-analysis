# AI画像分析システム

## 概要

外部AI APIで画像を分析し、その結果をデータベースに保存するシステム。
実際のAPIが存在しないため、Mock実装で動作を再現しています。

## 技術スタック

- **言語**: TypeScript
- **フレームワーク**: Express
- **データベース**: MySQL 8.0
- **テストフレームワーク**: Vitest
- **ロギング**: Winston

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

# 環境変数設定
cp .env.example .env

# 開発サーバー起動
npm run dev
```

サーバーが起動: `http://localhost:3001`

## API仕様

### POST /api/analyze

画像分析を実行し、結果をDBに保存

**リクエスト:**
```bash
curl -X POST http://localhost:3001/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"image_path": "/image/test/sample.jpg"}'
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

本番環境では、`IAiApiAdapter`インターフェースを実装した実際のAPIアダプターに差し替えるだけで動作します。

## 設計判断の理由

### 1. なぜレイヤードアーキテクチャ？

- **責務の分離**: 各層が明確な責任を持つ
- **テスト容易性**: モックを使った単体テストが簡単
- **将来の拡張**: 実APIへの切り替えが容易

### 2. なぜMockを実装？

- 要件: 実際のAPIは存在しない
- テストの再現性: 成功/失敗両方のケースを確実にテスト
- デモ実行: 実際に動作するシステムとして提出可能

### 3. 失敗時もDBに保存する理由

- **トレーサビリティ**: すべてのリクエストを追跡可能
- **デバッグ**: 失敗パターンの分析が可能
- **監査**: システムの動作履歴を完全に記録

### 4. Service層でバリデーション

- **再利用性**: HTTPレイヤーに依存しない
- **テスト容易性**: ビジネスルールを独立してテスト
- **ドメインロジック**: パス形式や拡張子チェックはビジネスルール

## 動作確認例

### 成功ケース

```bash
curl -X POST http://localhost:3001/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"image_path": "/image/test/sample.jpg"}'
```

### 失敗ケース（Mock APIの仕様で失敗）

```bash
curl -X POST http://localhost:3001/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"image_path": "/image/test/error.jpg"}'
```

### バリデーションエラー

```bash
# /image/ で始まらない
curl -X POST http://localhost:3001/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"image_path": "/photos/test.jpg"}'

# 不正な拡張子
curl -X POST http://localhost:3001/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"image_path": "/image/test/sample.txt"}'
```

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

## 今後の拡張案

- [ ] 実際の外部API実装（AiApiAdapter）
- [ ] 履歴取得API（GET /api/logs）
- [ ] React UIの実装
- [ ] リトライ機構（axios-retry）
- [ ] 認証・認可
- [ ] バッチ処理

## ライセンス

MIT

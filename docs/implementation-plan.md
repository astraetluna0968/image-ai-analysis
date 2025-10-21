# AI画像分析システム 実装計画

## 📋 プロジェクト概要

転職活動のコーディング試験課題
**作業時間目安**: 16時間

### コア要件（必須）
- 外部AI APIへ画像パスを送信
- レスポンスをDBに保存（ai_analysis_logテーブル）
- 成功/失敗両方のケースに対応
- request_timestamp/response_timestampの記録
- 実際のAPIは存在しないため、Mock APIを実装

### オプション要件
- UIの作成（任意） → **React実装予定（後回し）**

---

## 🛠 技術スタック

### バックエンド（優先実装）
- **言語**: TypeScript
- **フレームワーク**: Express
- **データベース**: MySQL
- **テストフレームワーク**: Vitest
- **ロギング**: Winston

### フロントエンド（後回し・時間があれば）
- **フレームワーク**: React + TypeScript
- **ビルドツール**: Vite
- **スタイリング**: Tailwind CSS
- **HTTP Client**: Axios

---

## 📦 プロジェクト構造

```
image-ai-analysis-omata/
├── backend/
│   ├── src/
│   │   ├── adapters/
│   │   │   ├── IAiApiAdapter.ts          # インターフェース
│   │   │   └── MockAiApiAdapter.ts        # Mock実装
│   │   ├── repositories/
│   │   │   └── AnalysisLogRepository.ts   # DB操作
│   │   ├── services/
│   │   │   └── AnalysisService.ts         # ビジネスロジック
│   │   ├── controllers/
│   │   │   └── AnalysisController.ts      # HTTPエンドポイント
│   │   ├── middleware/
│   │   │   └── errorHandler.ts            # エラーハンドリング
│   │   ├── types.ts                       # 型定義
│   │   ├── config.ts                      # 設定
│   │   ├── logger.ts                      # ロガー
│   │   ├── app.ts                         # Express setup
│   │   └── server.ts                      # サーバー起動
│   ├── __tests__/
│   │   ├── services/
│   │   │   └── AnalysisService.test.ts
│   │   └── controllers/
│   │       └── AnalysisController.test.ts
│   ├── package.json
│   ├── tsconfig.json
│   ├── vitest.config.ts
│   └── .env
├── docker-compose.yml
├── init.sql                               # DB初期化スクリプト
├── .gitignore
└── README.md
```

### フロントエンド構造（後で実装）
```
frontend/                                  # 時間があれば実装
├── src/
│   ├── components/
│   │   ├── AnalysisForm.tsx
│   │   └── ResultDisplay.tsx
│   ├── hooks/
│   │   └── useAnalysis.ts
│   ├── types.ts
│   ├── api.ts
│   ├── App.tsx
│   └── main.tsx
├── package.json
└── vite.config.ts
```

---

## 🎯 実装タスク（18時間）

### Phase 1: 環境構築（1.5時間）
1. ✅ プロジェクト構造作成
2. ✅ docker-compose.yml作成（MySQL）
3. ✅ init.sql作成（ai_analysis_logテーブル）
4. ✅ package.json、tsconfig.json、vitest.config.ts設定

### Phase 2: コア実装（6時間）
5. ✅ 型定義作成（types.ts）
6. ✅ 設定ファイル作成（config.ts、logger.ts）
7. ✅ Mock AI API Adapter実装
8. ✅ Repository層実装（DB保存処理）
9. ✅ Service層実装（ビジネスロジック）
10. ✅ Controller層実装（POST /api/analyze）
11. ✅ Expressアプリケーション構築
12. ✅ 動作確認（Postman/cURL）

### Phase 3: テスト実装（4時間）
13. ✅ Service層ユニットテスト
14. ✅ Controller層ユニットテスト
15. ✅ テスト実行とカバレッジ確認（80%以上目標）

### Phase 4: ドキュメント・仕上げ（2.5時間）
16. ✅ README.md作成
17. ✅ コード整理とコメント追記
18. ✅ 最終動作確認

### Phase 5: フロントエンド（オプション・時間があれば）
19. ⏸ React + Vite セットアップ
20. ⏸ Tailwind CSS設定
21. ⏸ API通信実装（axios）
22. ⏸ フォームコンポーネント実装
23. ⏸ 結果表示コンポーネント実装

**予備時間**: 4時間（デバッグ・調整）

---

## 🗄 データベース仕様

### ai_analysis_logテーブル

```sql
CREATE TABLE `ai_analysis_log` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `image_path` varchar(255) DEFAULT NULL,
  `success` tinyint(1) NOT NULL,
  `message` varchar(255) DEFAULT NULL,
  `class` int(11) DEFAULT NULL,
  `confidence` decimal(5,4) DEFAULT NULL,
  `request_timestamp` datetime(6) DEFAULT NULL,
  `response_timestamp` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
```

---

## 🔌 API仕様

### 外部AI API（Mock実装）

**URL**: `http://example.com/` (実際は存在しない)
**メソッド**: POST
**パラメーター**:
```json
{
  "image_path": "/image/d03f1d36ca69348c51aa/c413eac329e1c0d03/test.jpg"
}
```

**レスポンス（成功時）**:
```json
{
  "success": true,
  "message": "success",
  "estimated_data": {
    "class": 3,
    "confidence": 0.8683
  }
}
```

**レスポンス（失敗時）**:
```json
{
  "success": false,
  "message": "Error:E50012",
  "estimated_data": {}
}
```

### 実装するAPI（バックエンド）

#### POST /api/analyze
画像分析を実行し、結果をDBに保存

**リクエスト**:
```json
{
  "image_path": "/image/test/sample.jpg"
}
```

**レスポンス（成功時）**:
```json
{
  "id": 1,
  "success": true,
  "message": "success",
  "estimated_data": {
    "class": 3,
    "confidence": 0.8683
  },
  "requestTimestamp": "2024-01-15T10:30:45.123Z",
  "responseTimestamp": "2024-01-15T10:30:46.456Z"
}
```

**レスポンス（失敗時）**:
```json
{
  "id": 2,
  "success": false,
  "message": "Error:E50012",
  "estimated_data": {},
  "requestTimestamp": "2024-01-15T10:30:45.123Z",
  "responseTimestamp": "2024-01-15T10:30:46.456Z"
}
```

---

## 🏗 アーキテクチャ設計

### レイヤードアーキテクチャ

```
┌─────────────────────────────────────┐
│       Controller層                  │  HTTPリクエスト処理
│  AnalysisController                 │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│       Service層                     │  ビジネスロジック
│  AnalysisService                    │  - バリデーション
└──────┬──────────────────┬───────────┘  - API呼び出し
       │                  │              - DB保存
┌──────▼──────────┐  ┌───▼────────────┐
│  Adapter層      │  │ Repository層   │
│  MockAiApi      │  │ AnalysisLog    │
│  Adapter        │  │ Repository     │
└─────────────────┘  └────────┬───────┘
                              │
                     ┌────────▼────────┐
                     │   MySQL DB      │
                     └─────────────────┘
```

### 設計の利点
1. **テスタビリティ**: 各層を独立してテスト可能
2. **保守性**: 責務が明確で変更の影響範囲が限定的
3. **拡張性**: 実際のAPIへの切り替えが容易（Adapterを差し替えるだけ）
4. **依存性注入**: 疎結合な設計でモックが容易

---

## 🧪 テスト方針

### Service層テスト（最優先）
- ✅ 正常系: API成功時のDB保存
- ✅ 異常系: API失敗時のDB保存
- ✅ エラー系: バリデーションエラー
- ✅ エッジケース: パス長制限など

### Controller層テスト
- ✅ HTTPステータスコード検証
- ✅ リクエストパラメータ検証
- ✅ レスポンス形式検証

### カバレッジ目標
- **80%以上**（Service層とController層）

---

## 🔧 Mock API実装の詳細

### MockAiApiAdapter仕様
- **成功率**: 80%（ランダム）
- **class値**: 0-9のランダム整数
- **confidence値**: 0.7-1.0のランダム小数（小数点4桁）
- **レスポンスタイム**: 100-500msのシミュレーション
- **失敗時エラー**: "Error:E50012"など

### 実装のポイント
```typescript
interface IAiApiAdapter {
  analyze(imagePath: string): Promise<AiApiResponse>;
}

class MockAiApiAdapter implements IAiApiAdapter {
  async analyze(imagePath: string): Promise<AiApiResponse> {
    // レスポンスタイムをシミュレート
    await this.delay(Math.random() * 400 + 100);

    // 80%の確率で成功
    if (Math.random() < 0.8) {
      return {
        success: true,
        message: 'success',
        estimated_data: {
          class: Math.floor(Math.random() * 10),
          confidence: parseFloat((Math.random() * 0.3 + 0.7).toFixed(4))
        }
      };
    } else {
      return {
        success: false,
        message: 'Error:E50012',
        estimated_data: {}
      };
    }
  }
}
```

---

## ✅ 実装チェックリスト

### 必須項目
- [ ] Docker起動（MySQL）
- [ ] バックエンド起動（npm run dev）
- [ ] POST /api/analyze が動作
- [ ] 成功時のレスポンスがDBに保存される
- [ ] 失敗時のレスポンスもDBに保存される
- [ ] request_timestamp/response_timestampが正しく記録される
- [ ] テストがすべてパス（npm test）
- [ ] テストカバレッジ80%以上
- [ ] README.md完成

### 推奨項目
- [ ] エラーハンドリングの確認
- [ ] ログ出力の確認
- [ ] バリデーションの確認
- [ ] コメント・ドキュメントの充実

### オプション項目
- [ ] フロントエンド実装（React）
- [ ] フロントエンドとバックエンドの連携確認
- [ ] UI/UXの調整

---

## 🚀 開発フロー

### 1. 環境構築
```bash
# Docker起動
docker-compose up -d

# バックエンドセットアップ
cd backend
npm install

# 環境変数設定
cp .env.example .env
```

### 2. 開発サーバー起動
```bash
npm run dev
```

### 3. 動作確認（Postman/cURL）
```bash
# 分析実行
curl -X POST http://localhost:3000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"image_path": "/image/test/sample.jpg"}'

# ヘルスチェック
curl http://localhost:3000/health
```

### 4. テスト実行
```bash
# すべてのテスト実行
npm test

# カバレッジ付き
npm run test:coverage

# ウォッチモード
npm run test:watch
```

### 5. フロントエンド実装（時間があれば）
```bash
# フロントエンド作成
npm create vite@latest frontend -- --template react-ts
cd frontend
npm install
npm install axios
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# 開発サーバー起動
npm run dev
```

---

## 📝 重要な設計判断

### 1. なぜレイヤードアーキテクチャか？
- **責務の分離**: 各層が明確な責任を持つ
- **テスト容易性**: モックを使った単体テストが簡単
- **将来の拡張**: 実APIへの切り替えが容易

### 2. なぜMockを実装するのか？
- 要件: 実際のAPIは存在しない
- 現実的なシミュレーション: レスポンスタイム、成功/失敗率
- テストの再現性: 成功/失敗両方のケースを確実にテスト

### 3. なぜTypeScript + Expressか？
- **型安全性**: コンパイル時にエラー検出
- **開発効率**: 慣れた技術スタックで高速開発
- **保守性**: 型定義がドキュメントとして機能

### 4. 失敗時もDBに保存する理由
- **トレーサビリティ**: すべてのリクエストを追跡可能
- **デバッグ**: 失敗パターンの分析が可能
- **監査**: システムの動作履歴を完全に記録

---

## ⏱ 時間配分（18時間）

| フェーズ | 予定時間 | 累計 |
|---------|---------|------|
| 環境構築 | 1.5h | 1.5h |
| コア実装 | 6h | 7.5h |
| テスト実装 | 4h | 11.5h |
| ドキュメント | 2.5h | 14h |
| **予備時間** | 4h | 18h |

### 予備時間の使い道
- デバッグ・調整
- フロントエンド実装（React）
- 追加機能（履歴取得APIなど）
- コード品質向上

---

## 🎯 完成の定義

### Minimum Viable Product (MVP)
1. ✅ POST /api/analyze が動作する
2. ✅ Mock APIレスポンスをDBに保存できる
3. ✅ 成功/失敗両方のケースが動作する
4. ✅ テストがすべてパスする
5. ✅ README.mdでセットアップ手順が説明されている

### 理想の完成形
- ✅ MVP要件すべて
- ✅ テストカバレッジ80%以上
- ✅ React UIで動作確認できる
- ✅ コードコメントが充実している
- ✅ エラーハンドリングが堅牢

---

## 📚 参考資料

### 使用技術ドキュメント
- TypeScript: https://www.typescriptlang.org/
- Express: https://expressjs.com/
- Vitest: https://vitest.dev/
- React: https://react.dev/
- Vite: https://vitejs.dev/

### アーキテクチャパターン
- レイヤードアーキテクチャ
- Repository パターン
- Adapter パターン
- 依存性注入（DI）

---

## 🔄 実装順序（重要）

### ステップ1: 環境構築
1. docker-compose.yml
2. init.sql
3. package.json
4. tsconfig.json

### ステップ2: 型定義と設定
1. types.ts
2. config.ts
3. logger.ts

### ステップ3: 下層から実装
1. adapters/MockAiApiAdapter.ts
2. repositories/AnalysisLogRepository.ts
3. services/AnalysisService.ts
4. controllers/AnalysisController.ts
5. app.ts
6. server.ts

### ステップ4: テスト
1. AnalysisService.test.ts
2. AnalysisController.test.ts

### ステップ5: ドキュメント
1. README.md
2. コードコメント

### ステップ6: フロントエンド（オプション）
1. React setup
2. コンポーネント実装

---

**実装開始準備完了！** 🚀

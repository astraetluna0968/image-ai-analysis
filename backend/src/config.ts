import dotenv from 'dotenv';

// 環境変数を読み込み
dotenv.config();

/**
 * アプリケーション設定
 */
export const config = {
  // サーバー設定
  port: parseInt(process.env.PORT || '3001', 10),
  nodeEnv: process.env.NODE_ENV || 'development',

  // データベース設定
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    user: process.env.DB_USER || 'app_user',
    password: process.env.DB_PASSWORD || 'app_password',
    database: process.env.DB_DATABASE || 'ai_analysis',
  },

  // ロギング設定
  logLevel: process.env.LOG_LEVEL || 'info',
};

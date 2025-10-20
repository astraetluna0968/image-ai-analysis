import winston from 'winston';
import { config } from './config';

/**
 * Winston ロガーの設定
 * 構造化ログをJSON形式で出力
 */
export const logger = winston.createLogger({
  level: config.logLevel,
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'ai-analysis-service' },
  transports: [
    // コンソール出力
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.printf(({ level, message, timestamp, ...meta }) => {
          const metaStr = Object.keys(meta).length ? JSON.stringify(meta) : '';
          return `${timestamp} [${level}]: ${message} ${metaStr}`;
        })
      ),
    }),
    // ファイル出力（エラーログ）
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
    }),
    // ファイル出力（全てのログ）
    new winston.transports.File({
      filename: 'logs/combined.log',
    }),
  ],
});

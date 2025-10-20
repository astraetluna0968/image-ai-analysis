import mysql from 'mysql2/promise';
import { config } from '../config';
import { AnalysisLog } from '../types';
import { logger } from '../logger';

/**
 * 分析ログのRepository
 * データベースへのアクセスを抽象化
 */
export class AnalysisLogRepository {
  private pool: mysql.Pool;

  constructor() {
    // コネクションプールを作成（パフォーマンス最適化）
    this.pool = mysql.createPool({
      host: config.db.host,
      port: config.db.port,
      user: config.db.user,
      password: config.db.password,
      database: config.db.database,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });

    logger.info('Database connection pool created', {
      host: config.db.host,
      database: config.db.database,
    });
  }

  /**
   * 分析ログをDBに保存
   * @param log 保存する分析ログ
   * @returns 保存されたログのID
   */
  async save(log: AnalysisLog): Promise<number> {
    const connection = await this.pool.getConnection();

    try {
      const query = `
        INSERT INTO ai_analysis_log
        (image_path, success, message, class, confidence, request_timestamp, response_timestamp)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;

      const [result] = await connection.execute(query, [
        log.imagePath,
        log.success ? 1 : 0, // tinyint(1)に変換
        log.message,
        log.class,
        log.confidence,
        log.requestTimestamp,
        log.responseTimestamp,
      ]);

      const insertId = (result as mysql.ResultSetHeader).insertId;

      logger.info('Analysis log saved to database', {
        id: insertId,
        imagePath: log.imagePath,
        success: log.success,
      });

      return insertId;
    } catch (error) {
      logger.error('Failed to save analysis log', {
        error: error instanceof Error ? error.message : String(error),
        imagePath: log.imagePath,
      });
      throw error;
    } finally {
      connection.release();
    }
  }

  /**
   * コネクションプールをクローズ
   * アプリケーション終了時に呼び出す
   */
  async close(): Promise<void> {
    await this.pool.end();
    logger.info('Database connection pool closed');
  }
}

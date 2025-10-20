import express from 'express';
import { AnalysisController } from './controllers/AnalysisController';
import { AnalysisService } from './services/AnalysisService';
import { AnalysisLogRepository } from './repositories/AnalysisLogRepository';
import { MockAiApiAdapter } from './adapters/MockAiApiAdapter';
import { errorHandler } from './middleware/errorHandler';
import { logger } from './logger';

/**
 * Expressアプリケーションのセットアップ
 */
export function createApp(): express.Application {
  const app = express();

  // ミドルウェア
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // リクエストログ
  app.use((req, _res, next) => {
    logger.info('Incoming request', {
      method: req.method,
      path: req.path,
      ip: req.ip,
    });
    next();
  });

  // 依存性注入（DI）
  const aiApiAdapter = new MockAiApiAdapter();
  const repository = new AnalysisLogRepository();
  const service = new AnalysisService(aiApiAdapter, repository);
  const controller = new AnalysisController(service);

  // ルーティング
  app.post('/api/analyze', controller.analyze);

  // ヘルスチェック
  app.get('/health', (_req, res) => {
    res.status(200).json({
      status: 'ok',
      timestamp: new Date().toISOString(),
    });
  });

  // 404 エラー
  app.use((_req, res) => {
    res.status(404).json({ error: 'Not found' });
  });

  // エラーハンドラー（最後に配置）
  app.use(errorHandler);

  return app;
}

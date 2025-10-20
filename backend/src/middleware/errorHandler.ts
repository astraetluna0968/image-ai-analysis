import { Request, Response, NextFunction } from 'express';
import { logger } from '../logger';

/**
 * グローバルエラーハンドラー
 * キャッチされなかったエラーを処理
 */
export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
): void => {
  logger.error('Unhandled error', {
    error: error.message,
    stack: error.stack,
    path: req.path,
    method: req.method,
  });

  res.status(500).json({
    error: 'Internal server error',
    message: error.message,
  });
};

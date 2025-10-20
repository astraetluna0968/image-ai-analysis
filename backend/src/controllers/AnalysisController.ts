import { Request, Response } from 'express';
import { AnalysisService } from '../services/AnalysisService';
import { logger } from '../logger';

/**
 * 分析コントローラー
 * HTTPリクエストを処理し、Serviceを呼び出す
 */
export class AnalysisController {
  constructor(private service: AnalysisService) {}

  /**
   * POST /api/analyze
   * 画像分析を実行
   */
  analyze = async (req: Request, res: Response): Promise<void> => {
    try {
      const { image_path } = req.body;

      // リクエストパラメータのバリデーション
      if (!image_path) {
        res.status(400).json({ error: 'image_path is required' });
        return;
      }

      logger.info('Analysis request received', {
        imagePath: image_path,
        ip: req.ip,
      });

      // サービスを呼び出し
      const result = await this.service.analyze(image_path);

      // 成功レスポンス
      res.status(200).json(result);
    } catch (error) {
      logger.error('Analysis request failed', {
        error: error instanceof Error ? error.message : String(error),
      });

      // エラーレスポンス
      res.status(500).json({
        error: error instanceof Error ? error.message : 'Internal server error',
      });
    }
  };
}

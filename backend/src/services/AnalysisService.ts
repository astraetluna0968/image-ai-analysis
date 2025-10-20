import { IAiApiAdapter } from '../adapters/IAiApiAdapter';
import { AnalysisLogRepository } from '../repositories/AnalysisLogRepository';
import { AnalysisResult, AnalysisLog } from '../types';
import { logger } from '../logger';

/**
 * 分析サービス
 * ビジネスロジックを集約
 * - 画像パスのバリデーション
 * - AI APIの呼び出し
 * - 結果のDB保存
 */
export class AnalysisService {
  constructor(
    private aiApiAdapter: IAiApiAdapter,
    private repository: AnalysisLogRepository
  ) {}

  /**
   * 画像分析を実行し、結果をDBに保存
   * @param imagePath 画像ファイルのパス
   * @returns 分析結果
   */
  async analyze(imagePath: string): Promise<AnalysisResult> {
    // バリデーション
    this.validateImagePath(imagePath);

    const requestTimestamp = new Date();
    logger.info('Analysis started', { imagePath, requestTimestamp });

    try {
      // AI APIを呼び出し
      const apiResponse = await this.aiApiAdapter.analyze(imagePath);
      const responseTimestamp = new Date();

      // DB保存用のログオブジェクトを作成
      const log: AnalysisLog = {
        imagePath,
        success: apiResponse.success,
        message: apiResponse.message,
        class: apiResponse.estimated_data.class ?? null,
        confidence: apiResponse.estimated_data.confidence ?? null,
        requestTimestamp,
        responseTimestamp,
      };

      // DBに保存
      const id = await this.repository.save(log);

      logger.info('Analysis completed', {
        id,
        imagePath,
        success: apiResponse.success,
        duration: responseTimestamp.getTime() - requestTimestamp.getTime(),
      });

      // レスポンスを返す
      return {
        id,
        success: apiResponse.success,
        message: apiResponse.message,
        estimated_data: apiResponse.estimated_data,
        requestTimestamp: requestTimestamp.toISOString(),
        responseTimestamp: responseTimestamp.toISOString(),
      };
    } catch (error) {
      // エラーが発生した場合もログに記録
      const responseTimestamp = new Date();
      const errorMessage = error instanceof Error ? error.message : String(error);

      const errorLog: AnalysisLog = {
        imagePath,
        success: false,
        message: errorMessage,
        class: null,
        confidence: null,
        requestTimestamp,
        responseTimestamp,
      };

      await this.repository.save(errorLog);

      logger.error('Analysis failed', {
        imagePath,
        error: errorMessage,
      });

      throw error;
    }
  }

  /**
   * 画像パスのバリデーション
   * @param imagePath 画像ファイルのパス
   */
  private validateImagePath(imagePath: string): void {
    // 空チェック
    if (!imagePath || imagePath.trim() === '') {
      throw new Error('Image path is required');
    }

    // 長さチェック（DB制約: varchar(255)）
    if (imagePath.length > 255) {
      throw new Error('Image path is too long (max 255 characters)');
    }

    // パス形式チェック（/image/ で始まる）
    if (!imagePath.startsWith('/image/')) {
      throw new Error('Image path must start with /image/');
    }

    // 拡張子チェック
    const validExtensions = ['.jpg', '.jpeg', '.png', '.gif'];
    const hasValidExtension = validExtensions.some((ext) =>
      imagePath.toLowerCase().endsWith(ext)
    );

    if (!hasValidExtension) {
      throw new Error('Image path must end with .jpg, .jpeg, .png, or .gif');
    }
  }
}

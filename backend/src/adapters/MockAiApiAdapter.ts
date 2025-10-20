import { IAiApiAdapter } from './IAiApiAdapter';
import { AiApiResponse } from '../types';
import { logger } from '../logger';

/**
 * Mock AI API Adapter
 * 実際のAPIが存在しないため、仕様に基づいてレスポンスを返す
 *
 * シンプルな実装:
 * - 基本的には成功レスポンスを返す
 * - 画像パスに'error'が含まれる場合は失敗レスポンスを返す（テスト用）
 */
export class MockAiApiAdapter implements IAiApiAdapter {
  /**
   * Mock AI分析を実行
   * @param imagePath 画像ファイルのパス
   * @returns シミュレートされたAI分析結果
   */
  async analyze(imagePath: string): Promise<AiApiResponse> {
    logger.info('Mock AI API called', { imagePath });

    // レスポンスタイムをシミュレート（100ms）
    await this.sleep(100);

    // 画像パスに'error'が含まれる場合は失敗を返す（テスト用）
    if (imagePath.toLowerCase().includes('error')) {
      logger.warn('Mock AI API failure', { imagePath });

      return {
        success: false,
        message: 'Error:E50012',
        estimated_data: {},
      };
    }

    // 成功時のレスポンス
    logger.info('Mock AI API success', { imagePath });

    return {
      success: true,
      message: 'success',
      estimated_data: {
        class: 3,
        confidence: 0.8683,
      },
    };
  }

  /**
   * 指定されたミリ秒だけ待機
   * @param ms ミリ秒
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

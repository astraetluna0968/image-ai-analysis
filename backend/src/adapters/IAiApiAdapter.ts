import { AiApiResponse } from '../types';

/**
 * AI API Adapterのインターフェース
 * 実際のAPIとMock実装を切り替え可能にするための抽象化
 */
export interface IAiApiAdapter {
  /**
   * 画像パスを受け取り、AI分析結果を返す
   * @param imagePath 画像ファイルのパス
   * @returns AI分析結果
   */
  analyze(imagePath: string): Promise<AiApiResponse>;
}

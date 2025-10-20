/**
 * 外部AI APIのレスポンス型定義
 * API仕様書に基づく
 */
export interface AiApiResponse {
  success: boolean;
  message: string;
  estimated_data: {
    class?: number;
    confidence?: number;
  };
}

/**
 * 分析ログのDB保存用型定義
 */
export interface AnalysisLog {
  id?: number;
  imagePath: string;
  success: boolean;
  message: string;
  class: number | null;
  confidence: number | null;
  requestTimestamp: Date;
  responseTimestamp: Date;
}

/**
 * 分析結果のレスポンス型定義
 * クライアントへ返却する形式
 */
export interface AnalysisResult {
  id: number;
  success: boolean;
  message: string;
  estimated_data: {
    class?: number;
    confidence?: number;
  };
  requestTimestamp: string;
  responseTimestamp: string;
}

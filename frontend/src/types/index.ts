export interface AnalysisResult {
  id: number;
  imagePath?: string;
  success: boolean;
  message: string;
  estimated_data: {
    class?: number;
    confidence?: number;
  };
  requestTimestamp: string;
  responseTimestamp: string;
}

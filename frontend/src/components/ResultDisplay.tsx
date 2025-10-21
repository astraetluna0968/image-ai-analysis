import type { AnalysisResult } from '../types';

interface ResultDisplayProps {
  result: AnalysisResult | null;
  error: string | null;
}

export const ResultDisplay = ({ result, error }: ResultDisplayProps) => {
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
        <div className="flex items-center mb-2">
          <span className="text-2xl mr-2">❌</span>
          <h3 className="text-lg font-semibold text-red-800">エラー</h3>
        </div>
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  if (!result) {
    return null;
  }

  return (
    <div
      className={`border rounded-lg p-6 mb-6 ${
        result.success
          ? 'bg-green-50 border-green-200'
          : 'bg-red-50 border-red-200'
      }`}
    >
      <div className="flex items-center mb-4">
        <span className="text-2xl mr-2">{result.success ? '✅' : '❌'}</span>
        <h3 className="text-lg font-semibold text-gray-800">
          {result.success ? '分析成功' : '分析失敗'}
        </h3>
      </div>

      <div className="space-y-2">
        <p className="text-sm text-gray-700">
          <span className="font-medium">ID:</span> {result.id}
        </p>
        {result.imagePath && (
          <p className="text-sm text-gray-700">
            <span className="font-medium">画像パス:</span> {result.imagePath}
          </p>
        )}
        <p className="text-sm text-gray-700">
          <span className="font-medium">メッセージ:</span> {result.message}
        </p>

        {result.success && result.estimated_data.class !== undefined && (
          <>
            <p className="text-sm text-gray-700">
              <span className="font-medium">Class:</span>{' '}
              <span className="text-xl font-bold text-blue-600">
                {result.estimated_data.class}
              </span>
            </p>
            <p className="text-sm text-gray-700">
              <span className="font-medium">Confidence:</span>{' '}
              <span className="text-xl font-bold text-blue-600">
                {((result.estimated_data.confidence ?? 0) * 100).toFixed(2)}%
              </span>
            </p>
          </>
        )}

        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            リクエスト: {new Date(result.requestTimestamp).toLocaleString('ja-JP')}
          </p>
          <p className="text-xs text-gray-500">
            レスポンス: {new Date(result.responseTimestamp).toLocaleString('ja-JP')}
          </p>
        </div>
      </div>
    </div>
  );
};

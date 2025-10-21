import { useState, type FormEvent } from 'react';

interface AnalysisFormProps {
  onSubmit: (imagePath: string) => void;
  loading: boolean;
}

export const AnalysisForm = ({ onSubmit, loading }: AnalysisFormProps) => {
  const [imagePath, setImagePath] = useState('/image/test/sample.jpg');
  const [validationError, setValidationError] = useState<string>('');

  const validateImagePath = (path: string): string => {
    if (!path.startsWith('/image/')) {
      return '画像パスは /image/ で始まる必要があります';
    }
    if (path.length > 255) {
      return '画像パスは255文字以内である必要があります';
    }
    const validExtensions = ['.jpg', '.jpeg', '.png', '.gif'];
    const hasValidExtension = validExtensions.some((ext) =>
      path.toLowerCase().endsWith(ext)
    );
    if (!hasValidExtension) {
      return '画像パスは .jpg, .jpeg, .png, .gif のいずれかで終わる必要があります';
    }
    return '';
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const error = validateImagePath(imagePath);
    if (error) {
      setValidationError(error);
      return;
    }
    setValidationError('');
    onSubmit(imagePath);
  };

  const handleInputChange = (value: string) => {
    setImagePath(value);
    // 入力中はエラーをクリア
    if (validationError) {
      setValidationError('');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">画像分析</h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="imagePath"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            画像パス
          </label>
          <input
            type="text"
            id="imagePath"
            value={imagePath}
            onChange={(e) => handleInputChange(e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 text-gray-900 ${
              validationError
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:ring-blue-500'
            }`}
            placeholder="/image/test/sample.jpg"
            disabled={loading}
          />
          {validationError && (
            <p className="mt-2 text-sm text-red-600">{validationError}</p>
          )}
          {!validationError && (
            <p className="mt-2 text-sm text-gray-500">
              形式: /image/.../*.{'{jpg,jpeg,png,gif}'}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
        >
          {loading ? '分析中...' : '分析実行'}
        </button>
      </form>
    </div>
  );
};

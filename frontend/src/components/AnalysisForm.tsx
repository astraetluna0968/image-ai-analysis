import { useState, type FormEvent } from 'react';

interface AnalysisFormProps {
  onSubmit: (imagePath: string) => void;
  loading: boolean;
}

export const AnalysisForm = ({ onSubmit, loading }: AnalysisFormProps) => {
  const [imagePath, setImagePath] = useState('/image/test/sample.jpg');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(imagePath);
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
            onChange={(e) => setImagePath(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            placeholder="/image/test/sample.jpg"
            disabled={loading}
          />
          <p className="mt-2 text-sm text-gray-500">
            形式: /image/.../*.{'{jpg,jpeg,png,gif}'}
          </p>
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

import { useAnalysis } from './hooks/useAnalysis';
import { AnalysisForm } from './components/AnalysisForm';
import { ResultDisplay } from './components/ResultDisplay';

function App() {
  const { analyze, loading, error, result } = useAnalysis();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          AI画像分析システム
        </h1>

        <AnalysisForm onSubmit={analyze} loading={loading} />
        <ResultDisplay result={result} error={error} />

        <div className="text-center text-sm text-gray-500 mt-8">
          <p>
            バックエンドAPI:{' '}
            {import.meta.env.VITE_API_URL || 'http://localhost:3001'}
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;

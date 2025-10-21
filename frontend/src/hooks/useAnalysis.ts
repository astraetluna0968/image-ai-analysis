import { useState } from 'react';
import { analysisApi } from '../api/analysisApi';
import type { AnalysisResult } from '../types';

export const useAnalysis = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const analyze = async (imagePath: string) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await analysisApi.analyze(imagePath);
      setResult({ ...data, imagePath });
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'An error occurred';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { analyze, loading, error, result };
};

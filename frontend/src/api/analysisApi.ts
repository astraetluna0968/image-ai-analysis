import axios from 'axios';
import type { AnalysisResult } from '../types';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const analysisApi = {
  analyze: async (imagePath: string): Promise<AnalysisResult> => {
    const response = await apiClient.post<AnalysisResult>('/api/analyze', {
      image_path: imagePath,
    });
    return response.data;
  },
};

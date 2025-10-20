import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import { AnalysisController } from '../../src/controllers/AnalysisController';
import { AnalysisService } from '../../src/services/AnalysisService';

describe('AnalysisController', () => {
  let mockService: AnalysisService;
  let app: express.Application;

  beforeEach(() => {
    // Mock Service
    mockService = {
      analyze: vi.fn(),
    } as any;

    const controller = new AnalysisController(mockService);

    // Express アプリケーションのセットアップ
    app = express();
    app.use(express.json());
    app.post('/api/analyze', controller.analyze);
  });

  describe('POST /api/analyze', () => {
    it('正常なリクエストで200を返す', async () => {
      // Arrange
      const mockResult = {
        id: 1,
        success: true,
        message: 'success',
        estimated_data: { class: 3, confidence: 0.8683 },
        requestTimestamp: new Date().toISOString(),
        responseTimestamp: new Date().toISOString(),
      };
      (mockService.analyze as any).mockResolvedValue(mockResult);

      // Act
      const response = await request(app)
        .post('/api/analyze')
        .send({ image_path: '/image/test/sample.jpg' });

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.id).toBe(1);
      expect(response.body.estimated_data.class).toBe(3);
      expect(mockService.analyze).toHaveBeenCalledWith('/image/test/sample.jpg');
    });

    it('image_pathがない場合400を返す', async () => {
      // Act
      const response = await request(app)
        .post('/api/analyze')
        .send({});

      // Assert
      expect(response.status).toBe(400);
      expect(response.body.error).toBe('image_path is required');
      expect(mockService.analyze).not.toHaveBeenCalled();
    });

    it('Serviceがエラーを投げた場合500を返す', async () => {
      // Arrange
      (mockService.analyze as any).mockRejectedValue(new Error('Invalid path'));

      // Act
      const response = await request(app)
        .post('/api/analyze')
        .send({ image_path: 'invalid' });

      // Assert
      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Invalid path');
    });

    it('API失敗時のレスポンスを正しく返す', async () => {
      // Arrange
      const mockResult = {
        id: 2,
        success: false,
        message: 'Error:E50012',
        estimated_data: {},
        requestTimestamp: new Date().toISOString(),
        responseTimestamp: new Date().toISOString(),
      };
      (mockService.analyze as any).mockResolvedValue(mockResult);

      // Act
      const response = await request(app)
        .post('/api/analyze')
        .send({ image_path: '/image/test/error.jpg' });

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(false);
      expect(response.body.id).toBe(2);
      expect(response.body.message).toBe('Error:E50012');
    });
  });
});

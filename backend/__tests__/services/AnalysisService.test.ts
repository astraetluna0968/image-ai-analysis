import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AnalysisService } from '../../src/services/AnalysisService';
import { IAiApiAdapter } from '../../src/adapters/IAiApiAdapter';
import { AnalysisLogRepository } from '../../src/repositories/AnalysisLogRepository';
import { AiApiResponse } from '../../src/types';

describe('AnalysisService', () => {
  let service: AnalysisService;
  let mockAdapter: IAiApiAdapter;
  let mockRepository: AnalysisLogRepository;

  beforeEach(() => {
    // Mock Adapter
    mockAdapter = {
      analyze: vi.fn(),
    };

    // Mock Repository
    mockRepository = {
      save: vi.fn(),
      close: vi.fn(),
    } as any;

    service = new AnalysisService(mockAdapter, mockRepository);
  });

  describe('analyze - 成功ケース', () => {
    it('API成功時、結果をDBに保存して返す', async () => {
      // Arrange
      const mockApiResponse: AiApiResponse = {
        success: true,
        message: 'success',
        estimated_data: {
          class: 3,
          confidence: 0.8683,
        },
      };
      (mockAdapter.analyze as any).mockResolvedValue(mockApiResponse);
      (mockRepository.save as any).mockResolvedValue(1);

      // Act
      const result = await service.analyze('/image/test/sample.jpg');

      // Assert
      expect(result.success).toBe(true);
      expect(result.id).toBe(1);
      expect(result.message).toBe('success');
      expect(result.estimated_data.class).toBe(3);
      expect(result.estimated_data.confidence).toBe(0.8683);
      expect(result.requestTimestamp).toBeDefined();
      expect(result.responseTimestamp).toBeDefined();

      expect(mockAdapter.analyze).toHaveBeenCalledWith('/image/test/sample.jpg');
      expect(mockRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          imagePath: '/image/test/sample.jpg',
          success: true,
          message: 'success',
          class: 3,
          confidence: 0.8683,
        })
      );
    });
  });

  describe('analyze - 失敗ケース', () => {
    it('API失敗時、失敗結果をDBに保存して返す', async () => {
      // Arrange
      const mockApiResponse: AiApiResponse = {
        success: false,
        message: 'Error:E50012',
        estimated_data: {},
      };
      (mockAdapter.analyze as any).mockResolvedValue(mockApiResponse);
      (mockRepository.save as any).mockResolvedValue(2);

      // Act
      const result = await service.analyze('/image/test/sample.jpg');

      // Assert
      expect(result.success).toBe(false);
      expect(result.id).toBe(2);
      expect(result.message).toBe('Error:E50012');
      expect(mockRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          imagePath: '/image/test/sample.jpg',
          success: false,
          message: 'Error:E50012',
          class: null,
          confidence: null,
        })
      );
    });
  });

  describe('analyze - バリデーション', () => {
    it('空の画像パスでエラーを投げる（DBに保存しない）', async () => {
      await expect(service.analyze('')).rejects.toThrow('Image path is required');
      await expect(service.analyze('   ')).rejects.toThrow('Image path is required');
      expect(mockRepository.save).not.toHaveBeenCalled();
    });

    it('不正な画像パス（/image/で始まらない）でエラーを投げる（DBに保存しない）', async () => {
      await expect(service.analyze('/photos/test.jpg')).rejects.toThrow(
        'Image path must start with /image/'
      );
      expect(mockRepository.save).not.toHaveBeenCalled();
    });

    it('不正な拡張子でエラーを投げる（DBに保存しない）', async () => {
      await expect(service.analyze('/image/test/sample.txt')).rejects.toThrow(
        'Image path must end with .jpg, .jpeg, .png, or .gif'
      );
      await expect(service.analyze('/image/test/sample.pdf')).rejects.toThrow(
        'Image path must end with .jpg, .jpeg, .png, or .gif'
      );
      expect(mockRepository.save).not.toHaveBeenCalled();
    });

    it('画像パスが255文字を超える場合エラーを投げる（DBに保存しない）', async () => {
      const longPath = '/image/' + 'a'.repeat(260) + '.jpg';
      await expect(service.analyze(longPath)).rejects.toThrow(
        'Image path is too long (max 255 characters)'
      );
      expect(mockRepository.save).not.toHaveBeenCalled();
    });

    it('有効な拡張子（.jpg, .jpeg, .png, .gif）を許可', async () => {
      const mockApiResponse: AiApiResponse = {
        success: true,
        message: 'success',
        estimated_data: { class: 1, confidence: 0.9 },
      };
      (mockAdapter.analyze as any).mockResolvedValue(mockApiResponse);
      (mockRepository.save as any).mockResolvedValue(1);

      await expect(service.analyze('/image/test/sample.jpg')).resolves.toBeDefined();
      await expect(service.analyze('/image/test/sample.jpeg')).resolves.toBeDefined();
      await expect(service.analyze('/image/test/sample.png')).resolves.toBeDefined();
      await expect(service.analyze('/image/test/sample.gif')).resolves.toBeDefined();
      await expect(service.analyze('/image/test/sample.JPG')).resolves.toBeDefined(); // 大文字も許可
    });
  });

  describe('analyze - タイムスタンプ', () => {
    it('requestTimestampとresponseTimestampを記録する', async () => {
      // Arrange
      const mockApiResponse: AiApiResponse = {
        success: true,
        message: 'success',
        estimated_data: { class: 5, confidence: 0.95 },
      };
      (mockAdapter.analyze as any).mockResolvedValue(mockApiResponse);
      (mockRepository.save as any).mockResolvedValue(1);

      const beforeRequest = new Date();

      // Act
      const result = await service.analyze('/image/test/sample.jpg');

      const afterResponse = new Date();

      // Assert
      const requestTime = new Date(result.requestTimestamp);
      const responseTime = new Date(result.responseTimestamp);

      expect(requestTime.getTime()).toBeGreaterThanOrEqual(beforeRequest.getTime());
      expect(responseTime.getTime()).toBeGreaterThanOrEqual(requestTime.getTime());
      expect(responseTime.getTime()).toBeLessThanOrEqual(afterResponse.getTime());
    });
  });
});

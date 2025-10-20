-- AI分析ログテーブル
CREATE TABLE IF NOT EXISTS `ai_analysis_log` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `image_path` varchar(255) DEFAULT NULL,
  `success` tinyint(1) NOT NULL,
  `message` varchar(255) DEFAULT NULL,
  `class` int(11) DEFAULT NULL,
  `confidence` decimal(5,4) DEFAULT NULL,
  `request_timestamp` datetime(6) DEFAULT NULL,
  `response_timestamp` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- インデックス追加（パフォーマンス最適化）
CREATE INDEX idx_success ON ai_analysis_log(success);
CREATE INDEX idx_request_timestamp ON ai_analysis_log(request_timestamp);

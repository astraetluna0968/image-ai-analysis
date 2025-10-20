import { createApp } from './app';
import { config } from './config';
import { logger } from './logger';

/**
 * サーバー起動
 */
const app = createApp();

app.listen(config.port, () => {
  logger.info('Server started', {
    port: config.port,
    environment: config.nodeEnv,
  });
  console.log(`Server is running on http://localhost:${config.port}`);
});

// グレースフルシャットダウン
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT signal received: closing HTTP server');
  process.exit(0);
});

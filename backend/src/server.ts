import app from './app.js';
import { loadConfig } from './config/index.js';
import { connectMongo } from './db/mongodb.js';
import { logger } from './utils/logger.js';

const config = loadConfig();

async function bootstrap(): Promise<void> {
  await connectMongo(config.MONGODB_URI);

  const server = app.listen(config.PORT, () => {
    logger.info({ port: config.PORT, env: config.NODE_ENV }, 'Server started');
  });

  const shutdown = async (signal: string): Promise<void> => {
    logger.info({ signal }, 'Received shutdown signal');
    server.close(() => {
      logger.info('HTTP server closed');
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

bootstrap().catch((err) => {
  logger.fatal({ err }, 'Failed to start server');
  process.exit(1);
});

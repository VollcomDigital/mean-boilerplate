import type { Server } from 'node:http';
import http from 'node:http';
import { app } from './app';
import { connectToDatabase, disconnectDatabase } from './config/db';
import { env } from './config/env';
import { logger } from './config/logger';

let server: Server;

const shutdown = async (signal: NodeJS.Signals): Promise<void> => {
  logger.warn({ signal }, 'Shutdown signal received');

  if (server) {
    await new Promise<void>((resolve, reject) => {
      server.close((error) => {
        if (error) {
          reject(error);
          return;
        }
        resolve();
      });
    });
  }

  await disconnectDatabase();
  logger.info('Application shutdown completed');
  process.exit(0);
};

const startServer = async (): Promise<void> => {
  await connectToDatabase();

  server = http.createServer(app);
  server.listen(env.PORT, () => {
    logger.info(
      {
        port: env.PORT,
        environment: env.NODE_ENV,
        apiPrefix: env.API_PREFIX,
      },
      'Backend server started',
    );
  });
};

process.on('SIGINT', () => {
  void shutdown('SIGINT');
});

process.on('SIGTERM', () => {
  void shutdown('SIGTERM');
});

process.on('unhandledRejection', (reason) => {
  logger.fatal({ err: reason }, 'Unhandled promise rejection');
});

process.on('uncaughtException', (error) => {
  logger.fatal({ err: error }, 'Uncaught exception');
  process.exit(1);
});

void startServer().catch((error: unknown) => {
  logger.fatal({ err: error }, 'Failed to start backend server');
  process.exit(1);
});

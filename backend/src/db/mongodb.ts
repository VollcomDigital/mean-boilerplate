import mongoose from 'mongoose';
import { logger } from '../utils/logger.js';

/**
 * Connects to MongoDB using Mongoose.
 * Implements retry logic for cloud environments.
 *
 * @param uri - MongoDB connection URI
 */
export async function connectMongo(uri: string): Promise<void> {
  const maxRetries = 5;
  const retryDelayMs = 2000;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await mongoose.connect(uri);
      logger.info('MongoDB connected successfully');

      mongoose.connection.on('error', (err) => {
        logger.error({ err }, 'MongoDB connection error');
      });

      mongoose.connection.on('disconnected', () => {
        logger.warn('MongoDB disconnected');
      });

      return;
    } catch (err) {
      logger.warn({ attempt, maxRetries, err }, 'MongoDB connection failed, retrying...');
      if (attempt === maxRetries) {
        throw err;
      }
      await new Promise((resolve) => setTimeout(resolve, retryDelayMs));
    }
  }
}

/**
 * Gracefully disconnects from MongoDB.
 */
export async function disconnectMongo(): Promise<void> {
  await mongoose.disconnect();
  logger.info('MongoDB disconnected');
}

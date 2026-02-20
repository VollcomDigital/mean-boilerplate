import mongoose from 'mongoose';
import { env } from './env';
import { logger } from './logger';

mongoose.set('strictQuery', true);

export const connectToDatabase = async (): Promise<void> => {
  await mongoose.connect(env.MONGODB_URI);
  logger.info({ uri: env.MONGODB_URI }, 'MongoDB connection established');
};

export const disconnectDatabase = async (): Promise<void> => {
  await mongoose.disconnect();
  logger.info('MongoDB connection closed');
};

export const isDatabaseReady = (): boolean => mongoose.connection.readyState === 1;

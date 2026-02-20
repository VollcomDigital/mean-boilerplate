import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import pinoHttp from 'pino-http';
import { loadConfig } from './config/index.js';
import { apiRateLimiter, errorHandler } from './middleware/index.js';
import { healthRoutes } from './modules/health/index.js';
import { userRoutes } from './modules/users/index.js';
import { authRoutes } from './modules/auth/index.js';
import { logger } from './utils/logger.js';

const config = loadConfig();

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: config.CORS_ORIGIN.split(',').map((o) => o.trim()),
    credentials: true,
  })
);
app.use(express.json());
app.use(pinoHttp({ logger }));

app.use(apiRateLimiter);

app.use('/health', healthRoutes);
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);

app.get('/', (_req, res) => {
  res.json({
    success: true,
    data: {
      message: 'MEAN Stack API',
      version: '1.0.0',
      docs: '/api',
    },
  });
});

app.use(errorHandler);

export default app;

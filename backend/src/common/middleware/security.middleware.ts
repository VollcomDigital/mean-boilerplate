import type { Express } from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { env } from '../../config/env';

const allowedOrigins = env.CORS_ORIGIN.split(',').map((origin) => origin.trim());

const apiRateLimit = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
});

export const applySecurityMiddleware = (app: Express): void => {
  app.use(helmet());
  app.use(
    cors({
      origin: allowedOrigins,
      credentials: true,
    }),
  );
  app.use(apiRateLimit);
};

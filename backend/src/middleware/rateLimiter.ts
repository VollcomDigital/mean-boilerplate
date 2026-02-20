import rateLimit from 'express-rate-limit';
import { loadConfig } from '../config/env.js';

const config = loadConfig();

/**
 * Rate limiter middleware for API protection.
 * Uses configurable window and max requests from env.
 */
export const apiRateLimiter = rateLimit({
  windowMs: config.RATE_LIMIT_WINDOW_MS,
  max: config.RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      message: 'Too many requests, please try again later',
      code: 'RATE_LIMIT_EXCEEDED',
    },
  },
});

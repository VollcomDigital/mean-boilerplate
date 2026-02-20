import pinoHttp from 'pino-http';
import { logger } from '../../config/logger';

export const requestLogger = pinoHttp({
  logger,
  customLogLevel: (req, res, error) => {
    if (error || res.statusCode >= 500) {
      return 'error';
    }
    if (res.statusCode >= 400) {
      return 'warn';
    }
    if (req.url.includes('/health')) {
      return 'debug';
    }
    return 'info';
  },
});

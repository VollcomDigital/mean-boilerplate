import pinoHttp from 'pino-http';
import { logger } from '../../config/logger';

export const requestLogger = pinoHttp({
  logger,
  customLogLevel: (req, res, error) => {
    const requestUrl = req.url ?? '';

    if (error || res.statusCode >= 500) {
      return 'error';
    }
    if (res.statusCode >= 400) {
      return 'warn';
    }
    if (requestUrl.includes('/health')) {
      return 'debug';
    }
    return 'info';
  },
});

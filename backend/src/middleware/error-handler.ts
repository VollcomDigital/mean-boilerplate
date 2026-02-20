import type { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/app-error.js';
import { sendError } from '../utils/response.js';
import { logger } from '../utils/logger.js';

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction): void {
  if (err instanceof AppError) {
    logger.warn({ err, statusCode: err.statusCode }, err.message);
    sendError(res, err.message, err.statusCode);
    return;
  }

  logger.error({ err }, 'Unhandled error');
  sendError(
    res,
    process.env['NODE_ENV'] === 'production' ? 'Internal server error' : err.message,
    500,
  );
}

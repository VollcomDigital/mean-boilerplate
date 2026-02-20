import type { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import { ZodError } from 'zod';
import { AppError } from '../errors/app-error';
import type { ApiErrorResponse } from '../types/api-response';
import { logger } from '../../config/logger';

const mapError = (error: unknown): AppError => {
  if (error instanceof AppError) {
    return error;
  }

  if (error instanceof ZodError) {
    return new AppError('Validation failed', 400, 'VALIDATION_ERROR', error.issues);
  }

  if (error instanceof mongoose.Error.ValidationError) {
    return new AppError(
      'Database validation failed',
      400,
      'DATABASE_VALIDATION_ERROR',
      error.errors,
    );
  }

  if (error instanceof mongoose.Error.CastError) {
    return new AppError('Invalid identifier format', 400, 'INVALID_IDENTIFIER', {
      path: error.path,
      value: error.value,
    });
  }

  if (
    error instanceof Error &&
    error.name === 'MongoServerError' &&
    (error as { code?: number }).code === 11000
  ) {
    const keyPattern = (error as { keyPattern?: Record<string, unknown> }).keyPattern;
    const fields = keyPattern ? Object.keys(keyPattern) : [];
    return new AppError(
      `Duplicate value for unique field(s): ${fields.join(', ')}`,
      409,
      'DUPLICATE_RESOURCE',
      { fields },
    );
  }

  if (error instanceof Error) {
    return new AppError(error.message, 500, 'INTERNAL_SERVER_ERROR');
  }

  return new AppError('Unexpected error', 500, 'INTERNAL_SERVER_ERROR');
};

export const errorHandlerMiddleware = (
  error: unknown,
  req: Request,
  res: Response<ApiErrorResponse>,
  next: NextFunction,
): void => {
  void next;
  const mappedError = mapError(error);
  const requestLogger = req.log ?? logger;

  requestLogger.error(
    {
      err: error,
      statusCode: mappedError.statusCode,
      code: mappedError.code,
      path: req.path,
      method: req.method,
    },
    mappedError.message,
  );

  res.status(mappedError.statusCode).json({
    success: false,
    error: {
      code: mappedError.code,
      message: mappedError.message,
      details: mappedError.details,
    },
  });
};

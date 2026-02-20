/**
 * Custom application error for centralized error handling.
 * Extends Error with HTTP status code and optional error code.
 */
export class AppError extends Error {
  public readonly statusCode: number;

  public readonly code?: string;

  public readonly isOperational: boolean;

  constructor(message: string, statusCode = 500, code?: string, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = isOperational;

    Object.setPrototypeOf(this, AppError.prototype);
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message: string, code?: string): AppError {
    return new AppError(message, 400, code ?? 'BAD_REQUEST');
  }

  static unauthorized(message = 'Unauthorized', code?: string): AppError {
    return new AppError(message, 401, code ?? 'UNAUTHORIZED');
  }

  static forbidden(message = 'Forbidden', code?: string): AppError {
    return new AppError(message, 403, code ?? 'FORBIDDEN');
  }

  static notFound(message = 'Resource not found', code?: string): AppError {
    return new AppError(message, 404, code ?? 'NOT_FOUND');
  }

  static conflict(message: string, code?: string): AppError {
    return new AppError(message, 409, code ?? 'CONFLICT');
  }

  static internal(message = 'Internal server error', code?: string): AppError {
    return new AppError(message, 500, code ?? 'INTERNAL_ERROR', false);
  }
}

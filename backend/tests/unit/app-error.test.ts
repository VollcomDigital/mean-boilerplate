import {
  AppError,
  NotFoundError,
  UnauthorizedError,
  ForbiddenError,
  ValidationError,
  ConflictError,
} from '../../src/utils/app-error';

describe('AppError', () => {
  it('should create an AppError with correct properties', () => {
    const error = new AppError('Test error', 400);

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(AppError);
    expect(error.message).toBe('Test error');
    expect(error.statusCode).toBe(400);
    expect(error.isOperational).toBe(true);
    expect(error.name).toBe('AppError');
    expect(error.stack).toBeDefined();
  });

  it('should allow non-operational errors', () => {
    const error = new AppError('Critical', 500, false);
    expect(error.isOperational).toBe(false);
  });
});

describe('NotFoundError', () => {
  it('should default to "Resource not found"', () => {
    const error = new NotFoundError();
    expect(error.message).toBe('Resource not found');
    expect(error.statusCode).toBe(404);
  });

  it('should accept a custom resource name', () => {
    const error = new NotFoundError('User');
    expect(error.message).toBe('User not found');
  });
});

describe('UnauthorizedError', () => {
  it('should have a 401 status code', () => {
    const error = new UnauthorizedError();
    expect(error.statusCode).toBe(401);
    expect(error.message).toBe('Unauthorized');
  });
});

describe('ForbiddenError', () => {
  it('should have a 403 status code', () => {
    const error = new ForbiddenError();
    expect(error.statusCode).toBe(403);
  });
});

describe('ValidationError', () => {
  it('should have a 422 status code', () => {
    const error = new ValidationError();
    expect(error.statusCode).toBe(422);
    expect(error.message).toBe('Validation failed');
  });
});

describe('ConflictError', () => {
  it('should have a 409 status code', () => {
    const error = new ConflictError();
    expect(error.statusCode).toBe(409);
  });
});

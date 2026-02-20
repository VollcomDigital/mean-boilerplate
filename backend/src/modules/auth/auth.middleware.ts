import type { Request, Response, NextFunction } from 'express';
import { verifyToken } from './auth.service.js';
import { UnauthorizedError } from '../../utils/app-error.js';

export function authenticate(req: Request, _res: Response, next: NextFunction): void {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      throw new UnauthorizedError('Missing or malformed authorization header');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new UnauthorizedError('Token not provided');
    }

    const payload = verifyToken(token);
    (req as Request & { userId: string }).userId = payload.userId;
    next();
  } catch (error) {
    next(error);
  }
}

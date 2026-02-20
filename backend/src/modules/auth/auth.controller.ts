import type { Request, Response } from 'express';
import { AppError } from '../../utils/AppError.js';

/**
 * POST /api/auth/login - Placeholder for auth logic.
 * In production, implement JWT issuance here.
 */
export async function login(_req: Request, res: Response): Promise<void> {
  // Placeholder - implement with JWT/passport in production
  res.status(200).json({
    success: true,
    data: {
      message: 'Auth module - implement JWT/passport for production',
      token: null,
    },
  });
}

/**
 * GET /api/auth/me - Placeholder for current user.
 */
export async function me(req: Request, res: Response): Promise<void> {
  // Placeholder - would decode JWT and return user
  if (!req.headers.authorization) {
    throw AppError.unauthorized('No token provided');
  }
  res.status(200).json({
    success: true,
    data: {
      message: 'Auth me - implement JWT decode for production',
    },
  });
}

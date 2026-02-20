import type { Request, Response } from 'express';
import { User } from './user.model.js';
import { AppError } from '../../utils/AppError.js';

/**
 * GET /api/users - List all users (paginated sample).
 */
export async function listUsers(req: Request, res: Response): Promise<void> {
  const limit = Math.min(parseInt(req.query.limit as string, 10) || 20, 100);
  const skip = parseInt(req.query.skip as string, 10) || 0;

  const [users, total] = await Promise.all([
    User.find().skip(skip).limit(limit).lean().exec(),
    User.countDocuments().exec(),
  ]);

  res.status(200).json({
    success: true,
    data: {
      users,
      pagination: {
        total,
        limit,
        skip,
      },
    },
  });
}

/**
 * GET /api/users/:id - Get user by ID.
 */
export async function getUserById(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const user = await User.findById(id).lean().exec();

  if (!user) {
    throw AppError.notFound('User not found');
  }

  res.status(200).json({
    success: true,
    data: user,
  });
}

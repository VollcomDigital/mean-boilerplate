import type { Request, Response, NextFunction } from 'express';
import { registerUser, loginUser } from './auth.service.js';
import { sendSuccess } from '../../utils/response.js';
import { User } from '../users/user.model.js';
import { NotFoundError } from '../../utils/app-error.js';

export async function register(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await registerUser(req.body);
    sendSuccess(res, result, 201);
  } catch (error) {
    next(error);
  }
}

export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await loginUser(req.body);
    sendSuccess(res, result);
  } catch (error) {
    next(error);
  }
}

export async function getProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = (req as Request & { userId: string }).userId;
    const user = await User.findById(userId);
    if (!user) {
      throw new NotFoundError('User');
    }
    sendSuccess(res, {
      id: user._id.toString(),
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    });
  } catch (error) {
    next(error);
  }
}

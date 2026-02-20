import type { Request, Response, NextFunction } from 'express';
import { findAllUsers, findUserById, updateUserById, deleteUserById } from './users.service.js';
import { sendSuccess } from '../../utils/response.js';

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

export async function getUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const page = Math.max(Number(req.query['page']) || DEFAULT_PAGE, 1);
    const limit = Math.min(Math.max(Number(req.query['limit']) || DEFAULT_LIMIT, 1), MAX_LIMIT);

    const result = await findAllUsers({ page, limit });
    sendSuccess(res, result.items, 200, result.meta);
  } catch (error) {
    next(error);
  }
}

export async function getUserById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = req.params['id'] as string;
    const user = await findUserById(id);
    sendSuccess(res, user);
  } catch (error) {
    next(error);
  }
}

export async function updateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = req.params['id'] as string;
    const user = await updateUserById(id, req.body);
    sendSuccess(res, user);
  } catch (error) {
    next(error);
  }
}

export async function deleteUser(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = req.params['id'] as string;
    await deleteUserById(id);
    sendSuccess(res, null, 204);
  } catch (error) {
    next(error);
  }
}

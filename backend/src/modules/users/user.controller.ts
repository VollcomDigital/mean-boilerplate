import type { Request, Response } from 'express';
import type { ApiSuccessResponse } from '../../common/types/api-response';
import type { CreateUserInput } from './user.validation';
import { createUser, listUsers, type UserPublicProfile } from './user.service';

export const createUserHandler = async (
  req: Request<unknown, unknown, CreateUserInput>,
  res: Response<ApiSuccessResponse<UserPublicProfile>>,
): Promise<void> => {
  const user = await createUser(req.body);

  res.status(201).json({
    success: true,
    data: user,
  });
};

export const listUsersHandler = async (
  _req: Request,
  res: Response<ApiSuccessResponse<UserPublicProfile[]>>,
): Promise<void> => {
  const users = await listUsers();

  res.status(200).json({
    success: true,
    data: users,
  });
};

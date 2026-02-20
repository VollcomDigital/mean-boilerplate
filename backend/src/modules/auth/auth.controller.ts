import type { Request, Response } from 'express';
import type { ApiSuccessResponse } from '../../common/types/api-response';
import { login, type LoginResult } from './auth.service';
import type { LoginInput } from './auth.validation';

export const loginHandler = async (
  req: Request<unknown, unknown, LoginInput>,
  res: Response<ApiSuccessResponse<LoginResult>>,
): Promise<void> => {
  const result = await login(req.body);

  res.status(200).json({
    success: true,
    data: result,
  });
};

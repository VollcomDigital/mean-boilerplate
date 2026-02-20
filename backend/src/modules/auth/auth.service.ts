import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AppError } from '../../common/errors/app-error';
import { env } from '../../config/env';
import { UserModel } from '../users/user.model';
import type { LoginInput } from './auth.validation';

const ACCESS_TOKEN_EXPIRATION = '1h';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
}

export interface LoginResult {
  token: string;
  user: AuthUser;
}

export const login = async (payload: LoginInput): Promise<LoginResult> => {
  const user = await UserModel.findOne({ email: payload.email.toLowerCase() })
    .select('+passwordHash')
    .exec();

  if (!user) {
    throw new AppError('Invalid credentials', 401, 'INVALID_CREDENTIALS');
  }

  const isPasswordValid = await bcrypt.compare(payload.password, user.passwordHash);

  if (!isPasswordValid) {
    throw new AppError('Invalid credentials', 401, 'INVALID_CREDENTIALS');
  }

  const token = jwt.sign({ sub: user.id, email: user.email }, env.JWT_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRATION,
  });

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
    },
  };
};

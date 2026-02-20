import bcrypt from 'bcryptjs';
import { AppError } from '../../common/errors/app-error';
import { UserModel } from './user.model';
import type { CreateUserInput } from './user.validation';

const PASSWORD_SALT_ROUNDS = 12;

export interface UserPublicProfile {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

const toPublicProfile = (user: {
  _id: { toString: () => string };
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}): UserPublicProfile => ({
  id: user._id.toString(),
  email: user.email,
  name: user.name,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

export const createUser = async (payload: CreateUserInput): Promise<UserPublicProfile> => {
  const existingUser = await UserModel.findOne({ email: payload.email.toLowerCase() })
    .lean()
    .exec();

  if (existingUser) {
    throw new AppError('User already exists', 409, 'USER_ALREADY_EXISTS');
  }

  const passwordHash = await bcrypt.hash(payload.password, PASSWORD_SALT_ROUNDS);

  const user = await UserModel.create({
    email: payload.email.toLowerCase(),
    name: payload.name,
    passwordHash,
  });

  return toPublicProfile(user);
};

export const listUsers = async (): Promise<UserPublicProfile[]> => {
  const users = await UserModel.find({}, { email: 1, name: 1, createdAt: 1, updatedAt: 1 })
    .sort({ createdAt: -1 })
    .lean()
    .exec();

  return users.map((user) => toPublicProfile(user));
};

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, type IUser } from '../users/user.model.js';
import { env } from '../../config/env.config.js';
import { ConflictError, UnauthorizedError } from '../../utils/app-error.js';
import type { RegisterDto, LoginDto } from './auth.validation.js';

const SALT_ROUNDS = 12;

export interface TokenPayload {
  userId: string;
  email: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
  token: string;
}

function generateToken(payload: TokenPayload): string {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRATION as string,
  } as jwt.SignOptions);
}

function sanitizeUser(user: IUser): AuthResponse['user'] {
  return {
    id: user._id.toString(),
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
  };
}

/**
 * Register a new user with hashed password.
 *
 * Args:
 *   dto: Registration data (email, password, firstName, lastName).
 *
 * Returns:
 *   AuthResponse with user info and JWT token.
 *
 * Raises:
 *   ConflictError: If email is already registered.
 */
export async function registerUser(dto: RegisterDto): Promise<AuthResponse> {
  const existingUser = await User.findOne({ email: dto.email });
  if (existingUser) {
    throw new ConflictError('Email already registered');
  }

  const hashedPassword = await bcrypt.hash(dto.password, SALT_ROUNDS);
  const user = await User.create({
    ...dto,
    password: hashedPassword,
  });

  const token = generateToken({ userId: user._id.toString(), email: user.email });

  return { user: sanitizeUser(user), token };
}

/**
 * Authenticate user with email and password.
 *
 * Args:
 *   dto: Login credentials.
 *
 * Returns:
 *   AuthResponse with user info and JWT token.
 *
 * Raises:
 *   UnauthorizedError: If credentials are invalid.
 */
export async function loginUser(dto: LoginDto): Promise<AuthResponse> {
  const user = await User.findOne({ email: dto.email }).select('+password');
  if (!user) {
    throw new UnauthorizedError('Invalid email or password');
  }

  const isMatch = await bcrypt.compare(dto.password, user.password);
  if (!isMatch) {
    throw new UnauthorizedError('Invalid email or password');
  }

  const token = generateToken({ userId: user._id.toString(), email: user.email });

  return { user: sanitizeUser(user), token };
}

/**
 * Verify and decode a JWT token.
 *
 * Args:
 *   token: JWT string.
 *
 * Returns:
 *   Decoded token payload.
 *
 * Raises:
 *   UnauthorizedError: If token is invalid or expired.
 */
export function verifyToken(token: string): TokenPayload {
  try {
    return jwt.verify(token, env.JWT_SECRET) as TokenPayload;
  } catch {
    throw new UnauthorizedError('Invalid or expired token');
  }
}

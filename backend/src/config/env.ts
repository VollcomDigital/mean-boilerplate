import dotenv from 'dotenv';
import type { SignOptions } from 'jsonwebtoken';
import { z } from 'zod';

dotenv.config({ quiet: true });

const DEFAULT_DEV_JWT_SECRET = 'dev-only-super-secret-key-with-32-characters';
const DEFAULT_JWT_EXPIRATION = '1h';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().min(1).max(65535).default(3000),
  API_PREFIX: z.string().default('/api/v1'),
  MONGODB_URI: z
    .string()
    .regex(/^mongodb(\+srv)?:\/\/.+/, {
      message: 'MONGODB_URI must be a valid mongodb connection string',
    })
    .default('mongodb://localhost:27017/mean_app'),
  CORS_ORIGIN: z.string().min(1).default('http://localhost:4200'),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().int().min(1).default(900000),
  RATE_LIMIT_MAX: z.coerce.number().int().min(1).default(100),
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']).default('info'),
  JWT_SECRET: z.string().min(32).default(DEFAULT_DEV_JWT_SECRET),
  JWT_EXPIRATION: z
    .custom<SignOptions['expiresIn']>(
      (value) =>
        (typeof value === 'string' && value.trim().length > 0) ||
        (typeof value === 'number' && Number.isFinite(value) && value > 0),
      {
        message: 'JWT_EXPIRATION must be a non-empty string or a positive number',
      },
    )
    .default(DEFAULT_JWT_EXPIRATION),
});

export type Env = z.infer<typeof envSchema>;

export const buildEnv = (rawEnv: NodeJS.ProcessEnv): Env => {
  const parsedEnv = envSchema.safeParse(rawEnv);

  if (!parsedEnv.success) {
    const details = parsedEnv.error.issues
      .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
      .join('; ');
    throw new Error(`Invalid environment configuration. ${details}`);
  }

  const validatedEnv = parsedEnv.data;
  const isProduction = validatedEnv.NODE_ENV === 'production';
  const usesDefaultSecret = validatedEnv.JWT_SECRET === DEFAULT_DEV_JWT_SECRET;

  if (isProduction && usesDefaultSecret) {
    throw new Error(
      'Invalid environment configuration. JWT_SECRET must be explicitly set in production.',
    );
  }

  return validatedEnv;
};

export const env = buildEnv(process.env);

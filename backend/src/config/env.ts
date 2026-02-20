import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config({ quiet: true });

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
  JWT_SECRET: z.string().min(32).default('dev-only-super-secret-key-with-32-characters'),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  const details = parsedEnv.error.issues
    .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
    .join('; ');
  throw new Error(`Invalid environment configuration. ${details}`);
}

export const env = parsedEnv.data;

import { z } from 'zod';
import { logger } from '../utils/logger.js';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().min(1).max(65535).default(3000),
  MONGODB_URI: z.string().url().or(z.string().startsWith('mongodb://')),
  CORS_ORIGIN: z.string().default('http://localhost:4200'),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().positive().default(900000),
  RATE_LIMIT_MAX: z.coerce.number().positive().default(100),
  JWT_SECRET: z.string().optional(),
  JWT_EXPIRES_IN: z.string().default('7d'),
});

export type Env = z.infer<typeof envSchema>;

/**
 * Validates and loads environment variables at startup.
 * Fails fast if required config is missing or invalid.
 *
 * @returns Validated environment configuration
 * @throws ZodError if validation fails
 */
export function loadConfig(): Env {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    logger.error({ errors: result.error.flatten() }, 'Environment validation failed');
    throw result.error;
  }

  logger.info(
    { env: result.data.NODE_ENV, port: result.data.PORT },
    'Configuration loaded successfully'
  );

  return result.data;
}

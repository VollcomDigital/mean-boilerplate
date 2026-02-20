import pino from 'pino';

const NODE_ENV = process.env.NODE_ENV ?? 'development';

/**
 * Structured JSON logger using Pino.
 * No console.log - all logging goes through this instance.
 *
 * @see https://getpino.io/
 */
export const logger = pino({
  level: NODE_ENV === 'production' ? 'info' : 'debug',
  transport:
    NODE_ENV !== 'production'
      ? {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'SYS:standard',
          },
        }
      : undefined,
  base: {
    service: 'mean-backend',
    env: NODE_ENV,
  },
});

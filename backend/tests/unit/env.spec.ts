import { buildEnv } from '../../src/config/env';

describe('Environment configuration', () => {
  it('uses defaults for development', () => {
    const env = buildEnv({});

    expect(env.NODE_ENV).toBe('development');
    expect(env.JWT_EXPIRATION).toBe('1h');
  });

  it('fails in production when JWT_SECRET is not explicitly provided', () => {
    expect(() => buildEnv({ NODE_ENV: 'production' })).toThrow(
      'JWT_SECRET must be explicitly set in production',
    );
  });

  it('accepts an explicit production JWT secret', () => {
    const env = buildEnv({
      NODE_ENV: 'production',
      JWT_SECRET: 'production-secret-value-at-least-thirty-two-characters',
      JWT_EXPIRATION: '15m',
    });

    expect(env.NODE_ENV).toBe('production');
    expect(env.JWT_EXPIRATION).toBe('15m');
  });
});

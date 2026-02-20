import { getLiveness, getReadiness } from '../../src/modules/health/health.service';

describe('HealthService', () => {
  it('returns liveness payload', () => {
    const payload = getLiveness();

    expect(payload.status).toBe('ok');
    expect(payload.uptimeSeconds).toBeGreaterThanOrEqual(0);
    expect(payload.timestamp).toEqual(expect.any(String));
  });

  it('returns readiness payload with database check', () => {
    const payload = getReadiness();

    expect(payload.checks.database).toBeDefined();
    expect(typeof payload.checks.database.ready).toBe('boolean');
    expect(typeof payload.checks.database.state).toBe('string');
  });
});

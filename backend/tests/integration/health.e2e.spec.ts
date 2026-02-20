import request from 'supertest';
import { app } from '../../src/app';

describe('Health endpoints', () => {
  it('GET /health/liveness returns 200', async () => {
    const response = await request(app).get('/health/liveness');

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      success: true,
    });
  });

  it('GET /health/readiness returns readiness payload', async () => {
    const response = await request(app).get('/health/readiness');

    expect([200, 503]).toContain(response.status);
    expect(response.body).toMatchObject({
      success: true,
      data: {
        checks: {
          database: {
            ready: expect.any(Boolean),
          },
        },
      },
    });
  });
});

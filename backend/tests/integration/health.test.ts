import request from 'supertest';
import express from 'express';
import { healthRouter } from '../../src/modules/health/health.routes';

function createTestApp(): express.Application {
  const app = express();
  app.use('/health', healthRouter);
  return app;
}

describe('Health Endpoints', () => {
  const app = createTestApp();

  describe('GET /health/liveness', () => {
    it('should return 200 with alive status', async () => {
      const response = await request(app).get('/health/liveness');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.status).toBe('alive');
      expect(response.body.data.timestamp).toBeDefined();
      expect(response.body.data.uptime).toBeGreaterThanOrEqual(0);
    });
  });

  describe('GET /health/readiness', () => {
    it('should return 503 when MongoDB is not connected', async () => {
      const response = await request(app).get('/health/readiness');

      expect(response.status).toBe(503);
      expect(response.body.success).toBe(false);
    });
  });
});

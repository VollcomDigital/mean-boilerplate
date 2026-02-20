import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import express from 'express';
import { healthRoutes } from '../src/modules/health/index';

const app = express();
app.use('/health', healthRoutes);

describe('Health endpoints', () => {
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
  }, 30000);

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  describe('GET /health/liveness', () => {
    it('returns 200 with status alive', async () => {
      const res = await request(app).get('/health/liveness');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('alive');
    });
  });

  describe('GET /health/readiness', () => {
    it('returns 200 when MongoDB is connected', async () => {
      const res = await request(app).get('/health/readiness');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('ready');
      expect(res.body.data.mongodb).toBe('connected');
    });
  });
});

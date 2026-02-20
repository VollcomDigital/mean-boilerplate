import { Router } from 'express';
import { livenessCheck, readinessCheck } from './health.controller.js';

export const healthRouter = Router();

healthRouter.get('/liveness', livenessCheck);
healthRouter.get('/readiness', readinessCheck);

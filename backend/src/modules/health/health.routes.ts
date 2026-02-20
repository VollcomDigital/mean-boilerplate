import { Router } from 'express';
import { getLivenessHandler, getReadinessHandler } from './health.controller';

const healthRouter = Router();

healthRouter.get('/liveness', getLivenessHandler);
healthRouter.get('/readiness', getReadinessHandler);

export { healthRouter };

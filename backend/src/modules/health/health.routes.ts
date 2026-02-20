import { Router } from 'express';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { liveness, readiness } from './health.controller.js';

const router = Router();

router.get('/liveness', liveness);
router.get('/readiness', asyncHandler(readiness));

export default router;

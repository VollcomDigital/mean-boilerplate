import { Router } from 'express';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { login, me } from './auth.controller.js';

const router = Router();

router.post('/login', asyncHandler(login));
router.get('/me', asyncHandler(me));

export default router;

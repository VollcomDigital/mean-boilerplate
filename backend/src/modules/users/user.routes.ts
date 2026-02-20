import { Router } from 'express';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { listUsers, getUserById } from './user.controller.js';

const router = Router();

router.get('/', asyncHandler(listUsers));
router.get('/:id', asyncHandler(getUserById));

export default router;

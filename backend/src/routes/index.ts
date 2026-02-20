import { Router } from 'express';
import { authRouter } from '../modules/auth/auth.routes';
import { healthRouter } from '../modules/health/health.routes';
import { userRouter } from '../modules/users/user.routes';

export const publicRouter = Router();
export const apiRouter = Router();

publicRouter.use('/health', healthRouter);
apiRouter.use('/auth', authRouter);
apiRouter.use('/users', userRouter);

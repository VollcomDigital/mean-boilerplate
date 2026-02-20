import { Router } from 'express';
import { asyncHandler } from '../../common/utils/async-handler';
import { validateRequest } from '../../common/middleware/validate-request.middleware';
import { loginHandler } from './auth.controller';
import { loginSchema } from './auth.validation';

const authRouter = Router();

authRouter.post('/login', validateRequest(loginSchema), asyncHandler(loginHandler));

export { authRouter };

import { Router } from 'express';
import { asyncHandler } from '../../common/utils/async-handler';
import { validateRequest } from '../../common/middleware/validate-request.middleware';
import { createUserHandler, listUsersHandler } from './user.controller';
import { createUserSchema } from './user.validation';

const userRouter = Router();

userRouter.get('/', asyncHandler(listUsersHandler));
userRouter.post('/', validateRequest(createUserSchema), asyncHandler(createUserHandler));

export { userRouter };

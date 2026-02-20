import { Router } from 'express';
import { getUsers, getUserById, updateUser, deleteUser } from './users.controller.js';
import { authenticate } from '../auth/auth.middleware.js';
import { validate } from '../../middleware/validate.js';
import { updateUserSchema, userIdParamSchema } from './users.validation.js';

export const usersRouter = Router();

usersRouter.use(authenticate);

usersRouter.get('/', getUsers);
usersRouter.get('/:id', validate({ params: userIdParamSchema }), getUserById);
usersRouter.patch(
  '/:id',
  validate({ params: userIdParamSchema, body: updateUserSchema }),
  updateUser,
);
usersRouter.delete('/:id', validate({ params: userIdParamSchema }), deleteUser);

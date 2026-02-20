import { z } from 'zod';

export const createUserSchema = z.object({
  body: z.object({
    email: z.email(),
    name: z.string().min(2).max(100),
    password: z.string().min(8).max(128),
  }),
});

export const userIdSchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
});

export type CreateUserInput = z.infer<typeof createUserSchema>['body'];

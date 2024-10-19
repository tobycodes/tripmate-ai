import { z } from 'zod';

export const createUserSchema = z
  .object({
    firstName: z.string().max(255),
    lastName: z.string().max(255),
    email: z.string().email(),
    password: z.string().max(255),
  })
  .strict();

export type CreateUserDto = z.infer<typeof createUserSchema>;

export const updateUserSchema = z
  .object({
    firstName: z.string().max(255).optional(),
    lastName: z.string().max(255).optional(),
    email: z.string().email().optional(),
    password: z.string().max(255).optional(),
  })
  .strict();

export type UpdateUserDto = z.infer<typeof updateUserSchema>;

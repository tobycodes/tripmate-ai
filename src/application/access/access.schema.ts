import { z } from 'zod';

export const createAccessRequestSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
});

export type CreateAccessRequestDto = z.infer<typeof createAccessRequestSchema>;

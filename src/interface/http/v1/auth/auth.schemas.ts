import { z } from 'zod';

const inquireAccessSchema = z.object({
  email: z.string().email(),
});

const requestAccessSchema = z.object({
  email: z.string().email(),
  firstName: z.string(),
  lastName: z.string(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string(),
  authToken: z.string(),
});

export type InquireAccessDto = z.infer<typeof inquireAccessSchema>;
export type RequestAccessDto = z.infer<typeof requestAccessSchema>;
export type LoginDto = z.infer<typeof loginSchema>;
export type RegisterDto = z.infer<typeof registerSchema>;
export { inquireAccessSchema, requestAccessSchema, loginSchema, registerSchema };

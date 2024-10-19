import { z } from 'zod';

const inquireAccessSchema = z.object({
  email: z.string().email(),
});

const requestAccessSchema = z.object({
  email: z.string().email(),
  firstName: z.string(),
  lastName: z.string(),
});

const approveAccessSchema = z.object({
  id: z.string(),
});

const rejectAccessSchema = z.object({
  id: z.string(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export type InquireAccessDto = z.infer<typeof inquireAccessSchema>;
export type RequestAccessDto = z.infer<typeof requestAccessSchema>;
export type ApproveAccessDto = z.infer<typeof approveAccessSchema>;
export type RejectAccessDto = z.infer<typeof rejectAccessSchema>;
export type LoginDto = z.infer<typeof loginSchema>;
export type RegisterDto = z.infer<typeof registerSchema>;
export {
  inquireAccessSchema,
  requestAccessSchema,
  approveAccessSchema,
  rejectAccessSchema,
  loginSchema,
  registerSchema,
};

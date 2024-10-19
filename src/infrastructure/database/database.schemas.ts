import { z } from 'zod';

export const configSchema = z.object({
  host: z.string(),
  port: z.number().default(5432),
  user: z.string(),
  password: z.string(),
  database: z.string(),
});

export type Config = z.infer<typeof configSchema>;

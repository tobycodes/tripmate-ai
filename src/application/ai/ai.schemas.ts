import { z } from 'zod';

export const configSchema = z.object({
  openAiApiKey: z.string(),
  modelName: z.string(),
});

export type AiConfig = z.infer<typeof configSchema>;

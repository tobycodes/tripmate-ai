import { eventTypeSchema } from 'src/kernel/event';
import { z } from 'zod';

export const eventDataSchema = z.object({
  payload: z.any(),
  type: eventTypeSchema,
  name: z.string(),
});

export type EventDataType = z.infer<typeof eventDataSchema>;

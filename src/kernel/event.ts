import { randomUUID } from 'crypto';
import { z } from 'zod';

export const eventTypeSchema = z.union([
  z.literal('user.created'),
  z.literal('access.requested'),
  z.literal('access.approved'),
  z.literal('access.rejected'),
]);

export type EventEnumType = z.infer<typeof eventTypeSchema>;

export abstract class DomainEvent<T> {
  name: string;
  id: string;
  createdAt: number;

  constructor(
    public readonly type: EventEnumType,
    public readonly payload: T,
  ) {
    this.name = this.constructor.name;
    this.id = randomUUID();
    this.createdAt = Date.now();
  }
}

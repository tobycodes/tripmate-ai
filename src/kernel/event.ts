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
  id: string;
  createdAt: number;

  static type: EventEnumType;

  constructor(
    public readonly type: EventEnumType,
    public readonly payload: T,
  ) {
    this.id = randomUUID();
    this.createdAt = Date.now();
  }
}

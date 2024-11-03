import { DomainEvent, EventEnumType } from 'src/kernel/event';

export type UserRegisteredEventPayload = {
  userId: string;
  email: string;
  firstName: string;
};

export class UserRegisteredEvent extends DomainEvent<UserRegisteredEventPayload> {
  constructor(payload: UserRegisteredEventPayload) {
    super('auth.user-registered', payload);
  }

  static type: EventEnumType = 'auth.user-registered';
}

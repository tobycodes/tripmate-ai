import { DomainEvent, EventEnumType } from 'src/kernel/event';
import { AccessRequestStatus } from './access.types';

export type AccessEventPayload = {
  id: string;
  email: string;
  status: AccessRequestStatus;
};

export class AccessRequestedEvent extends DomainEvent<AccessEventPayload> {
  constructor(payload: AccessEventPayload) {
    super(AccessRequestedEvent.type, payload);
  }

  static type: EventEnumType = 'access.requested';
}

export class AccessApprovedEvent extends DomainEvent<AccessEventPayload> {
  constructor(payload: AccessEventPayload) {
    super(AccessApprovedEvent.type, payload);
  }

  static type: EventEnumType = 'access.approved';
}

export class AccessRejectedEvent extends DomainEvent<AccessEventPayload> {
  constructor(payload: AccessEventPayload) {
    super(AccessRejectedEvent.type, payload);
  }

  static type: EventEnumType = 'access.rejected';
}

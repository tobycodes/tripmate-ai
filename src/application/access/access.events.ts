import { DomainEvent } from 'src/kernel/event';
import { AccessRequestStatus } from './access.types';

export type AccessEventPayload = {
  id: string;
  email: string;
  status: AccessRequestStatus;
};

export class AccessRequestedEvent extends DomainEvent<AccessEventPayload> {
  constructor(payload: AccessEventPayload) {
    super('access.requested', payload);
  }
}

export class AccessApprovedEvent extends DomainEvent<AccessEventPayload> {
  constructor(payload: AccessEventPayload) {
    super('access.approved', payload);
  }
}

export class AccessRejectedEvent extends DomainEvent<AccessEventPayload> {
  constructor(payload: AccessEventPayload) {
    super('access.rejected', payload);
  }
}

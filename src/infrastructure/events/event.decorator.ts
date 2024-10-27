import { OnEvent as OnNestEvent } from '@nestjs/event-emitter';
import { OnEventOptions } from '@nestjs/event-emitter/dist/interfaces';
import { DomainEvent } from 'src/kernel/event';

export const OnEvent = (eventClass: new (data: any) => DomainEvent<any>, eventOptions?: OnEventOptions) =>
  OnNestEvent(eventClass.name, eventOptions);

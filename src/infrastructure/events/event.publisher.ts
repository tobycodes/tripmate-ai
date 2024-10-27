import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { LoggerAdapter } from '../logger/logger.adapter';
import { DomainEvent } from 'src/kernel/event';

@Injectable()
export class EventPublisher {
  constructor(
    private readonly emitter: EventEmitter2,
    private readonly logger: LoggerAdapter,
  ) {}

  publish(event: DomainEvent<any>) {
    const { name, ...data } = event;

    this.logger.info('Publishing event...', { event: data });

    return this.emitter.emit(name, data);
  }
}

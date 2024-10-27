import { Global, Module } from '@nestjs/common';
import { EventPublisher } from './event.publisher';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Global()
@Module({
  imports: [EventEmitterModule.forRoot({ delimiter: '.' })],
  providers: [EventPublisher],
  exports: [EventPublisher],
})
export class EventModule {}

import { Global, Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatMessage } from './chat.entity';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([ChatMessage])],
  providers: [ChatService],
  exports: [ChatService],
})
export class ChatModule {}

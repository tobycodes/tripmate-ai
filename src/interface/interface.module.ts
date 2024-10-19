import { Module } from '@nestjs/common';
import { ChatController } from './http/v1/chat.controller';
import { AuthController } from './http/v1/auth/auth.controller';

@Module({
  controllers: [ChatController, AuthController],
})
export class InterfaceModule {}

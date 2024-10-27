import { Module } from '@nestjs/common';
import { ChatController } from './http/v1/chat.controller';
import { AuthController } from './http/v1/auth/auth.controller';
import { AdminController } from './http/v1/admin/admin.controller';

@Module({
  controllers: [ChatController, AuthController, AdminController],
})
export class InterfaceModule {}

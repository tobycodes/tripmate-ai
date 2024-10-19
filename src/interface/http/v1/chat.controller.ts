import { Controller, Post, Body, Param, Get, UseGuards, UseInterceptors } from '@nestjs/common';
import { ChatService } from 'src/application/chat/chat.service';

import { AuthUser } from '../decorators/user.decorator';
import { ApprovedGuard } from '../guards/approved.guard';
import { User } from 'src/application/user/user.entity';

@UseGuards(ApprovedGuard)
@Controller('v1/chats')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  async appendToChat(@Body() body: { message: string }, @AuthUser() user: User) {
    return this.chatService.upsertChat(user.id, body.message);
  }

  @Get()
  async getChats(@AuthUser() user: User) {
    return this.chatService.getChats(user.id);
  }
}

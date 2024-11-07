import { Response } from 'express';
import { Controller, Post, Body, Get, UseGuards, Res } from '@nestjs/common';
import { ChatService } from 'src/application/chat/chat.service';

import { AuthUser } from '../decorators/user.decorator';
import { ApprovedGuard } from '../guards/approved.guard';
import { User } from 'src/application/user/user.entity';

@UseGuards(ApprovedGuard)
@Controller('v1/chats')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  async appendToChat(@Body() body: { message: string }, @AuthUser() user: User, @Res() res: Response) {
    res.setHeader('Content-Type', 'application/json');
    return this.chatService.streamChat(user.id, body.message, res);
  }

  @Get()
  async getChats(@AuthUser() user: User) {
    const messages = await this.chatService.getChats(user.id);

    return { messages };
  }
}

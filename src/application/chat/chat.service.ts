import { Injectable } from '@nestjs/common';
import { AiService } from '../ai/ai.service';
import { randomUUID } from 'crypto';
import { Repository } from 'typeorm';
import { ChatMessage } from './chat.entity';
import { InjectRepository } from '@nestjs/typeorm';

export interface Chat {
  id: string;
  userId: string;
}

const chats = new Map<string, Chat>();

@Injectable()
export class ChatService {
  constructor(
    private readonly aiService: AiService,
    @InjectRepository(ChatMessage)
    private readonly chatMessageRepo: Repository<ChatMessage>,
  ) {}

  async upsertChat(userId: string, message: string) {
    return this.aiService.chat(message, { threadId: userId });
  }

  async getChats(userId: string) {
    return this.chatMessageRepo.findBy({ user: { id: userId } });
  }
}

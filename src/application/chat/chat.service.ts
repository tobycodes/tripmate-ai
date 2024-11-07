import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { type Writable } from 'stream';
import { MoreThanOrEqual, Repository } from 'typeorm';

import { AiService } from '../ai/ai.service';
import { ChatMessage } from './chat.entity';
import { DailyChatLimitExceededError } from './chat.errors';
import { ChatRole } from './chat.types';

@Injectable()
export class ChatService {
  private readonly MAX_CHATS_PER_DAY = 40;

  private DEFAULT_AI_PROMPT = 'Welcome to Tripmate AI! How can I help you today?';

  constructor(
    private readonly aiService: AiService,
    @InjectRepository(ChatMessage)
    private readonly chatMessageRepo: Repository<ChatMessage>,
  ) {}

  async streamChat(userId: string, message: string, writeStream: Writable) {
    await this.checkChatLimit(userId);

    const userChat = await this.chatMessageRepo.save(this.createChat(message, userId, ChatRole.USER));
    writeStream.write(JSON.stringify(userChat));

    const messageStream = await this.aiService.stream(message, { threadId: userId });

    for await (const { messages } of messageStream) {
      let msg = messages[messages?.length - 1];

      if (msg?.content) {
        if (msg.constructor?.name === 'AIMessage' && typeof msg.content === 'string') {
          const aiMessage = this.createChat(msg.content, userId, ChatRole.ASSISTANT);

          await this.chatMessageRepo.save(aiMessage);
          writeStream.write(JSON.stringify(aiMessage));
        }
      }
    }

    return writeStream.end();
  }

  async getChats(userId: string) {
    const last20 = await this.chatMessageRepo.find({
      where: { user: { id: userId } },
      order: { timestamp: 'DESC' },
      take: 20,
    });

    if (last20.length === 0) {
      const newAiChat = await this.chatMessageRepo.save(
        this.createChat(this.DEFAULT_AI_PROMPT, userId, ChatRole.ASSISTANT),
      );

      return [newAiChat];
    }

    return last20.reverse();
  }

  private async checkChatLimit(userId: string): Promise<void> {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const chatCount = await this.chatMessageRepo.count({
      where: {
        user: { id: userId },
        timestamp: MoreThanOrEqual(startOfDay),
      },
    });

    if (chatCount >= this.MAX_CHATS_PER_DAY) {
      throw new DailyChatLimitExceededError('Daily chat limit exceeded');
    }
  }

  private createChat(message: string, userId: string, role: ChatRole) {
    return this.chatMessageRepo.create({
      user: { id: userId },
      message,
      role,
      timestamp: new Date(),
    });
  }
}

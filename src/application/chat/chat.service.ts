import { type Writable } from 'stream';
import { Injectable } from '@nestjs/common';
import { AiService } from '../ai/ai.service';
import { MoreThanOrEqual, Repository } from 'typeorm';
import { ChatMessage } from './chat.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DailyChatLimitExceededError } from './chat.errors';

@Injectable()
export class ChatService {
  private readonly MAX_CHATS_PER_DAY = 20;

  constructor(
    private readonly aiService: AiService,
    @InjectRepository(ChatMessage)
    private readonly chatMessageRepo: Repository<ChatMessage>,
  ) {}

  async streamChat(userId: string, message: string, writeStream: Writable) {
    await this.checkChatLimit(userId);

    await this.chatMessageRepo.save({
      user: { id: userId },
      message,
      role: 'user',
      timestamp: new Date(),
    });

    const messageStream = await this.aiService.stream(message, { threadId: userId });

    for await (const { messages } of messageStream) {
      let msg = messages[messages?.length - 1];

      if (msg?.content) {
        if (msg.constructor?.name === 'AIMessage' && typeof msg.content === 'string') {
          const aiMessage = this.chatMessageRepo.create({
            user: { id: userId },
            message: msg.content,
            role: 'assistant',
            timestamp: new Date(),
          });

          await this.chatMessageRepo.save(aiMessage);
          writeStream.write(JSON.stringify(aiMessage));
        }
      }
    }

    return writeStream.end();
  }

  async getChats(userId: string) {
    const last10 = await this.chatMessageRepo.find({
      where: { user: { id: userId } },
      order: { timestamp: 'DESC' },
      take: 20,
    });

    return last10.reverse();
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
}

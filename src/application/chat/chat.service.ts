import { type Writable } from 'stream';
import { Injectable } from '@nestjs/common';
import { AiService } from '../ai/ai.service';
import { Repository } from 'typeorm';
import { ChatMessage } from './chat.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ChatService {
  constructor(
    private readonly aiService: AiService,
    @InjectRepository(ChatMessage)
    private readonly chatMessageRepo: Repository<ChatMessage>,
  ) {}

  async streamChat(userId: string, message: string, writeStream: Writable) {
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
}

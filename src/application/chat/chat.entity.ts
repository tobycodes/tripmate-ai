import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../user/user.entity';
import { TABLE_NAMES } from 'src/infrastructure/database/constants';
import { ChatRole } from './chat.types';

@Entity({ name: TABLE_NAMES.CHAT_MESSAGE })
export class ChatMessage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 3000 })
  message: string;

  @Column({ type: 'enum', enum: ChatRole })
  role: ChatRole;

  @ManyToOne(() => User, (user) => user.chatMessages)
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'timestamptz' })
  timestamp: Date;
}

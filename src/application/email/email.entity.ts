import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { EmailStatus } from './email.types';

@Entity()
export class Email {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  from?: string;

  @Column()
  to: string;

  @Column()
  subject: string;

  @Column({ type: 'enum', enum: EmailStatus })
  status: EmailStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ nullable: true, type: 'jsonb' })
  metadata?: Record<string, any>;
}

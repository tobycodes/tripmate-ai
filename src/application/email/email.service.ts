import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MailgunClient } from 'src/infrastructure/clients/mailgun/mailgun.client';
import { Repository } from 'typeorm';
import { Email } from './email.entity';
import { LoggerAdapter } from 'src/infrastructure/logger/logger.adapter';
import { MailgunSendEmailParams } from 'src/infrastructure/clients/mailgun/mailgun.schemas';
import { EmailStatus } from './email.types';

@Injectable()
export class EmailService {
  constructor(
    @InjectRepository(Email)
    private readonly emailRepository: Repository<Email>,
    private readonly mailgunClient: MailgunClient,
    private readonly logger: LoggerAdapter,
  ) {}

  public async send(params: MailgunSendEmailParams) {
    const email = this.emailRepository.create({
      from: params.from,
      to: Array.isArray(params.to) ? params.to.join(',') : params.to,
      subject: params.subject,
      status: EmailStatus.PENDING,
    });

    try {
      const result = await this.mailgunClient.sendEmail(params);
      email.status = EmailStatus.SENT;
      email.metadata = { mailgunResult: result };

      this.logger.info({ emailId: email.id }, 'Email sent!');
    } catch (error) {
      email.status = EmailStatus.FAILED;
      email.metadata = { mailgunError: error.message };
      this.logger.error({ emailId: email.id }, 'Failed to send email!');
    } finally {
      await this.emailRepository.save(email);
    }

    return email;
  }

  public parseTemplate(template: string, data: Record<string, string>): string {
    return template.replace(/{(\w+)}/g, (match, p1) => data[p1] || match);
  }
}

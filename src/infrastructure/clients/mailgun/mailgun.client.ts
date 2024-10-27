import { Injectable } from '@nestjs/common';
import * as FormData from 'form-data';
import Mailgun, { MailgunMessageData } from 'mailgun.js';
import { type IMailgunClient } from 'mailgun.js/Interfaces';

import { MailgunConfig, MailgunSendEmailParams, mailgunSendEmailSchema } from './mailgun.schemas';
import { LoggerAdapter } from 'src/infrastructure/logger/logger.adapter';
import { MailgunSendEmailError, MailgunSendEmailParamsError } from './mailgun.errors';

@Injectable()
export class MailgunClient {
  private client: IMailgunClient;

  constructor(
    private readonly config: MailgunConfig,
    private readonly logger: LoggerAdapter,
  ) {
    const mailgun = new Mailgun(FormData);
    this.client = mailgun.client({ username: this.config.username, key: this.config.apiKey });
  }

  public async sendEmail(params: MailgunSendEmailParams) {
    let data: MailgunMessageData;

    try {
      const { content, ...rest } = mailgunSendEmailSchema.parse(params);
      data = {
        from: params.from || this.config.defaultFrom,
        ...rest,
        text: content.text,
        html: content.html,
        message: content.mime,
        template: '',
      };
    } catch (error) {
      this.logger.error(error);
      throw new MailgunSendEmailParamsError('Invalid email params', { subject: params.subject }, error);
    }

    try {
      this.logger.info('Sending email...');
      const result = await this.client.messages.create(this.config.domain, data);
      this.logger.info('Email sent successfully', { result });
      return { id: result.id, status: result.status };
    } catch (error) {
      this.logger.error(error);
      throw new MailgunSendEmailError(`Failed to send email: ${error.message}`, { params }, error);
    }
  }
}

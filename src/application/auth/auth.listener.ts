import * as fs from 'node:fs/promises';
import * as path from 'node:path';

import { Injectable } from '@nestjs/common';
import { EmailService } from '../email/email.service';
import { LoggerAdapter } from 'src/infrastructure/logger/logger.adapter';
import { OnEvent } from 'src/infrastructure/events/event.decorator';
import { UserRegisteredEvent } from './auth.events';
import { ConfigAdapter } from 'src/infrastructure/config/config.adapter';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthListener {
  constructor(
    private readonly emailService: EmailService,
    private readonly logger: LoggerAdapter,
    private readonly config: ConfigAdapter,
    private readonly userService: UserService,
  ) {}

  @OnEvent(UserRegisteredEvent)
  async handleUserRegisterdEvent(event: UserRegisteredEvent) {
    this.logger.debug({ event }, 'User registered event received!');
    this.logger.assign({ eventType: event.type, eventId: event.id });

    const {
      payload: { userId },
    } = event;

    if (!userId) {
      this.logger.error({ payload: event.payload }, 'No userId in event payload');
      return;
    }

    this.logger.assign({ userId });
    const user = await this.userService.safeGet(userId);

    if (!user) {
      this.logger.error('User not found for event');
      return;
    }

    if (!user.isApproved) {
      this.logger.warn('Registered user is not approved');
      return;
    }

    const template = await fs.readFile(path.join(__dirname, 'emails/user-registered.html'), 'utf-8');
    const html = this.emailService.parseTemplate(template, {
      firstName: user.firstName,
      ctaLink: `${this.config.get('app.clientUrl')}/chat`,
      supportEmail: this.config.get('app.accessAdminEmail'),
    });

    await this.emailService.send({
      to: user.email,
      subject: 'Welcome to Tripmate AI! Your Personalized Travel and Food Guide Awaits 🌍🍽️',
      content: { html },
    });
  }
}

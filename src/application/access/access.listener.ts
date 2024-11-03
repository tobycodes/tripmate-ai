import * as fs from 'node:fs/promises';
import * as path from 'node:path';

import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { ConfigAdapter } from 'src/infrastructure/config/config.adapter';
import { OnEvent } from 'src/infrastructure/events/event.decorator';
import { LoggerAdapter } from 'src/infrastructure/logger/logger.adapter';

import { AccessApprovedEvent, AccessRejectedEvent, AccessRequestedEvent } from './access.events';
import { AccessService } from './access.service';
import { AccessRequest } from './access.entity';
import { AccessRequestStatus } from './access.types';
import { EmailService } from '../email/email.service';

@Injectable()
export class AccessRequestListener {
  constructor(
    private readonly emailService: EmailService,
    private readonly logger: LoggerAdapter,
    private readonly config: ConfigAdapter,
    private readonly jwtService: JwtService,
    private readonly accessService: AccessService,
  ) {}

  @OnEvent(AccessRequestedEvent)
  async handleAccessRequestedEvent(event: AccessRequestedEvent) {
    this.logger.info({ event }, 'Access requested event received!');
    const { email } = event.payload;

    const accessRequest = await this.accessService.getAccessRequest(email);

    if (!accessRequest) {
      this.logger.error({ email }, 'Access request not found!');
      return;
    }

    if (accessRequest.status !== AccessRequestStatus.PENDING) {
      this.logger.error({ email }, 'Access request is not pending!');
      return;
    }

    const accessToken = await this.jwtService.signAsync(
      {
        email,
        accessRequestId: accessRequest.id,
      },
      { expiresIn: '7d' },
    );

    const hostFullUrl = `${this.config.get('app.hostUrl')}/${this.config.get('app.apiVersion')}`;
    const approveUrl = `${hostFullUrl}/admin/access/approve?token=${accessToken}`;
    const rejectUrl = `${hostFullUrl}/admin/access/reject?token=${accessToken}`;

    const template = await fs.readFile(path.join(__dirname, 'email/access-request.html'), 'utf-8');
    const html = this.emailService.parseTemplate(template, {
      name: this.getAccessRequestName(accessRequest),
      email,
      createdAt: this.formatDate(accessRequest.createdAt),
      approveUrl,
      rejectUrl,
    });

    await this.emailService.send({
      to: this.config.get('app.accessAdminEmail'),
      subject: 'Access requested!',
      content: { html },
    });
  }

  @OnEvent(AccessApprovedEvent)
  async handleAccessApprovedEvent(event: AccessApprovedEvent) {
    this.logger.info({ event }, 'Access approved event received!');
    const { email } = event.payload;

    const accessRequest = await this.accessService.getAccessRequest(email);

    if (!accessRequest) {
      this.logger.error({ email }, 'Access request not found!');
      return;
    }

    if (accessRequest.status !== AccessRequestStatus.APPROVED) {
      this.logger.error({ email }, 'Access request is not approved!');
      return;
    }

    const accessToken = await this.jwtService.signAsync(
      {
        email,
        accessRequestId: accessRequest.id,
      },
      { expiresIn: '7d' },
    );

    const accountCreationLink = `${this.config.get('app.clientUrl')}/auth/${accessToken}`;

    const template = await fs.readFile(path.join(__dirname, 'email/access-request-approved.html'), 'utf-8');
    const html = this.emailService.parseTemplate(template, {
      firstName: accessRequest.firstName,
      accountCreationLink,
    });

    await this.emailService.send({
      to: email,
      subject: 'Access approved!',
      content: { html },
    });
  }

  @OnEvent(AccessRejectedEvent)
  async handleAccessRejectedEvent(event: AccessRejectedEvent) {
    this.logger.info({ event }, 'Access rejected event received!');
    const { email } = event.payload;

    const accessRequest = await this.accessService.getAccessRequest(email);

    if (!accessRequest) {
      this.logger.error({ email }, 'Access request not found!');
      return;
    }

    if (accessRequest.status !== AccessRequestStatus.REJECTED) {
      this.logger.error({ email }, 'Access request is not rejected!');
      return;
    }

    const template = await fs.readFile(path.join(__dirname, 'email/access-request-rejected.html'), 'utf-8');
    const html = this.emailService.parseTemplate(template, {
      name: this.getAccessRequestName(accessRequest),
    });

    await this.emailService.send({
      to: email,
      subject: 'Access rejected!',
      content: { html },
    });
  }

  private getAccessRequestName(accessRequest: AccessRequest): string {
    return `${accessRequest.firstName} ${accessRequest.lastName}`;
  }

  private formatDate(date: Date): string {
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}

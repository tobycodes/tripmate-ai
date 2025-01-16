import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { EventPublisher } from 'src/infrastructure/events/event.publisher';

import { UserService } from '../user/user.service';

import { AccessRequest } from './access.entity';
import { AccessApprovedEvent, AccessRejectedEvent, AccessRequestedEvent } from './access.events';
import { CreateAccessRequestDto, createAccessRequestSchema } from './access.schema';
import { AccessRequestStatus } from './access.types';
import { NotFoundError } from 'src/kernel/errors';
import { LoggerAdapter } from 'src/infrastructure/logger/logger.adapter';

@Injectable()
export class AccessService {
  private MAX_FREE_SLOTS = 15;

  constructor(
    @InjectRepository(AccessRequest) private readonly accessRequestRepo: Repository<AccessRequest>,
    private readonly userService: UserService,
    private readonly eventPublisher: EventPublisher,
    private readonly logger: LoggerAdapter,
  ) {}

  private async isAvailable(): Promise<boolean> {
    const accessRequestCount = await this.accessRequestRepo.count({ where: { status: AccessRequestStatus.APPROVED } });

    return accessRequestCount < this.MAX_FREE_SLOTS;
  }

  async hasAccess(email: string): Promise<{ hasAccount: boolean; accessRequest: AccessRequest | null }> {
    const user = await this.userService.safeGetByEmail(email);

    if (user) {
      return { hasAccount: true, accessRequest: null };
    }

    const accessRequest = await this.accessRequestRepo.findOneBy({ email });

    if (accessRequest) {
      return {
        hasAccount: false,
        accessRequest,
      };
    }

    return { hasAccount: false, accessRequest: null };
  }

  async requestAccess(dto: CreateAccessRequestDto): Promise<AccessRequest> {
    const parsedDto = createAccessRequestSchema.parse(dto);
    const accessRequest = await this.accessRequestRepo.findOneBy({ email: parsedDto.email });

    if (accessRequest) {
      return accessRequest;
    }

    const newAccessRequest = this.accessRequestRepo.create(parsedDto);

    if (await this.isAvailable()) {
      newAccessRequest.status = AccessRequestStatus.APPROVED;
      newAccessRequest.approvedAt = new Date();
    }

    await this.accessRequestRepo.save(newAccessRequest);

    this.publishEvent(newAccessRequest);

    return newAccessRequest;
  }

  async getAccessRequest(email: string): Promise<AccessRequest | null> {
    return this.accessRequestRepo.findOneBy({ email });
  }

  async getAccessRequestById(id: string): Promise<AccessRequest | null> {
    return this.accessRequestRepo.findOneBy({ id });
  }

  async approveAccessRequest(id: string): Promise<AccessRequest> {
    const accessRequest = await this.getAccessRequestById(id);

    if (!accessRequest) {
      throw new NotFoundError('Access request not found', { accessRequestId: id });
    }

    accessRequest.status = AccessRequestStatus.APPROVED;
    accessRequest.approvedAt = new Date();

    await this.accessRequestRepo.save(accessRequest);

    this.publishEvent(accessRequest);

    return accessRequest;
  }

  async rejectAccessRequest(id: string): Promise<AccessRequest> {
    const accessRequest = await this.getAccessRequestById(id);

    if (!accessRequest) {
      throw new NotFoundError('Access request not found', { accessRequestId: id });
    }

    accessRequest.status = AccessRequestStatus.REJECTED;
    accessRequest.rejectedAt = new Date();

    await this.accessRequestRepo.save(accessRequest);

    this.publishEvent(accessRequest);

    return accessRequest;
  }

  private publishEvent(accessRequest: AccessRequest) {
    const payload = {
      id: accessRequest.id,
      email: accessRequest.email,
      status: accessRequest.status,
    };

    switch (accessRequest.status) {
      case AccessRequestStatus.PENDING:
        this.eventPublisher.publish(new AccessRequestedEvent(payload));
        break;
      case AccessRequestStatus.APPROVED:
        this.eventPublisher.publish(new AccessApprovedEvent(payload));
        break;
      case AccessRequestStatus.REJECTED:
        this.eventPublisher.publish(new AccessRejectedEvent(payload));
        break;
      default:
        this.logger.error({ accessRequestId: accessRequest.id }, 'Unknown access request status!');
        break;
    }
  }
}

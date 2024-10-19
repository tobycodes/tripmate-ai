import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccessRequest } from './access.entity';
import { CreateAccessRequestDto, createAccessRequestSchema } from './access.schema';

@Injectable()
export class AccessService {
  private MAX_FREE_SLOTS = 10;

  constructor(
    private readonly userService: UserService,
    @InjectRepository(AccessRequest) private readonly accessRequestRepo: Repository<AccessRequest>,
  ) {}

  private async isAvailable(): Promise<boolean> {
    const accessRequestCount = await this.accessRequestRepo.count({ where: { status: 'approved' } });

    return accessRequestCount < this.MAX_FREE_SLOTS;
  }

  async hasAccess(email: string): Promise<{ hasAccount: boolean; canAccess?: boolean; accessRequest?: AccessRequest }> {
    const user = await this.userService.getByEmail(email);

    if (user) {
      return { hasAccount: true };
    }

    const accessRequest = await this.accessRequestRepo.findOneBy({ email });

    if (accessRequest) {
      return { hasAccount: false, canAccess: accessRequest.status === 'approved', accessRequest };
    }

    const freeSlot = await this.isAvailable();

    return { hasAccount: false, canAccess: freeSlot };
  }

  async requestAccess(dto: CreateAccessRequestDto): Promise<AccessRequest> {
    const parsedDto = createAccessRequestSchema.parse(dto);
    const accessRequest = await this.accessRequestRepo.findOneBy({ email: parsedDto.email });

    if (accessRequest) {
      return accessRequest;
    }

    const newAccessRequest = this.accessRequestRepo.create(parsedDto);

    if (await this.isAvailable()) {
      newAccessRequest.status = 'approved';
      newAccessRequest.approvedAt = new Date();
    }

    return this.accessRequestRepo.save(newAccessRequest);
  }

  async getAccessRequest(email: string): Promise<AccessRequest | null> {
    return this.accessRequestRepo.findOneBy({ email });
  }

  async approveAccessRequest(id: string): Promise<AccessRequest> {
    const accessRequest = await this.accessRequestRepo.findOne({ where: { id } });

    if (!accessRequest) {
      throw new Error('Access request not found');
    }

    accessRequest.status = 'approved';
    accessRequest.approvedAt = new Date();

    return this.accessRequestRepo.save(accessRequest);
  }

  async rejectAccessRequest(id: string): Promise<AccessRequest> {
    const accessRequest = await this.accessRequestRepo.findOne({ where: { id } });

    if (!accessRequest) {
      throw new Error('Access request not found');
    }

    accessRequest.status = 'rejected';
    accessRequest.rejectedAt = new Date();

    return this.accessRequestRepo.save(accessRequest);
  }
}

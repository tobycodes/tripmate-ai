import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AccessService } from 'src/application/access/access.service';
import { LoggerAdapter } from 'src/infrastructure/logger/logger.adapter';

@Controller('v1/admin')
export class AdminController {
  constructor(
    private readonly accessService: AccessService,
    private readonly logger: LoggerAdapter,
    private readonly jwtService: JwtService,
  ) {}

  @Get('access/approve')
  async approveAccess(@Query('token') token: string) {
    let accessRequestId: string;

    try {
      ({ accessRequestId } = await this.jwtService.verifyAsync(token));
    } catch (error) {
      this.logger.error(error, 'Error approving access request');
      throw new BadRequestException('Invalid token', { cause: error });
    }

    return this.accessService.approveAccessRequest(accessRequestId);
  }

  @Get('access/reject')
  async rejectAccess(@Query('token') token: string) {
    let accessRequestId: string;

    try {
      ({ accessRequestId } = await this.jwtService.verifyAsync(token));
    } catch (error) {
      this.logger.error(error, 'Error rejecting access request');
      throw new BadRequestException('Invalid token', { cause: error });
    }

    return this.accessService.rejectAccessRequest(accessRequestId);
  }
}

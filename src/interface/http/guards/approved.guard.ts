import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from 'src/application/auth/auth.service';
import { UserService } from 'src/application/user/user.service';
import { LoggerAdapter } from 'src/infrastructure/logger/logger.adapter';
import { AuthenticatedGuard } from './authenticated.guard';

@Injectable()
export class ApprovedGuard extends AuthenticatedGuard {
  private readonly appLogger: LoggerAdapter;

  constructor(logger: LoggerAdapter, authService: AuthService, userService: UserService) {
    super(logger, authService, userService);
    this.appLogger = logger;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const result = await super.canActivate(context);
    const req = context.switchToHttp().getRequest();

    this.appLogger.debug('Checking if user is approved');

    if (!req.user?.isApproved) {
      this.appLogger.debug({ user: req.user }, 'User is not approved');
      throw new UnauthorizedException('User is not approved');
    }

    return result;
  }
}

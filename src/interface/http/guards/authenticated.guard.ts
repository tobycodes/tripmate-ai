import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from 'src/application/auth/auth.service';
import { UserService } from 'src/application/user/user.service';
import { LoggerAdapter } from 'src/infrastructure/logger/logger.adapter';

@Injectable()
export class AuthenticatedGuard implements CanActivate {
  constructor(
    private readonly logger: LoggerAdapter,
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1];

    if (!token) {
      this.logger.debug('No token provided');
      throw new UnauthorizedException('No token provided');
    }

    try {
      const jwtUser = await this.authService.verifyToken(token);
      request.user = await this.userService.get(jwtUser.id);
      return true;
    } catch (error) {
      this.logger.debug(error, 'Invalid token');
      throw new UnauthorizedException('Invalid token');
    }
  }
}

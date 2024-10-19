import { CanActivate, ExecutionContext, ForbiddenException, Injectable, SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class PublicGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const user = context.switchToHttp().getRequest().user;

    if (isPublic && user) {
      throw new ForbiddenException('User is authenticated');
    }

    return true;
  }
}

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = (isPublic = true) => SetMetadata(IS_PUBLIC_KEY, isPublic);

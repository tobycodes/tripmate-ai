import { ExecutionContext } from '@nestjs/common';

import { createParamDecorator } from '@nestjs/common';
import { User } from 'src/application/user/user.entity';

export const AuthUser = createParamDecorator((_data: unknown, ctx: ExecutionContext): User => {
  const request = ctx.switchToHttp().getRequest();

  return request.user;
});

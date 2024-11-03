import { Global, Module } from '@nestjs/common';

import { AuthService } from './auth.service';
import { AuthListener } from './auth.listener';
import { EmailModule } from '../email/email.module';

@Global()
@Module({
  imports: [EmailModule],
  providers: [AuthService, AuthListener],
  exports: [AuthService],
})
export class AuthModule {}

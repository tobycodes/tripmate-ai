import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AccessRequest } from './access.entity';
import { AccessService } from './access.service';
import { AccessRequestListener } from './access.listener';
import { EmailModule } from '../email/email.module';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([AccessRequest]), EmailModule],
  providers: [AccessService, AccessRequestListener],
  exports: [AccessService],
})
export class AccessModule {}

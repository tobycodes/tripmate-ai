import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AccessRequest } from './access.entity';
import { AccessService } from './access.service';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([AccessRequest])],
  providers: [AccessService],
  exports: [AccessService],
})
export class AccessModule {}

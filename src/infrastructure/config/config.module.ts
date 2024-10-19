import { Global, Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';

import { ConfigService } from './config.service';
import appConfig from './config.register';

@Global()
@Module({
  providers: [ConfigService],
  exports: [ConfigService],
  imports: [
    NestConfigModule.forRoot({
      load: [appConfig],
      cache: true,
      isGlobal: true,
      expandVariables: true,
    }),
  ],
})
export class ConfigModule {}

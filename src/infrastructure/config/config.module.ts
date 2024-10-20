import { Global, Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';

import { ConfigAdapter } from './config.adapter';
import { appConfig, dbConfig } from './config.register';

@Global()
@Module({
  providers: [ConfigAdapter],
  exports: [ConfigAdapter],
  imports: [
    NestConfigModule.forRoot({
      load: [appConfig, dbConfig],
      cache: true,
      isGlobal: true,
      expandVariables: true,
    }),
  ],
})
export class ConfigModule {}

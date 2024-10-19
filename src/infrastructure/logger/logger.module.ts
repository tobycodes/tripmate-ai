import * as crypto from 'node:crypto';
import { Global, Module } from '@nestjs/common';
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino';

import { LoggerAdapter } from './logger.adapter';
import { ConfigService } from '@nestjs/config';
import { TargetEnv } from '../config/config.register';

@Global()
@Module({
  providers: [LoggerAdapter],
  exports: [LoggerAdapter],
  imports: [
    PinoLoggerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        const env = config.get('app.env');

        const isDev = env === TargetEnv.DEVELOPMENT || env === TargetEnv.LOCAL;
        const redactWords = [
          'authorization',
          'email',
          'password',
          'repeatPassword',
          'repeat_password',
          'confirmPassword',
          'confirm_password',
          'apiKey',
          'api_key',
          'secretKey',
          'secret_key',
        ];

        const loggerConfig = {
          quietReqLogger: isDev,
          level: 'debug',
          enabled: env !== TargetEnv.TEST,
          redact: redactWords.map((w) => [w, `*.${w}`, `*.*.${w}`]).flat(),
          autoLogging: false,
          ...(isDev && {
            transport: { target: 'pino-pretty', options: { colorize: true } },
          }),
        };

        return {
          pinoHttp: {
            ...loggerConfig,
            name: 'tripmate-ai',
            genReqId: () => crypto.randomUUID(),
          },
        };
      },
    }),
  ],
})
export class LoggerModule {}

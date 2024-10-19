import * as crypto from 'node:crypto';
import { Global, Module } from '@nestjs/common';
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino';

import { TargetEnv } from '../config/config.register';
import { ConfigAdapter } from '../config/config.adapter';
import { LoggerAdapter } from './logger.adapter';

@Global()
@Module({
  providers: [LoggerAdapter],
  exports: [LoggerAdapter],
  imports: [
    PinoLoggerModule.forRootAsync({
      inject: [ConfigAdapter],
      useFactory: async (config: ConfigAdapter) => {
        const env = config.get('app.env');

        const isDev = env === TargetEnv.DEVELOPMENT || env === TargetEnv.LOCAL;
        const redactWords = ['authorization', 'email', 'password', 'apiKey', 'api_key', 'secretKey', 'secret_key'];

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

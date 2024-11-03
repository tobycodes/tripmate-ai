import { NestFactory } from '@nestjs/core';
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino';

import { AppModule } from './app.module';
import { ExceptionInterceptor } from './interface/http/interceptors/exception.interceptor';
import { ConfigAdapter } from './infrastructure/config/config.adapter';
import { LoggerAdapter } from './infrastructure/logger/logger.adapter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = app.get(Logger);
  const config = app.get(ConfigAdapter);
  const loggerAdapter = await app.resolve(LoggerAdapter);

  app.useLogger(logger);
  app.useGlobalInterceptors(new LoggerErrorInterceptor(), new ExceptionInterceptor(loggerAdapter));
  app.enableCors(config.get('app.cors'));
  await app.listen(config.get('app.port'));
}

bootstrap();

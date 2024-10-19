import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggerAdapter } from './infrastructure/logger/logger.adapter';
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino';
import { ExceptionInterceptor } from './interface/http/interceptors/exception.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = app.get(Logger);

  app.useLogger(logger);
  app.useGlobalInterceptors(new LoggerErrorInterceptor(), new ExceptionInterceptor());
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();

import { Observable } from 'rxjs';

import {
  HttpException,
  InternalServerErrorException,
  NestInterceptor,
  NotFoundException,
  BadRequestException,
  ConflictException,
  UnprocessableEntityException,
  HttpStatus,
} from '@nestjs/common';

import { CallHandler } from '@nestjs/common';

import { ExecutionContext } from '@nestjs/common';
import { catchError } from 'rxjs';
import { ZodError } from 'zod';
import { ArgumentInvalidError, ConflictError, NotFoundError } from 'src/kernel/errors';
import { DailyChatLimitExceededError } from 'src/application/chat/chat.errors';
import { LoggerAdapter } from 'src/infrastructure/logger/logger.adapter';

export class ExceptionInterceptor implements NestInterceptor {
  constructor(private readonly logger: LoggerAdapter) {}

  intercept(_ctx: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error) => {
        this.logger.error(error);

        if (error instanceof HttpException) {
          throw error;
        }

        if (error instanceof ZodError) {
          throw new BadRequestException(error.message, { cause: error });
        }

        if (error instanceof DailyChatLimitExceededError) {
          throw new HttpException(error.message, HttpStatus.TOO_MANY_REQUESTS, { cause: error });
        }

        if (error instanceof ArgumentInvalidError) {
          throw new UnprocessableEntityException(error.message, { cause: error });
        }

        if (error instanceof ConflictError) {
          throw new ConflictException(error.message, { cause: error });
        }

        if (error instanceof NotFoundError) {
          throw new NotFoundException(error.message, { cause: error });
        }

        throw new InternalServerErrorException(error.message, { cause: error });
      }),
    );
  }
}

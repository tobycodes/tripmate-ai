import { NotFoundError, Observable } from 'rxjs';

import {
  HttpException,
  InternalServerErrorException,
  NestInterceptor,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';

import { CallHandler } from '@nestjs/common';

import { ExecutionContext } from '@nestjs/common';
import { catchError } from 'rxjs';
import { ZodError } from 'zod';
import { ConflictError } from 'src/kernel/errors';

export class ExceptionInterceptor implements NestInterceptor {
  constructor() {}

  intercept(_ctx: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error) => {
        if (error instanceof HttpException) {
          throw error;
        }

        if (error instanceof ZodError) {
          throw new BadRequestException(error.message, { cause: error });
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
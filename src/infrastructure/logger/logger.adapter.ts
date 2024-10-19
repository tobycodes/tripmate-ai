import { Inject, Injectable, Scope } from '@nestjs/common';
import { INQUIRER } from '@nestjs/core';
import { PARAMS_PROVIDER_TOKEN, Params, PinoLogger } from 'nestjs-pino';

@Injectable({ scope: Scope.TRANSIENT })
export class LoggerAdapter extends PinoLogger {
  constructor(
    @Inject(INQUIRER) private parentClass: object,
    @Inject(PARAMS_PROVIDER_TOKEN) params: Params,
  ) {
    super(params);
    const context = this.parentClass?.constructor?.name;

    this.setContext(context);
  }
}

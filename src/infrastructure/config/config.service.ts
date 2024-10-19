import { Global, Injectable } from '@nestjs/common';
import type { Path, PathValue } from '@nestjs/config';
import { ConfigService as NestConfigService } from '@nestjs/config';

import type { AppConfigType } from './config.register';

export type FullConfigType = {
  app: AppConfigType;
};

@Global()
@Injectable()
export class ConfigService extends NestConfigService<FullConfigType, true> {
  constructor(...args: any[]) {
    super(...args);
  }

  get<K extends Path<FullConfigType>>(key: K): PathValue<FullConfigType, K> {
    return super.get(key, { infer: true });
  }
}

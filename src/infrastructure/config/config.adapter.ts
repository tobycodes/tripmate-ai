import { Global, Injectable } from '@nestjs/common';
import type { Path, PathValue } from '@nestjs/config';
import { ConfigService as NestConfigService } from '@nestjs/config';

import type { AppConfigType, DbConfigType } from './config.register';

export type FullConfigType = {
  app: AppConfigType;
  db: DbConfigType;
};

@Global()
@Injectable()
export class ConfigAdapter extends NestConfigService<FullConfigType, true> {
  constructor(...args: any[]) {
    super(...args);
  }

  get<K extends Path<FullConfigType>>(key: K): PathValue<FullConfigType, K> {
    return super.get(key, { infer: true });
  }
}

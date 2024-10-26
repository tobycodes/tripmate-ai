import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';

import { Injectable, Module } from '@nestjs/common';
import { TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { ConfigAdapter } from '../config/config.adapter';
import { DATABASE_SCHEMA_NAME } from './constants';

@Injectable()
class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private readonly configAdapter: ConfigAdapter) {}

  async createTypeOrmOptions(): Promise<TypeOrmModuleOptions> {
    const config = this.configAdapter.get('db');

    return {
      type: 'postgres',
      host: config.host,
      port: config.port,
      username: config.user,
      password: config.password,
      database: config.database,
      autoLoadEntities: true,
      synchronize: false,
      migrations: ['dist/infrastructure/database/migrations/*.js'],
      logging: this.configAdapter.get('app.isDev'),
      schema: DATABASE_SCHEMA_NAME,
      dropSchema: this.configAdapter.get('app.isTest'),
    };
  }
}

@Module({
  imports: [TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService })],
})
export class DatabaseModule {}

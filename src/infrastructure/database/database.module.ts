import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';

import { Injectable, Module } from '@nestjs/common';
import { TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { configSchema } from './database.schemas';
import { ConfigAdapter } from '../config/config.adapter';

@Injectable()
class TypeOrmConfigService implements TypeOrmOptionsFactory { 
  constructor(private readonly configAdapter: ConfigAdapter) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
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
      logging: true,
    };
  }
}

@Module({
  imports: [TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService })],
})
export class DatabaseModule {}

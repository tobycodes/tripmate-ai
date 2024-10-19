import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';

import { Injectable, Module } from '@nestjs/common';
import { TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { configSchema } from './database.schemas';

@Injectable()
class TypeOrmConfigService implements TypeOrmOptionsFactory {
  createTypeOrmOptions(): TypeOrmModuleOptions {
    const config = configSchema.parse({
      host: process.env.DATABASE_HOST || 'localhost',
      port: parseInt(process.env.DATABASE_PORT || '5432'),
      user: process.env.DATABASE_USER || 'postgres',
      password: process.env.DATABASE_PASSWORD || 'postgres',
      database: process.env.DATABASE_NAME || 'postgres',
    });

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

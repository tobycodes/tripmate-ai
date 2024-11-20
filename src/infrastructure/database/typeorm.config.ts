import { DataSource } from 'typeorm';
import { DATABASE_SCHEMA_NAME } from './constants';

export default new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: ['dist/**/*.entity.js'],
  synchronize: process.env.NODE_ENV === 'development',
  migrations: ['dist/infrastructure/database/migrations/*.js'],
  schema: DATABASE_SCHEMA_NAME,
});

import { DataSource } from 'typeorm';

export default new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '5432'),
  username: process.env.DATABASE_USER || 'postgres',
  password: process.env.DATABASE_PASSWORD || 'postgres',
  database: process.env.DATABASE_NAME || 'postgres',
  entities: ['dist/**/*.entity.js'],
  synchronize: process.env.NODE_ENV === 'development',
  migrations: ['dist/infrastructure/database/migrations/*.js'],
});

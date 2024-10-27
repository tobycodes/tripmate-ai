/* eslint-disable @typescript-eslint/no-non-null-assertion */
import type { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { registerAs } from '@nestjs/config';
import type { ConfigType } from '@nestjs/config';
import { env } from 'process';
import { z } from 'zod';

export enum TargetEnv {
  LOCAL = 'local',
  DEVELOPMENT = 'development',
  TEST = 'test',
  STAGING = 'staging',
  PRODUCTION = 'production',
}

const appVarsSchema = z.object({
  name: z.string(),
  port: z.number().default(3000),
  env: z.nativeEnum(TargetEnv).default(TargetEnv.DEVELOPMENT),
  jwtSecret: z.string(),
  cryptoSecret: z.string(),
  hostUrl: z.string(),
  authTokenType: z.string(),
  clientUrl: z.string(),
  debugMode: z.boolean().default(false),
  accessAdminEmail: z.string().email(),
});

const appConfig = registerAs('app', () => {
  const envVars = parseEnvVars();

  const corsConfig: CorsOptions = {
    origin: [...splitString(envVars.hostUrl), ...splitString(envVars.clientUrl)],
  };

  const isDev = envVars.env === TargetEnv.DEVELOPMENT || envVars.env === TargetEnv.LOCAL;

  return {
    name: envVars.name,
    port: envVars.port,
    env: envVars.env,
    jwtSecret: envVars.jwtSecret,
    cryptoSecret: envVars.cryptoSecret,
    hostUrl: envVars.hostUrl,
    version: process.env.npm_package_version || '0.0.1',
    apiVersion: 'v1',
    isDebugMode: envVars.debugMode,
    isProd: envVars.env === TargetEnv.PRODUCTION,
    authTokenType: envVars.authTokenType,
    clientUrl: envVars.clientUrl,
    isDev,
    isLocal: envVars.env === TargetEnv.LOCAL,
    isTest: envVars.env === TargetEnv.TEST,
    cors: corsConfig,
    uploadFolder: '/tmp/uploads',
    accessAdminEmail: envVars.accessAdminEmail,
  };
});

const parseEnvVars = () => {
  return appVarsSchema.parse({
    name: process.env.APP_NAME,
    port: parseInt(process.env.APP_PORT || '8080', 10),
    env: process.env.APP_ENV,
    jwtSecret: process.env.JWT_SECRET,
    cryptoSecret: process.env.CRYPTO_SECRET,
    hostUrl: process.env.HOST_URL,
    authTokenType: process.env.AUTH_TOKEN_TYPE,
    clientUrl: process.env.CLIENT_URL,
    debugMode: process.env.DEBUG_MODE === 'true',
    accessAdminEmail: process.env.ACCESS_ADMIN_EMAIL,
  });
};

const splitString = (str: string) =>
  str
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

export const APP_CONFIG_KEY = appConfig.KEY;
export type AppConfigType = ConfigType<typeof appConfig>;

const dbVarsSchema = z.object({
  host: z.string(),
  port: z.number().default(5432),
  user: z.string(),
  password: z.string(),
  database: z.string(),
});

const dbConfig = registerAs('db', () => {
  return dbVarsSchema.parse({
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT || '5432'),
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
  });
});

export const DB_CONFIG_KEY = dbConfig.KEY;
export type DbConfigType = ConfigType<typeof dbConfig>;

export { appConfig, dbConfig };

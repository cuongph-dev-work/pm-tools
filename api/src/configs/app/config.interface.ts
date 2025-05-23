import { NODE_ENV } from '@configs/enum/app';
import { STORAGE_DELETE_MODE, STORAGE_DRIVER } from '@configs/enum/file';

export interface Config {
  database: DatabaseConfig;
  app: AppConfig;
  jwt: JwtConfig;
  mail: MailConfig;
  storage: StorageConfig;
}

export interface AppConfig {
  name: string;
  nodeEnv: NODE_ENV;
  port: number;
  fallbackLanguage: string;
  headerLanguage: string;
  redisHost: string;
  redisPort: number;
  redisPassword: string;
  backendUrl: string;
}

export interface DatabaseConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
}

export interface JwtConfig {
  expiresIn: string;
  refreshIn: string;
}

export interface MailConfig {
  provider: string;
  mailFrom: string;
  maildev: {
    host: string;
    port: number;
    username: string;
    password: string;
  };
  gmail: {
    host: string;
    port: number;
    secure: boolean;
    username: string;
    password: string;
  };
  frontendUrl: string;
}

export interface StorageConfig {
  driver: STORAGE_DRIVER;
  deleteMode: STORAGE_DELETE_MODE;
  cloudinary: {
    cloudName: string;
    apiKey: string;
    apiSecret: string;
  };
}

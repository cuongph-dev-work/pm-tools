import { NODE_ENV } from '@configs/enum/app';
import { STORAGE_DELETE_MODE, STORAGE_DRIVER } from '@configs/enum/file';
import { config as configDotEnv } from 'dotenv';
import { toUpper } from 'lodash';
import { Config } from './config.interface';

configDotEnv();
const configs = (): Config => {
  return {
    app: {
      name: process.env.APP_NAME || 'APP NAME',
      nodeEnv: (process.env.NODE_ENV as NODE_ENV) || NODE_ENV.PRODUCTION,
      port: +(process.env.APP_PORT || '3000'),
      fallbackLanguage: process.env.APP_FALLBACK_LANGUAGE || 'vi',
      headerLanguage: process.env.APP_HEADER_LANGUAGE || 'x-custom-lang',
      redisHost: process.env.REDIS_HOST || 'localhost',
      redisPort: parseInt(process.env.REDIS_PORT || '6379'),
      redisPassword: process.env.REDIS_PASSWORD || '',
      backendUrl: process.env.BACKEND_URL || 'http://localhost:3000',
      enableQueryLog: process.env.ENABLE_QUERY_LOG === 'true',
      enableSlowQueryLog: process.env.ENABLE_SLOW_QUERY_LOG === 'true',
      slowQueryThresholdMs: parseInt(
        process.env.SLOW_QUERY_THRESHOLD_MS || '500',
      ),
    },
    database: {
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_NAME || 'postgres',
    },
    jwt: {
      expiresIn: process.env.JWT_EXPIRES_IN || '1h',
      refreshIn: process.env.JWT_REFRESH_IN || '1d',
    },
    mail: {
      provider: process.env.MAIL_PROVIDER || 'maildev',
      mailFrom: process.env.MAIL_FROM || 'mail@example.com',
      maildev: {
        host: process.env.MAILDEV_HOST || 'localhost',
        port: parseInt(process.env.MAILDEV_PORT || '1025'),
        username: process.env.MAILDEV_USERNAME || 'maildev',
        password: process.env.MAILDEV_PASSWORD || 'maildev',
      },
      gmail: {
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: Boolean(process.env.SMTP_SECURE) || false,
        username: process.env.SMTP_USERNAME || 'your-email@gmail.com',
        password: process.env.SMTP_PASSWORD || 'your-password',
      },
      frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
    },
    storage: {
      driver:
        (toUpper(process.env.STORAGE_DRIVER) as STORAGE_DRIVER) ||
        STORAGE_DRIVER.CLOUDINARY,
      deleteMode:
        (toUpper(process.env.STORAGE_DELETE_MODE) as STORAGE_DELETE_MODE) ||
        STORAGE_DELETE_MODE.SOFT,
      cloudinary: {
        cloudName: process.env.STORAGE_CLOUDINARY_CLOUD_NAME || '',
        apiKey: process.env.STORAGE_CLOUDINARY_API_KEY || '',
        apiSecret: process.env.STORAGE_CLOUDINARY_API_SECRET || '',
      },
    },
  };
};

export default configs;

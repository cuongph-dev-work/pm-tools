import { LoadStrategy, defineConfig } from '@mikro-orm/core';
import { Migrator } from '@mikro-orm/migrations';
import { Options, PostgreSqlDriver } from '@mikro-orm/postgresql';
import { config as configDotEnv } from 'dotenv';

// Load environment variables from .env file
configDotEnv();

export const baseConfig: Options = {
  driver: PostgreSqlDriver,
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  dbName: process.env.DB_NAME || 'postgres',
  entities: ['dist/**/*.entity.js'],
  entitiesTs: ['src/**/*.entity.ts'],
  migrations: {
    path: 'dist/database/migrations',
    pathTs: 'src/database/migrations',
    glob: '!(*.d).{js,ts}',
  },
  seeder: {
    path: 'dist/database/seeds',
    pathTs: 'src/database/seeds',
    glob: '!(*.d).{js,ts}',
    defaultSeeder: 'DatabaseSeeder',
    emit: 'ts',
  },
  driverOptions: {
    connection: {
      max: 20,
      idleTimeoutMillis: 30000,
    },
  },
  // Level 2 Cache Configuration - Using built-in cache
  resultCache: {
    expiration: parseInt(process.env.CACHE_TTL || '1800'), // 30 minutes default
    global: process.env.CACHE_ENABLED === 'true' && process.env.NODE_ENV === 'production', // Only in production
  },
  // Cache metadata for better performance (safe to enable)
  metadataCache: {
    enabled: process.env.METADATA_CACHE_ENABLED !== 'false',
  },
  loadStrategy: LoadStrategy.SELECT_IN,
  populateAfterFlush: false,
};

/**
 * MikroORM Config file - used for CLI operations like migrations
 * This configuration mirrors the service configuration used in the NestJS application
 */
export default defineConfig({
  ...baseConfig,
  extensions: [Migrator],
});

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  MikroOrmModuleSyncOptions,
  MikroOrmOptionsFactory,
} from '@mikro-orm/nestjs';
import { LoadStrategy } from '@mikro-orm/core';
import { baseConfig } from '@configs/mikro-orm.config';
/**
 * Service responsible for configuring the MikroORM module
 * Provides centralized configuration for database connections and ORM settings
 */
@Injectable()
export class MikroOrmConfigService implements MikroOrmOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  /**
   * Creates the MikroORM options configuration
   * @returns MikroORM configuration options
   */
  createMikroOrmOptions(): MikroOrmModuleSyncOptions {
    // Override with NestJS config service values
    return {
      ...baseConfig,
      loadStrategy: LoadStrategy.JOINED,
      allowGlobalContext: true,
      validateRequired: true,
      strict: true,
      pool: {
        min: 2,
        max: 10,
      },

      autoLoadEntities: false,
    };
  }
}

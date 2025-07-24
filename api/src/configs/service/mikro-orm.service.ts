import { baseConfig } from '@configs/mikro-orm.config';
import { Highlighter, LoadStrategy, LoggerNamespace } from '@mikro-orm/core';
import {
  MikroOrmModuleSyncOptions,
  MikroOrmOptionsFactory,
} from '@mikro-orm/nestjs';
import { SqlHighlighter } from '@mikro-orm/sql-highlighter';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  MikroLogger,
  MikroLoggerOptions,
} from '@shared/modules/logger/mikro.logger';
import { AsyncLocalStorage } from 'async_hooks';
/**
 * Service responsible for configuring the MikroORM module
 * Provides centralized configuration for database connections and ORM settings
 */
@Injectable()
export class MikroOrmConfigService implements MikroOrmOptionsFactory {
  private readonly logger = new Logger(MikroOrmConfigService.name);
  private als: AsyncLocalStorage<Request>;

  constructor(
    private readonly configService: ConfigService,
    private readonly _als: AsyncLocalStorage<Request>,
  ) {
    this.als = _als;
  }

  get isDevelopment(): boolean {
    return process.env.NODE_ENV === 'development';
  }

  getHighlighter(): Highlighter | undefined {
    if (this.isDevelopment) {
      return new SqlHighlighter();
    }
    return undefined;
  }

  /**
   * Creates the MikroORM options configuration
   * @returns MikroORM configuration options
   */
  createMikroOrmOptions(): MikroOrmModuleSyncOptions {
    // Override with NestJS config service values
    const enableQueryLog = this.configService.get<boolean | LoggerNamespace[]>(
      'app.enableQueryLog',
      false,
    );
    const enableSlowQueryLog = this.configService.get<boolean>(
      'app.enableSlowQueryLog',
      false,
    );
    const thresholdMs = this.configService.get<number>(
      'app.slowQueryThresholdMs',
      500,
    );
    const loggerOptions: MikroLoggerOptions = {
      enableSlowQueryLog,
      thresholdMs,
    };

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
      ignoreDeprecations: true,
      colors: true,
      debug: enableQueryLog,
      autoLoadEntities: false,
      highlighter: this.getHighlighter(),
      loggerFactory: (options) =>
        new MikroLogger(options, loggerOptions, this.als),
      logger: (message) => {
        this.logger.log(message);
      },
    };
  }
}

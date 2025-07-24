import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BullRootModuleOptions, SharedBullConfigurationFactory } from '@nestjs/bullmq';

/**
 * Service responsible for configuring the BullMQ module
 * Provides centralized configuration for queue connections
 */
@Injectable()
export class BullConfigService implements SharedBullConfigurationFactory {
  constructor(private readonly configService: ConfigService) {}

  /**
   * Creates the BullMQ options configuration
   * @returns BullMQ root module configuration options
   */
  createSharedConfiguration(): BullRootModuleOptions {
    return {
      connection: {
        host: this.configService.get<string>('app.redisHost'),
        port: this.configService.get<number>('app.redisPort'),
        password: this.configService.get<string>('app.redisPassword'),
      },
      // Default job options that will be applied to all queues
      defaultJobOptions: {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 1000,
        },
        removeOnComplete: true,
        removeOnFail: false,
      },
    };
  }
}

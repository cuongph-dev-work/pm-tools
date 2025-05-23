import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { cleanupTempFiles } from '@utils/file';

@Injectable()
export class CleanupTask {
  private readonly logger = new Logger(CleanupTask.name);
  // Run every hour
  @Cron(CronExpression.EVERY_HOUR)
  async handleTempFileCleanup() {
    this.logger.log('Starting temporary file cleanup...');
    // Clean up files older than 1 hour
    await cleanupTempFiles(3600000);
  }
}

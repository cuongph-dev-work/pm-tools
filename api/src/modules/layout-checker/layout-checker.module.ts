import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { PlaywrightModule } from '@shared/modules/playwright/playwright.module';
import { LayoutCheckerController } from './layout-checker.controller';
import { LayoutCheckerService } from './layout-checker.service';

@Module({
  imports: [PlaywrightModule, HttpModule],
  controllers: [LayoutCheckerController],
  providers: [LayoutCheckerService],
})
export class LayoutCheckerModule {}

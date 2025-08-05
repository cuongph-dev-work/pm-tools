import { LayoutChecker } from '@entities/layout-checker.entity';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { ProjectModule } from '@modules/project/project.module';
import { ProjectService } from '@modules/project/project.service';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { PlaywrightModule } from '@shared/modules/playwright/playwright.module';
import { LayoutCheckerController } from './layout-checker.controller';
import { LayoutCheckerRepository } from './layout-checker.repository';
import { LayoutCheckerService } from './layout-checker.service';

@Module({
  imports: [PlaywrightModule, HttpModule, ProjectModule, MikroOrmModule.forFeature([LayoutChecker])],
  controllers: [LayoutCheckerController],
  providers: [LayoutCheckerService, LayoutCheckerRepository, ProjectService],
})
export class LayoutCheckerModule {}

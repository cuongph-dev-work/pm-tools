import { GitAlert } from '@entities/git-alert.entity';
import { GitRepository } from '@entities/git-repository.entity';
import { Project } from '@entities/project.entity';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { ProjectRepository } from '@modules/project/project.repository';
import { Module } from '@nestjs/common';
import { GitAlertController } from './git-alert.controller';
import { GitAlertRepository } from './git-alert.repository';
import { GitAlertService } from './git-alert.service';

@Module({
  imports: [MikroOrmModule.forFeature([GitAlert, GitRepository, Project])],
  controllers: [GitAlertController],
  providers: [GitAlertService, GitAlertRepository, ProjectRepository, GitRepository],
  exports: [GitAlertService, GitAlertRepository],
})
export class GitAlertModule {}

import { GitAlertRecipient } from '@entities/git-alert-recipient.entity';
import { GitAlert } from '@entities/git-alert.entity';
import { GitRepository } from '@entities/git-repository.entity';
import { Project } from '@entities/project.entity';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { ProjectRepository } from '@modules/project/project.repository';
import { Module } from '@nestjs/common';
import { GitAlertRecipientRepository } from './git-alert-recipient.repository';
import { GitAlertController } from './git-alert.controller';
import { GitAlertRepository } from './git-alert.repository';
import { GitAlertService } from './git-alert.service';

@Module({
  imports: [MikroOrmModule.forFeature([GitAlert, GitRepository, GitAlertRecipient, Project])],
  controllers: [GitAlertController],
  providers: [GitAlertService, GitAlertRepository, ProjectRepository, GitRepository, GitAlertRecipientRepository],
  exports: [GitAlertService, GitAlertRepository],
})
export class GitAlertModule {}

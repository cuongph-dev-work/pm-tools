import { GitRepository } from '@entities/git-repository.entity';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { GitAlertModule } from '@modules/git-alert/git-alert.module';
import { ProjectModule } from '@modules/project/project.module';
import { Module } from '@nestjs/common';
import { GitRepoRepository } from './git.repository';
import { GitService } from './git.service';

@Module({
  imports: [ProjectModule, MikroOrmModule.forFeature([GitRepository]), GitAlertModule],
  controllers: [],
  providers: [GitService, GitRepoRepository],
  exports: [GitService],
})
export class GitModule {}

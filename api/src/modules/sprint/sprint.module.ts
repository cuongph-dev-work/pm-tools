import { Project } from '@entities/project.entity';
import { Sprint } from '@entities/sprint.entity';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { ProjectRepository } from '@modules/project/project.repository';
import { Module } from '@nestjs/common';
import { SprintController } from './sprint.controller';
import { SprintRepository } from './sprint.repository';
import { SprintService } from './sprint.service';

@Module({
  imports: [MikroOrmModule.forFeature([Sprint, Project])],
  controllers: [SprintController],
  providers: [SprintService, SprintRepository, ProjectRepository],
  exports: [SprintService],
})
export class SprintModule {}

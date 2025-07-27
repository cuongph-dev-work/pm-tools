import { Project } from '@entities/project.entity';
import { Sprint } from '@entities/sprint.entity';
import { Task } from '@entities/task.entity';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { ProjectRepository } from '@modules/project/project.repository';
import { SprintRepository } from '@modules/sprint/sprint.repository';
import { Module } from '@nestjs/common';
import { TaskController } from './task.controller';
import { TaskRepository } from './task.repository';
import { TaskService } from './task.service';

@Module({
  imports: [MikroOrmModule.forFeature([Task, Project, Sprint])],
  controllers: [TaskController],
  providers: [TaskService, TaskRepository, ProjectRepository, SprintRepository],
  exports: [TaskService],
})
export class TaskModule {}

import { Task } from '@entities/task.entity';
import { User } from '@entities/user.entity';
import { ProjectRepository } from '@modules/project/project.repository';
import { Inject, Injectable, Logger, NotFoundException, forwardRef } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { I18nService } from 'nestjs-i18n';
import { WrapperType } from 'src/types/request.type';
import { CreateTaskDto, SearchTaskInSprintDto, TaskResponseDto, UpdateTaskDto } from './dtos';
import { TaskRepository } from './task.repository';

@Injectable()
export class TaskService {
  private readonly logger = new Logger(TaskService.name);

  constructor(
    @Inject(forwardRef(() => TaskRepository))
    private readonly taskRepository: WrapperType<TaskRepository>,
    @Inject(forwardRef(() => ProjectRepository))
    private readonly projectRepository: WrapperType<ProjectRepository>,
    private readonly i18n: I18nService,
  ) {}

  private async findProjectById(projectId: string) {
    const project = await this.projectRepository.findProjectById(projectId);
    if (!project) {
      throw new NotFoundException(this.i18n.t('message.project_not_found'));
    }
    return project;
  }

  private async findTask(id: string): Promise<Task | null> {
    const task = await this.taskRepository.findOne({ id });
    if (!task) {
      throw new NotFoundException(this.i18n.t('message.task_not_found'));
    }
    return task;
  }

  async createTask(projectId: string, createTaskDto: CreateTaskDto, currentUser: User) {
    const project = await this.findProjectById(projectId);
    const task = await this.taskRepository.createTask(createTaskDto, project, currentUser);
    return { id: task?.id };
  }

  async updateTask(
    projectId: string,
    taskId: string,
    updateTaskDto: UpdateTaskDto,
    currentUser: User,
  ) {
    await this.findProjectById(projectId);
    const task = await this.taskRepository.updateTask(taskId, updateTaskDto, currentUser);
    if (!task) {
      throw new NotFoundException(this.i18n.t('message.task_not_found'));
    }
    return { id: task.id };
  }

  async findTaskById(projectId: string, id: string) {
    await this.findProjectById(projectId);
    const task = await this.taskRepository.findWithRelations(id);
    if (!task) {
      throw new NotFoundException(this.i18n.t('message.task_not_found'));
    }

    const sprints = task.sprints.getItems();
    const tags = task.tags.getItems();
    const sub_tasks = task.sub_tasks.getItems();

    return plainToInstance(TaskResponseDto, {
      ...task,
      sprints,
      tags,
      sub_tasks,
    });
  }

  async deleteTask(projectId: string, id: string) {
    await this.findProjectById(projectId);
    const task = await this.taskRepository.deleteTask(id);
    if (!task) {
      throw new NotFoundException(this.i18n.t('message.task_not_found'));
    }
    return { id };
  }

  async addTaskToSprint(projectId: string, taskId: string, sprintId: string, currentUser: User) {
    await this.findProjectById(projectId);
    await this.findTask(taskId);

    const task = await this.taskRepository.updateSprint(
      { task_id: taskId, sprint_id: sprintId, clear_sprints: false },
      currentUser,
    );
    return { id: task?.id };
  }

  async moveTaskToBacklog(projectId: string, id: string, currentUser: User) {
    await this.findProjectById(projectId);
    await this.findTask(id);

    const task = await this.taskRepository.updateSprint(
      { task_id: id, clear_sprints: true },
      currentUser,
    );
    return { id: task?.id };
  }

  async getTaskFromSprint(
    projectId: string,
    sprintId: string,
    searchDto: SearchTaskInSprintDto,
  ): Promise<{ data: TaskResponseDto[] }> {
    await this.findProjectById(projectId);
    const tasks = await this.taskRepository.findTasksBySprint(sprintId, searchDto);
    return {
      data: tasks.map(task => {
        const sprints = task.sprints.getItems();
        const tags = task.tags.getItems();
        const sub_tasks = task.sub_tasks.getItems();
        return plainToInstance(TaskResponseDto, {
          ...task,
          sprints,
          tags,
          sub_tasks,
        });
      }),
    };
  }

  async getTaskFromBacklog(
    projectId: string,
    searchDto: SearchTaskInSprintDto,
  ): Promise<{ data: TaskResponseDto[] }> {
    await this.findProjectById(projectId);
    const tasks = await this.taskRepository.findTasksBySprint(undefined, searchDto);
    return {
      data: tasks.map(task => {
        const sprints = task.sprints.getItems();
        const tags = task.tags.getItems();
        const sub_tasks = task.sub_tasks.getItems();
        return plainToInstance(TaskResponseDto, {
          ...task,
          sprints,
          tags,
          sub_tasks,
        });
      }),
    };
  }
}

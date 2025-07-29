import { User } from '@entities/user.entity';
import { ProjectRepository } from '@modules/project/project.repository';
import { Inject, Injectable, Logger, NotFoundException, forwardRef } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { I18nService } from 'nestjs-i18n';
import { WrapperType } from 'src/types/request.type';
import { CreateTaskDto, TaskResponseDto, UpdateTaskDto } from './dtos';
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

  // async createTask(createTaskDto: CreateTaskDto, currentUser: User): Promise<TaskResponseDto> {
  //   const {
  //     title,
  //     description,
  //     type,
  //     status,
  //     priority,
  //     estimate,
  //     due_date,
  //     assignee_id,
  //     sprint_ids,
  //     project_id,
  //     tag_ids,
  //     parent_task_id,
  //   } = createTaskDto;

  //   // Validate project exists
  //   const project = await this.em.findOne(Project, { id: project_id });
  //   if (!project) {
  //     throw new NotFoundException('Project not found');
  //   }

  //   // Validate assignee exists if provided
  //   let assignee: User | undefined;
  //   if (assignee_id) {
  //     assignee = await this.em.findOne(User, { id: assignee_id });
  //     if (!assignee) {
  //       throw new NotFoundException('Assignee not found');
  //     }
  //   }

  //   // Validate parent task exists if provided
  //   let parentTask: Task | undefined;
  //   if (parent_task_id) {
  //     parentTask = await this.em.findOne(Task, { id: parent_task_id });
  //     if (!parentTask) {
  //       throw new NotFoundException('Parent task not found');
  //     }
  //   }

  //   // Validate sprints exist if provided
  //   let sprints: Sprint[] = [];
  //   if (sprint_ids && sprint_ids.length > 0) {
  //     sprints = await this.em.find(Sprint, { id: { $in: sprint_ids } });
  //     if (sprints.length !== sprint_ids.length) {
  //       throw new NotFoundException('One or more sprints not found');
  //     }
  //   }

  //   // Validate tags exist if provided
  //   let tags: Tag[] = [];
  //   if (tag_ids && tag_ids.length > 0) {
  //     tags = await this.em.find(Tag, { id: { $in: tag_ids } });
  //     if (tags.length !== tag_ids.length) {
  //       throw new NotFoundException('One or more tags not found');
  //     }
  //   }

  //   const task = new Task();
  //   task.title = title;
  //   task.description = description;
  //   task.type = type;
  //   task.status = status || 'TODO';
  //   task.priority = priority || 'MEDIUM';
  //   task.estimate = estimate;
  //   task.due_date = due_date ? new Date(due_date) : undefined;
  //   task.assignee = assignee;
  //   task.project = project;
  //   task.parent_task = parentTask;
  //   task.created_by = currentUser;
  //   task.updated_by = currentUser;

  //   // Add sprints
  //   if (sprints.length > 0) {
  //     task.sprints.set(sprints);
  //   }

  //   // Add tags
  //   if (tags.length > 0) {
  //     task.tags.set(tags);
  //   }

  //   await this.em.persistAndFlush(task);

  //   const taskWithRelations = await this.taskRepository.findWithRelations(task.id);
  //   return plainToInstance(TaskResponseDto, taskWithRelations);
  // }

  // async findAllTasks(searchDto: SearchTaskDto): Promise<{ data: TaskResponseDto[]; total: number; page: number; limit: number; total_pages: number }> {
  //   const [tasks, total] = await this.taskRepository.searchTasks(searchDto);
  //   const { page = 1, limit = 10 } = searchDto;

  //   return {
  //     data: tasks.map(task => plainToInstance(TaskResponseDto, task)),
  //     total,
  //     page,
  //     limit,
  //     total_pages: Math.ceil(total / limit),
  //   };
  // }

  // async findTaskById(id: string): Promise<TaskResponseDto> {
  //   const task = await this.taskRepository.findWithRelations(id);
  //   if (!task) {
  //     throw new NotFoundException('Task not found');
  //   }

  //   return plainToInstance(TaskResponseDto, task);
  // }

  // async updateTask(id: string, updateTaskDto: UpdateTaskDto, currentUser: User): Promise<TaskResponseDto> {
  //   const task = await this.taskRepository.findOne({ id });
  //   if (!task) {
  //     throw new NotFoundException('Task not found');
  //   }

  //   const {
  //     title,
  //     description,
  //     type,
  //     status,
  //     priority,
  //     estimate,
  //     due_date,
  //     assignee_id,
  //     sprint_ids,
  //     tag_ids,
  //     parent_task_id,
  //   } = updateTaskDto;

  //   // Update basic fields
  //   if (title !== undefined) task.title = title;
  //   if (description !== undefined) task.description = description;
  //   if (type !== undefined) task.type = type;
  //   if (status !== undefined) task.status = status;
  //   if (priority !== undefined) task.priority = priority;
  //   if (estimate !== undefined) task.estimate = estimate;
  //   if (due_date !== undefined) task.due_date = new Date(due_date);
  //   if (parent_task_id !== undefined) {
  //     if (parent_task_id === null) {
  //       task.parent_task = undefined;
  //     } else {
  //       const parentTask = await this.em.findOne(Task, { id: parent_task_id });
  //       if (!parentTask) {
  //         throw new NotFoundException('Parent task not found');
  //       }
  //       task.parent_task = parentTask;
  //     }
  //   }

  //   // Update assignee
  //   if (assignee_id !== undefined) {
  //     if (assignee_id === null) {
  //       task.assignee = undefined;
  //     } else {
  //       const assignee = await this.em.findOne(User, { id: assignee_id });
  //       if (!assignee) {
  //         throw new NotFoundException('Assignee not found');
  //       }
  //       task.assignee = assignee;
  //     }
  //   }

  //   // Update sprints
  //   if (sprint_ids !== undefined) {
  //     if (sprint_ids.length === 0) {
  //       task.sprints.removeAll();
  //     } else {
  //       const sprints = await this.em.find(Sprint, { id: { $in: sprint_ids } });
  //       if (sprints.length !== sprint_ids.length) {
  //         throw new NotFoundException('One or more sprints not found');
  //       }
  //       task.sprints.set(sprints);
  //     }
  //   }

  //   // Update tags
  //   if (tag_ids !== undefined) {
  //     if (tag_ids.length === 0) {
  //       task.tags.removeAll();
  //     } else {
  //       const tags = await this.em.find(Tag, { id: { $in: tag_ids } });
  //       if (tags.length !== tag_ids.length) {
  //         throw new NotFoundException('One or more tags not found');
  //       }
  //       task.tags.set(tags);
  //     }
  //   }

  //   task.updated_by = currentUser;
  //   await this.em.persistAndFlush(task);

  //   const updatedTask = await this.taskRepository.findWithRelations(id);
  //   return plainToInstance(TaskResponseDto, updatedTask);
  // }

  // async deleteTask(id: string): Promise<void> {
  //   const task = await this.taskRepository.findOne({ id });
  //   if (!task) {
  //     throw new NotFoundException('Task not found');
  //   }

  //   // Check if task has sub-tasks
  //   const subTasks = await this.taskRepository.find({ parent_task: id });
  //   if (subTasks.length > 0) {
  //     throw new BadRequestException('Cannot delete task with sub-tasks. Please delete sub-tasks first.');
  //   }

  //   await this.em.removeAndFlush(task);
  // }

  // async findTasksByProject(projectId: string): Promise<TaskResponseDto[]> {
  //   const tasks = await this.taskRepository.findTasksByProject(projectId);
  //   return tasks.map(task => plainToInstance(TaskResponseDto, task));
  // }

  // async findTasksBySprint(sprintId: string): Promise<TaskResponseDto[]> {
  //   const tasks = await this.taskRepository.findTasksBySprint(sprintId);
  //   return tasks.map(task => plainToInstance(TaskResponseDto, task));
  // }

  // async findTasksByAssignee(assigneeId: string): Promise<TaskResponseDto[]> {
  //   const tasks = await this.taskRepository.findTasksByAssignee(assigneeId);
  //   return tasks.map(task => plainToInstance(TaskResponseDto, task));
  // }
}

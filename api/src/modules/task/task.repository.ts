import { Task } from '@entities/task.entity';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { Injectable, Logger } from '@nestjs/common';
import { SearchTaskDto } from './dtos';

@Injectable()
export class TaskRepository extends EntityRepository<Task> {
  private readonly logger = new Logger(TaskRepository.name);

  constructor(em: EntityManager) {
    super(em, Task);
  }

  async findWithRelations(id: string): Promise<Task | null> {
    return this.findOne(
      { id },
      {
        populate: [
          'assignee',
          'sprints',
          'tags',
          'parent_task',
          'sub_tasks',
          'created_by',
          'updated_by',
          'project',
        ],
      },
    );
  }

  async searchTasks(searchDto: SearchTaskDto): Promise<[Task[], number]> {
    const {
      search,
      type,
      status,
      priority,
      assignee_id,
      sprint_id,
      project_id,
      tag_id,
      parent_task_id,
      page,
      limit,
    } = searchDto;

    const where: any = {};

    if (search) {
      where.$or = [
        { title: { $ilike: `%${search}%` } },
        { description: { $ilike: `%${search}%` } },
      ];
    }

    if (type) where.type = type;
    if (status) where.status = status;
    if (priority) where.priority = priority;
    if (assignee_id) where.assignee = assignee_id;
    if (project_id) where.project = project_id;
    if (parent_task_id) where.parent_task = parent_task_id;

    const options: any = {
      populate: ['assignee', 'sprints', 'tags', 'project'],
      orderBy: { created_at: 'DESC' },
      limit: limit || 10,
      offset: ((page || 1) - 1) * (limit || 10),
    };

    if (sprint_id) {
      options.populate.push('sprints');
      where.sprints = sprint_id;
    }

    if (tag_id) {
      options.populate.push('tags');
      where.tags = tag_id;
    }

    return this.findAndCount(where, options);
  }

  async findTasksByProject(projectId: string): Promise<Task[]> {
    return this.find(
      { project: projectId },
      {
        populate: ['assignee', 'sprints', 'tags'],
        orderBy: { created_at: 'DESC' },
      },
    );
  }

  async findTasksBySprint(sprintId: string): Promise<Task[]> {
    return this.find(
      { sprints: sprintId },
      {
        populate: ['assignee', 'tags'],
        orderBy: { created_at: 'DESC' },
      },
    );
  }

  async findTasksByAssignee(assigneeId: string): Promise<Task[]> {
    return this.find(
      { assignee: assigneeId },
      {
        populate: ['sprints', 'tags', 'project'],
        orderBy: { created_at: 'DESC' },
      },
    );
  }
}

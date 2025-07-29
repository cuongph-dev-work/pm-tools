import { TASK_TYPE } from '@configs/enum/db';
import { Project } from '@entities/project.entity';
import { Sprint } from '@entities/sprint.entity';
import { Tag } from '@entities/tag.entity';
import { Task } from '@entities/task.entity';
import { User } from '@entities/user.entity';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { Injectable, Logger } from '@nestjs/common';
import { CreateTaskDto, SearchTaskDto, UpdateTaskDto } from './dtos';

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

  async createTask(data: CreateTaskDto, project: Project, currentUser: User): Promise<Task | null> {
    return this.em.transactional(async em => {
      const parentTask = await em.findOne(Task, { id: data?.parent_task_id });
      const assignee = await em.findOne(User, { id: data?.assignee_id });
      const sprints = await em.find(Sprint, { id: { $in: data?.sprint_ids || [] } });

      let type = data.type;
      if (data.parent_task_id) {
        type = TASK_TYPE.SUB_TASK;
      }

      const taskEntity = em.create(Task, {
        title: data.title,
        description: data.description,
        type: type,
        project: project,
        status: data.status,
        priority: data.priority,
        estimate: data.estimate,
        due_date: data.due_date,
        assignee: assignee,
        parent_task: parentTask,
        sprints: sprints,
        created_by: currentUser,
        updated_by: currentUser,
      });

      const taskTags: Tag[] = [];
      const taskSprints: Sprint[] = [];

      for (const tag of data.tags) {
        let tagEntity: Tag;

        if (tag.id) {
          const existingTag = await em.findOne(Tag, { id: tag.id });
          if (existingTag) {
            tagEntity = existingTag;
          } else {
            tagEntity = em.create(Tag, {
              name: tag.name,
            });
            await em.persistAndFlush(tagEntity);
          }
        } else {
          tagEntity = em.create(Tag, {
            name: tag.name,
          });
          await em.persistAndFlush(tagEntity);
        }

        taskTags.push(tagEntity);
      }

      if (data.sprint_ids) {
        const sprints = await em.find(Sprint, { id: { $in: data.sprint_ids } });
        taskSprints.push(...sprints);
      }

      // attach tags to task
      taskEntity.tags.set(taskTags);

      // attach sprints to task
      taskEntity.sprints.set(taskSprints);

      await em.persistAndFlush(taskEntity);

      return taskEntity;
    });
  }

  async updateTask(id: string, data: UpdateTaskDto, currentUser: User): Promise<Task | null> {
    return this.em.transactional(async em => {
      const task = await em.findOne(Task, { id });
      if (!task) {
        return null;
      }

      // Update basic fields
      if (data.title !== undefined) task.title = data.title;
      if (data.description !== undefined) task.description = data.description;
      if (data.status !== undefined) task.status = data.status;
      if (data.priority !== undefined) task.priority = data.priority;
      if (data.estimate !== undefined) task.estimate = data.estimate;
      if (data.due_date !== undefined) task.due_date = new Date(data.due_date);

      // Update type with logic for sub-tasks
      if (data.type !== undefined) {
        let type = data.type;
        if (data.parent_task_id) {
          type = TASK_TYPE.SUB_TASK;
        }
        task.type = type;
      }

      // Update assignee
      if (data.assignee_id !== undefined) {
        if (data.assignee_id === null) {
          task.assignee = undefined;
        } else {
          const assignee = await em.findOne(User, { id: data.assignee_id });
          if (assignee) {
            task.assignee = assignee;
          }
        }
      }

      // Update parent task
      if (data.parent_task_id !== undefined) {
        if (data.parent_task_id === null) {
          task.parent_task = undefined;
        } else {
          const parentTask = await em.findOne(Task, { id: data.parent_task_id });
          if (parentTask) {
            task.parent_task = parentTask;
            // Auto set type to SUB_TASK if parent task is assigned
            task.type = TASK_TYPE.SUB_TASK;
          }
        }
      }

      // Update sprints
      if (data.clear_sprints) {
        // Clear all sprints
        task.sprints.removeAll();
      } else if (data.remove_sprint_ids && data.remove_sprint_ids.length > 0) {
        // Remove specific sprints
        const sprintsToRemove = await em.find(Sprint, { id: { $in: data.remove_sprint_ids } });
        for (const sprint of sprintsToRemove) {
          task.sprints.remove(sprint);
        }
      } else if (data.sprint_ids !== undefined) {
        // Replace sprints with new ones
        const sprints = await em.find(Sprint, { id: { $in: data.sprint_ids } });
        task.sprints.set(sprints);
      }

      // Update tags
      if (data.clear_tags) {
        // Clear all tags
        task.tags.removeAll();
      } else if (data.remove_tag_ids && data.remove_tag_ids.length > 0) {
        // Remove specific tags
        const tagsToRemove = await em.find(Tag, { id: { $in: data.remove_tag_ids } });
        for (const tag of tagsToRemove) {
          task.tags.remove(tag);
        }
      } else if (data.tags !== undefined) {
        // Process tags (create new or use existing)
        const taskTags: Tag[] = [];

        for (const tag of data.tags) {
          let tagEntity: Tag;

          if (tag.id) {
            // Use existing tag
            const existingTag = await em.findOne(Tag, { id: tag.id });
            if (existingTag) {
              tagEntity = existingTag;
            } else {
              // Create new tag if not found
              tagEntity = em.create(Tag, {
                name: tag.name,
              });
              await em.persistAndFlush(tagEntity);
            }
          } else {
            // Create new tag
            tagEntity = em.create(Tag, {
              name: tag.name,
            });
            await em.persistAndFlush(tagEntity);
          }

          taskTags.push(tagEntity);
        }

        // Replace all tags with new ones
        task.tags.set(taskTags);
      }

      // Update audit fields
      task.updated_by = currentUser;

      await em.persistAndFlush(task);
      return task;
    });
  }

  async deleteTask(id: string): Promise<Task | null> {
    return this.em.transactional(async em => {
      const task = await em.findOne(Task, { id });
      if (!task) {
        return null;
      }

      // Find and delete all sub-tasks first
      const subTasks = await em.find(Task, { parent_task: id });
      for (const subTask of subTasks) {
        subTask.deleted_at = new Date();
        await em.persistAndFlush(subTask);
      }

      // Soft delete the main task
      task.deleted_at = new Date();
      await em.persistAndFlush(task);

      return task;
    });
  }
}

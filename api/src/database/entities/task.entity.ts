import { TASK_PRIORITY, TASK_STATUS, TASK_TYPE } from '@configs/enum/db';
import { Collection, Entity, Enum, ManyToMany, ManyToOne, Opt, Property } from '@mikro-orm/core';
import { AuditableEntity } from './auditable.abstract';
import { Project } from './project.entity';
import { Sprint } from './sprint.entity';
import { Tag } from './tag.entity';
import { User } from './user.entity';

/**
 * Task entity for project management
 */
@Entity({ tableName: 'task' })
export class Task extends AuditableEntity {
  /**
   * Task title
   */
  @Property({ length: 255 })
  title!: string;

  /**
   * Task description
   */
  @Property({ nullable: true, length: 3000, type: 'text' })
  description?: Opt<string>;

  /**
   * Task type
   */
  @Enum({ items: () => TASK_TYPE })
  type!: TASK_TYPE;

  /**
   * Task status
   */
  @Enum({ items: () => TASK_STATUS, default: TASK_STATUS.OPEN })
  status: Opt<TASK_STATUS> = TASK_STATUS.OPEN;

  /**
   * Task priority
   */
  @Enum({ items: () => TASK_PRIORITY, default: TASK_PRIORITY.MEDIUM })
  priority: Opt<TASK_PRIORITY> = TASK_PRIORITY.MEDIUM;

  /**
   * Estimated hours
   */
  @Property({ nullable: true, type: 'float' })
  estimate?: Opt<number>;

  /**
   * Due date
   */
  @Property({ nullable: true, columnType: 'timestamp with time zone' })
  due_date?: Opt<Date>;

  /**
   * Assignee (user assigned to the task)
   */
  @ManyToOne(() => User, { nullable: true })
  assignee?: Opt<User>;

  /**
   * Sprints (many-to-many)
   */
  @ManyToMany(() => Sprint, sprint => sprint.tasks, { owner: true })
  sprints = new Collection<Sprint>(this);

  /**
   * Project reference
   */
  @ManyToOne(() => Project, { nullable: false })
  project!: Project;

  /**
   * Tags (many-to-many)
   */
  @ManyToMany(() => Tag, tag => tag.tasks, { owner: true })
  tags = new Collection<Tag>(this);

  /**
   * Parent task (for sub-task structure)
   */
  @ManyToOne(() => Task, { nullable: true })
  parent_task?: Opt<Task>;

  /**
   * Sub-tasks (self-referencing)
   */
  @ManyToMany(() => Task)
  sub_tasks = new Collection<Task>(this);
}

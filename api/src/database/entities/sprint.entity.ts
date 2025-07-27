import { SPRINT_STATUS } from '@configs/enum/db';
import { Collection, Entity, Enum, ManyToMany, ManyToOne, Opt, Property } from '@mikro-orm/core';
import { BaseEntity } from './base.abstract';
import { Project } from './project.entity';
import { Task } from './task.entity';

/**
 * Sprint entity for grouping tasks
 */
@Entity({ tableName: 'sprint' })
export class Sprint extends BaseEntity {
  /**
   * Sprint name
   */
  @Property({ length: 255 })
  name!: string;

  /**
   * Sprint description
   */
  @Property({ nullable: true, length: 1000 })
  description?: Opt<string>;

  /**
   * Sprint start date
   */
  @Property({ nullable: true, columnType: 'timestamp with time zone' })
  start_date?: Opt<Date>;

  /**
   * Sprint end date
   */
  @Property({ nullable: true, columnType: 'timestamp with time zone' })
  end_date?: Opt<Date>;

  /**
   * Sprint status
   */
  @Enum({ items: () => SPRINT_STATUS, default: SPRINT_STATUS.PLANNING })
  status: Opt<SPRINT_STATUS> = SPRINT_STATUS.PLANNING;

  /**
   * Project reference
   */
  @ManyToOne(() => Project, { nullable: false })
  project!: Project;

  /**
   * Tasks (many-to-many)
   */
  @ManyToMany(() => Task, task => task.sprints, { mappedBy: 'sprints' })
  tasks = new Collection<Task>(this);
}

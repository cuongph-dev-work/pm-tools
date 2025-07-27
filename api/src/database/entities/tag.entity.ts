import { Collection, Entity, ManyToMany, Opt, Property } from '@mikro-orm/core';
import { BaseEntity } from './base.abstract';
import { Task } from './task.entity';

/**
 * Tag entity for labeling tasks
 */
@Entity({ tableName: 'tag' })
export class Tag extends BaseEntity {
  /**
   * Tag name
   */
  @Property({ length: 100, unique: true })
  name!: string;

  /**
   * Tag description
   */
  @Property({ nullable: true, length: 255 })
  description?: Opt<string>;

  /**
   * Tasks (many-to-many)
   */
  @ManyToMany(() => Task, task => task.tags, { mappedBy: 'tags' })
  tasks = new Collection<Task>(this);
}

import { MEMBER_STATUS, PROJECT_ROLE } from '@configs/enum/db';
import { Entity, Enum, Filter, ManyToOne, Opt, Property, Unique } from '@mikro-orm/core';
import { WrapperType } from 'src/types/request.type';
import { BaseEntity } from './base.abstract';
import { Project } from './project.entity';
import { User } from './user.entity';

/**
 * Project Member entity representing the project_member table in the database
 * Stores project member information and their roles
 */
@Entity({ tableName: 'project_member' })
@Filter({ name: 'isActive', cond: { deleted_at: null, status: MEMBER_STATUS.ACTIVE } })
@Filter({ name: 'isDeleted', cond: { deleted_at: { $ne: null } } })
@Unique({ properties: ['project', 'user'] })
export class ProjectMember extends BaseEntity {
  /**
   * Project reference
   */
  @ManyToOne(() => Project, { nullable: false })
  project!: WrapperType<Project>;

  /**
   * User reference
   */
  @ManyToOne(() => User, { nullable: false })
  user!: WrapperType<User>;

  /**
   * Member role in the project
   */
  @Enum({ items: () => PROJECT_ROLE })
  role!: PROJECT_ROLE;

  /**
   * Member status in the project
   */
  @Enum({ items: () => MEMBER_STATUS, default: MEMBER_STATUS.ACTIVE })
  status: Opt<MEMBER_STATUS> = MEMBER_STATUS.ACTIVE;

  /**
   * Date when member joined the project
   */
  @Property({ columnType: 'timestamp with time zone' })
  joined_at: Opt<Date> = new Date();

  /**
   * Date when member left the project (if applicable)
   */
  @Property({ nullable: true, columnType: 'timestamp with time zone' })
  left_at?: Opt<Date>;
}

import { Entity, Enum, Filter, ManyToOne, Opt, Property, Unique } from '@mikro-orm/core';
import { BaseEntity } from './base.entity';
import { Project } from './project.entity';
import { User } from './user.entity';

export enum MEMBER_STATUS {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  LEFT = 'LEFT',
}

export enum PROJECT_ROLE {
  PROJECT_MANAGER = 'PROJECT_MANAGER', // project manager
  DEVELOPER = 'DEVELOPER', // developer
  QA = 'QUALITY_ASSURANCE', // quality assurance
  QC = 'QUALITY_CONTROL', // tester
  BRSE_COMTOR = 'BRSE_COMTOR', // Bridge Software Engineer
}

/**
 * Project Member entity representing the project_member table in the database
 * Stores project member information and their roles
 */
@Entity({ tableName: 'project_member' })
@Filter({ name: 'isActive', cond: { deleted_at: null } })
@Filter({ name: 'isDeleted', cond: { deleted_at: { $ne: null } } })
@Unique({ properties: ['project', 'user'] })
export class ProjectMember extends BaseEntity {
  /**
   * Project reference
   */
  @ManyToOne(() => Project, { nullable: false })
  project!: Project;

  /**
   * User reference
   */
  @ManyToOne(() => User, { nullable: false })
  user!: User;

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

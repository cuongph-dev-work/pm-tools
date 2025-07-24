import { Entity, Enum, Filter, ManyToOne, OneToMany, Opt, Property } from '@mikro-orm/core';
import { BaseEntity } from './base.entity';
import { ProjectInviteMember } from './project-invite-member.entity';
import { ProjectMember } from './project-member.entity';
import { User } from './user.entity';

export enum PROJECT_STATUS {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

/**
 * Project entity representing the project table in the database
 * Stores project information and relationships
 */
@Entity({ tableName: 'project' })
@Filter({ name: 'isActive', cond: { deleted_at: null } })
@Filter({ name: 'isDeleted', cond: { deleted_at: { $ne: null } } })
export class Project extends BaseEntity {
  /**
   * Project name
   */
  @Property({ length: 255 })
  name!: string;

  /**
   * Project description
   */
  @Property({ nullable: true, length: 3000, type: 'text' })
  description?: Opt<string>;

  /**
   * Project owner - reference to User entity
   */
  @ManyToOne(() => User, { nullable: false })
  owner!: User;

  /**
   * Project status
   */
  @Enum({ items: () => PROJECT_STATUS, default: PROJECT_STATUS.ACTIVE })
  status: Opt<PROJECT_STATUS> = PROJECT_STATUS.ACTIVE;

  /**
   * Project tags - comma separated list of tags
   */
  @Property({ nullable: true, length: 255 })
  tags?: Opt<string[]>;

  /**
   * Project start date
   */
  @Property({ nullable: true, columnType: 'timestamp with time zone' })
  start_date?: Opt<Date>;

  /**
   * Project end date
   */
  @Property({ nullable: true, columnType: 'timestamp with time zone' })
  end_date?: Opt<Date>;

  /**
   * Project members relationship
   */
  @OneToMany(() => ProjectMember, member => member.project)
  members?: ProjectMember[];

  /**
   * Project invite members relationship
   */
  @OneToMany(() => ProjectInviteMember, invite => invite.project)
  invites?: ProjectInviteMember[];
}

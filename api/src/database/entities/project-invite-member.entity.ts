import { Entity, Enum, Filter, ManyToOne, Opt, Property, Unique } from '@mikro-orm/core';
import { BaseEntity } from './base.entity';
import { PROJECT_ROLE } from './project-member.entity';
import { Project } from './project.entity';
import { User } from './user.entity';

export enum INVITE_STATUS {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  EXPIRED = 'EXPIRED',
}

/**
 * Project Invite Member entity representing the project_invite_member table in the database
 * Stores project invitation information
 */
@Entity({ tableName: 'project_invite_member' })
@Filter({ name: 'isActive', cond: { deleted_at: null } })
@Filter({ name: 'isDeleted', cond: { deleted_at: { $ne: null } } })
@Unique({ properties: ['project', 'invited_email'] })
export class ProjectInviteMember extends BaseEntity {
  /**
   * Project reference
   */
  @ManyToOne(() => Project, { nullable: false })
  project!: Project;

  /**
   * User who sent the invitation
   */
  @ManyToOne(() => User, { nullable: false })
  invited_by!: User;

  /**
   * Email address of the invited person
   */
  @Property({ length: 255 })
  invited_email!: string;

  /**
   * Role that will be assigned to the invited member
   */
  @Enum({ items: () => PROJECT_ROLE })
  role!: PROJECT_ROLE;

  /**
   * Unique token for invitation verification
   */
  @Property({ length: 255, unique: true })
  token!: string;

  /**
   * Invitation status
   */
  @Enum({ items: () => INVITE_STATUS, default: INVITE_STATUS.PENDING })
  status: Opt<INVITE_STATUS> = INVITE_STATUS.PENDING;

  /**
   * Expiration date for the invitation
   */
  @Property({ columnType: 'timestamp with time zone' })
  expired_at!: Date;

  /**
   * Date when invitation was accepted (if applicable)
   */
  @Property({ nullable: true, columnType: 'timestamp with time zone' })
  accepted_at?: Opt<Date>;

  /**
   * Date when invitation was rejected (if applicable)
   */
  @Property({ nullable: true, columnType: 'timestamp with time zone' })
  rejected_at?: Opt<Date>;

  /**
   * Additional message for the invitation
   */
  @Property({ nullable: true, length: 1000, type: 'text' })
  message?: Opt<string>;
}

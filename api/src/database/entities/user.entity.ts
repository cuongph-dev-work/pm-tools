import { USER_ROLE } from '@configs/enum/db';
import {
  BeforeCreate,
  BeforeUpdate,
  Entity,
  Enum,
  Filter,
  ManyToOne,
  OneToMany,
  Opt,
  Property,
} from '@mikro-orm/core';
import * as bcrypt from 'bcryptjs';
import { WrapperType } from 'src/types/request.type';
import { BaseEntity } from './base.abstract';
import { FileStorage } from './file-storage.entity';
import { GitAlert } from './git-alert.entity';
import { ProjectInviteMember } from './project-invite-member.entity';
import { ProjectMember } from './project-member.entity';
import { Project } from './project.entity';

const SALT_ROUND = 11;

/**
 * User entity representing the user table in the database
 * Stores user authentication and profile information
 */
@Entity({ tableName: 'user' })
@Filter({ name: 'isActive', cond: { deleted_at: null } })
@Filter({ name: 'isDeleted', cond: { deleted_at: { $ne: null } } })
@Filter({ name: 'isBlocked', cond: { block_to: { $gt: new Date() } } })
@Filter({ name: 'isNotBlocked', cond: { block_to: { $lte: new Date() } } })
export class User extends BaseEntity {
  /**
   * User's email address, must be unique
   */
  @Property({ unique: true, length: 255 })
  email!: string;

  /**
   * User's hashed password
   */
  @Property({ length: 255, lazy: true })
  password!: string;

  /**
   * Token used for password reset functionality
   */
  @Property({ nullable: true, length: 255 })
  reset_token?: Opt<string>;

  /**
   * Expiration date for the reset token
   */
  @Property({ nullable: true, columnType: 'timestamp with time zone' })
  reset_token_expired_at?: Opt<Date>;

  /**
   * ID of the user's avatar/profile image
   */
  @ManyToOne(() => FileStorage, { nullable: true })
  avatar?: Opt<FileStorage>;

  /**
   * User's first name
   */
  @Property({ nullable: true, length: 255 })
  first_name?: Opt<string>;

  /**
   * User's last name
   */
  @Property({ nullable: true, length: 255 })
  last_name?: Opt<string>;

  /**
   * User's full name
   */
  @Property({ getter: true, persist: false })
  get fullName(): Opt<string> {
    return `${this.first_name} ${this.last_name}`;
  }

  /**
   * User's phone number, limited to 13 characters
   */
  @Property({ nullable: true, length: 13 })
  phone?: Opt<string>;

  /**
   * User's biography or description about themselves
   */
  @Property({ nullable: true, length: 3000, type: 'text' })
  bio?: Opt<string>;

  /**
   * User's city information
   */
  @Property({ nullable: true, length: 255 })
  city?: Opt<string>;

  /**
   * User's address information
   */
  @Property({ nullable: true, length: 500 })
  address?: Opt<string>;

  /**
   * Date until which the user is blocked/suspended
   */
  @Property({ nullable: true, columnType: 'timestamp with time zone' })
  block_to?: Opt<Date>;

  /**
   * User's role
   */
  @Enum({ items: () => USER_ROLE })
  role!: USER_ROLE;

  /**
   * Github username
   */
  @Property({ nullable: true, length: 255 })
  github_username?: Opt<string>;

  /**
   * Gitlab username
   */
  @Property({ nullable: true, length: 255 })
  gitlab_username?: Opt<string>;

  /**
   * Projects owned by this user
   */
  @OneToMany(() => Project, project => project.owner)
  owned_projects?: WrapperType<Project>[];

  /**
   * Project memberships of this user
   */
  @OneToMany(() => ProjectMember, member => member.user)
  project_memberships?: WrapperType<ProjectMember>[];

  /**
   * Project invitations sent by this user
   */
  @OneToMany(() => ProjectInviteMember, invite => invite.invited_by)
  sent_invitations?: WrapperType<ProjectInviteMember>[];

  /**
   * Git alerts read by this user
   */
  @OneToMany(() => GitAlert, alert => alert.read_by)
  read_git_alerts?: WrapperType<GitAlert>[];

  /**
   * Git alerts triggered by this user
   */
  @OneToMany(() => GitAlert, alert => alert.triggered_by)
  triggered_git_alerts?: WrapperType<GitAlert>[];

  /**
   * Hash a password using bcrypt
   * @param password The password to hash
   * @returns The hashed password
   */
  static async hashPassword(password: string) {
    return await bcrypt.hash(password, SALT_ROUND);
  }

  /**
   * Hash the password before creating a new user
   */
  @BeforeCreate()
  async beforeCreate() {
    this.password = await User.hashPassword(this.password);
  }

  /**
   * Hash the password before updating a user
   */
  @BeforeUpdate()
  async beforeUpdate() {
    if (this.password) {
      this.password = await User.hashPassword(this.password);
    }
  }
}

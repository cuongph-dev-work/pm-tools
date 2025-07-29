import { GIT_ALERT_PRIORITY, GIT_ALERT_STATUS, GIT_ALERT_TYPE } from '@configs/enum/db';
import { Entity, Enum, ManyToOne, Opt, Property } from '@mikro-orm/core';
import { WrapperType } from 'src/types/request.type';
import { BaseEntity } from './base.abstract';
import { GitRepository } from './git-repository.entity';
import { Project } from './project.entity';
import { User } from './user.entity';

interface GitAlertMetadata {
  // commit
  branch: string;
  commit_hash: string;
  pull_request_number: number;
  issue_number: number;
  author: string;
  created_at: Date;

  // comment
  comment_message: string;
  comment_author: string;
  comment_created_at: Date;

  [key: string]: any;
}

/**
 * Git Alert entity for tracking notifications from Git repositories
 */
@Entity({ tableName: 'git_alert' })
export class GitAlert extends BaseEntity {
  /**
   * Alert title
   */
  @Property({ length: 255 })
  title!: string;

  /**
   * Alert description
   */
  @Property({ nullable: true, length: 2000, type: 'text' })
  description?: string;

  /**
   * Alert type
   */
  @Enum({ items: () => GIT_ALERT_TYPE })
  type!: GIT_ALERT_TYPE;

  /**
   * Alert status
   */
  @Enum({ items: () => GIT_ALERT_STATUS, default: GIT_ALERT_STATUS.UNREAD })
  status: GIT_ALERT_STATUS = GIT_ALERT_STATUS.UNREAD;

  /**
   * Alert priority
   */
  @Enum({ items: () => GIT_ALERT_PRIORITY, default: GIT_ALERT_PRIORITY.MEDIUM })
  priority: GIT_ALERT_PRIORITY = GIT_ALERT_PRIORITY.MEDIUM;

  /**
   * Additional metadata as JSON
   */
  @Property({ nullable: true, type: 'json' })
  metadata?: GitAlertMetadata;

  /**
   * Read timestamp (when user marked as read)
   */
  @Property({ nullable: true, columnType: 'timestamp with time zone' })
  read_at?: Date;

  /**
   * User who read the alert
   */
  @ManyToOne(() => User, { nullable: true })
  read_by?: Opt<WrapperType<User>>;

  /**
   * Associated Git repository
   */
  @ManyToOne(() => GitRepository, { nullable: false })
  repository!: WrapperType<GitRepository>;

  /**
   * Associated project
   */
  @ManyToOne(() => Project, { nullable: false })
  project!: WrapperType<Project>;

  /**
   * User who triggered the alert (if applicable)
   */
  @ManyToOne(() => User, { nullable: true })
  triggered_by?: Opt<WrapperType<User>>;

  /**
   * External URL to view the alert details
   */
  @Property({ nullable: true, length: 500 })
  external_url?: string;

  /**
   * Is the alert actionable (requires user action)
   */
  @Property({ default: false })
  is_actionable: boolean = false;

  /**
   * Action required (if actionable)
   */
  @Property({ nullable: true, length: 255 })
  action_required?: string;
}

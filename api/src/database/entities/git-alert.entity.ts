import { GIT_ALERT_PRIORITY, GIT_ALERT_TAG, GIT_ALERT_TYPE } from '@configs/enum/db';
import { Entity, Enum, ManyToOne, Property } from '@mikro-orm/core';
import { WrapperType } from 'src/types/request.type';
import { BaseEntity } from './base.abstract';
import { GitRepository } from './git-repository.entity';
import { Project } from './project.entity';

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
   * External URL to view the alert details
   */
  @Property({ nullable: true, length: 500 })
  external_url?: string;

  /**
   * Alert tags
   */
  @Property({ nullable: true, type: 'array', default: [] })
  tags?: GIT_ALERT_TAG[] = [];
}

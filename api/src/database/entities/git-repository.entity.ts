import { GIT_ALERT_TYPE, GIT_REPOSITORY_PROVIDER } from '@configs/enum/db';
import { Entity, Enum, ManyToOne, Property } from '@mikro-orm/core';
import { BaseEntity } from './base.abstract';
import { Project } from './project.entity';

/**
 * Git Repository entity for tracking connected repositories
 */
@Entity({ tableName: 'git_repository' })
export class GitRepository extends BaseEntity {
  /**
   * Repository name
   */
  @Property({ length: 255 })
  name!: string;

  /**
   * Repository URL
   */
  @Property({ length: 500 })
  url!: string;

  /**
   * Repository provider (github, gitlab, etc.)
   */
  @Enum({ items: () => GIT_REPOSITORY_PROVIDER })
  provider!: GIT_REPOSITORY_PROVIDER;

  /**
   * Alert types that can trigger alerts for this repository
   */
  @Property({ type: 'array', nullable: true })
  alert_types?: GIT_ALERT_TYPE[];

  /**
   * Cron time to sync repository
   */
  @Property({ length: 255, nullable: true, default: '0 0 * * *' }) // every day at midnight
  cron_time?: string;

  /**
   * Last sync timestamp
   */
  @Property({ nullable: true, columnType: 'timestamp with time zone' })
  last_sync_at?: Date;

  /**
   * Enable sync repository
   */
  @Property({ default: false })
  enable_sync: boolean = false;

  /**
   * Webhook secret for verification
   */
  @Property({ nullable: true, length: 255 })
  webhook_secret?: string;

  /**
   * Associated project
   */
  @ManyToOne(() => Project, { nullable: false })
  project!: Project;
}

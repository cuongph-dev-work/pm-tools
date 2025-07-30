import { Entity, ManyToOne, Property } from '@mikro-orm/core';
import { WrapperType } from 'src/types/request.type';
import { BaseEntity } from './base.abstract';
import { GitAlert } from './git-alert.entity';
import { User } from './user.entity';

/**
 * Git Alert Recipient entity for tracking who receives and reads git alerts
 */
@Entity({ tableName: 'git_alert_recipient' })
export class GitAlertRecipient extends BaseEntity {
  /**
   * Associated Git alert
   */
  @ManyToOne(() => GitAlert, { nullable: false })
  alert!: WrapperType<GitAlert>;

  /**
   * User who will receive the alert
   */
  @ManyToOne(() => User, { nullable: false })
  recipient!: WrapperType<User>;

  /**
   * Read timestamp (when user marked as read)
   */
  @Property({ nullable: true, columnType: 'timestamp with time zone' })
  read_at?: Date;
}

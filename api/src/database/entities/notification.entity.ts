import { Entity, Enum, ManyToOne, Property } from '@mikro-orm/core';
import { BaseEntity } from './base.entity';
import { FileStorage } from './file-storage.entity';

/**
 * Types of notifications that can be sent
 */
export enum NotificationType {
  PUSH_NOTIFICATION = 'push_notification',
  NEWS = 'news',
}

/**
 * Entity representing system notifications that can be sent to users
 */
@Entity()
export class Notification extends BaseEntity {
  /**
   * Type of notification (push notification or news)
   */
  @Enum(() => NotificationType)
  @Property()
  type!: NotificationType;

  /**
   * Title of the notification
   */
  @Property({ length: 255 })
  title!: string;

  /**
   * Detailed description of the notification
   */
  @Property({ type: 'text', nullable: true })
  description?: string;

  /**
   * notification image if any
   */
  @ManyToOne(() => FileStorage)
  image?: FileStorage;

  /**
   * Target audience for the notification (JSON array of user IDs or 'all')
   */
  @Property({ type: 'text', nullable: true })
  target_audience?: string;

  /**
   * Whether the notification has been published
   */
  @Property()
  is_published: boolean = false;

  /**
   * When the notification was published
   */
  @Property({ nullable: true })
  published_at?: Date;
}

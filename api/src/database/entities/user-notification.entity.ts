import { BaseEntity, Entity, ManyToOne, Property } from '@mikro-orm/core';
import { User } from './user.entity';

/**
 * Entity representing the read status of notifications for individual users
 */
@Entity()
export class UserNotification extends BaseEntity {
  /**
   * ID of the notification this record is for
   */
  @ManyToOne(() => Notification)
  notification!: Notification;

  /**
   * ID of the user this notification is for
   */
  @ManyToOne(() => User)
  user!: User;

  /**
   * Whether the user has read this notification
   */
  @Property()
  is_read: boolean = false;

  /**
   * When the user read this notification
   */
  @Property({ nullable: true })
  read_at?: Date;
}

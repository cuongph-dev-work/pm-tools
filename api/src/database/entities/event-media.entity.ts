import { BaseEntity, Entity, ManyToOne, Property } from '@mikro-orm/core';
import { Event } from './event.entity';
import { FileStorage } from './file-storage.entity';

/**
 * Enum for media types supported in event media
 */

/**
 * Entity representing media attachments (images and videos) for events
 */
@Entity()
export class EventMediaEntity extends BaseEntity {
  /**
   * Reference to the associated event
   */
  @ManyToOne(() => Event)
  event!: Event;

  /**
   * Reference to the file storage information
   */
  @ManyToOne(() => FileStorage)
  media!: FileStorage;

  /**
   * Optional caption for the media
   */
  @Property({ length: 255, nullable: true })
  caption?: string;

  /**
   * Order in which the media should be displayed
   */
  @Property({ type: 'integer', default: 0 })
  display_order: number = 0;
}

import { BaseEntity, Entity, Enum, Property } from '@mikro-orm/core';

/**
 * Enum defining the types of events that can be created
 */
export enum EventType {
  SPEED_DATING = 'speed_dating',
  SINGLES_PARTY = 'singles_party',
  VIRTUAL_ONLINE = 'virtual_online',
}

/**
 * Enum defining the possible statuses of an event
 */
export enum EventStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
}

/**
 * Entity representing an event in the system
 * Contains all information about dating events including location, timing, and participant limits
 */
@Entity()
export class Event extends BaseEntity {
  /**
   * The title of the event
   */
  @Property()
  title!: string;

  /**
   * A brief description of the event, suitable for previews and listings
   */
  @Property()
  short_description!: string;

  /**
   * A detailed description of the event, including all relevant information
   */
  @Property({ type: 'text' })
  long_description!: string;

  /**
   * The type of event (speed dating, singles party, or virtual online)
   */
  @Enum(() => EventType)
  @Property()
  event_type!: EventType;

  /**
   * Current status of the event (draft, published, cancelled, or completed)
   * Defaults to DRAFT when created
   */
  @Enum(() => EventStatus)
  @Property()
  event_status: EventStatus = EventStatus.DRAFT;

  /**
   * When the event starts
   */
  @Property()
  start_datetime!: Date;

  /**
   * When the event ends
   */
  @Property()
  end_datetime!: Date;

  /**
   * Latitude coordinate of the event location
   * Precision: 10 digits total, 8 decimal places
   */
  @Property({ type: 'decimal', precision: 10, scale: 8 })
  latitude!: number;

  /**
   * Longitude coordinate of the event location
   * Precision: 11 digits total, 8 decimal places
   */
  @Property({ type: 'decimal', precision: 11, scale: 8 })
  longitude!: number;

  /**
   * City where the event takes place
   */
  @Property()
  city!: string;

  /**
   * Brief address of the event location
   */
  @Property()
  short_address!: string;

  /**
   * Complete address of the event location
   */
  @Property({ type: 'text' })
  long_address!: string;

  /**
   * Minimum age requirement for participants
   */
  @Property({ type: 'integer' })
  min_age!: number;

  /**
   * Maximum age limit for participants
   */
  @Property({ type: 'integer' })
  max_age!: number;

  /**
   * Maximum number of male participants allowed
   */
  @Property({ type: 'integer' })
  max_male_participants!: number;

  /**
   * Maximum number of female participants allowed
   */
  @Property({ type: 'integer' })
  max_female_participants!: number;

  /**
   * Original price of the event ticket
   * Precision: 10 digits total, 2 decimal places
   */
  @Property({ type: 'decimal', precision: 10, scale: 2 })
  ticket_price!: number;

  /**
   * Discount percentage applied to the ticket price
   * Precision: 5 digits total, 2 decimal places
   * Default: 0 (no discount)
   */
  @Property({ type: 'decimal', precision: 5, scale: 2 })
  discount: number = 0;

  /**
   * Final ticket price after applying the discount
   * Precision: 10 digits total, 2 decimal places
   */
  @Property({ type: 'decimal', precision: 10, scale: 2 })
  ticket_price_after_discount!: number;
}

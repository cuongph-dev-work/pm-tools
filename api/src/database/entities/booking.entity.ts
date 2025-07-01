import { GENDER } from '@configs/enum/customer';
import { Entity, Enum, ManyToOne, Property, Unique } from '@mikro-orm/core';
import { BaseEntity } from './base.entity';
import { Event } from './event.entity';
import { User } from './user.entity';

/**
 * Enum defining the possible statuses of a booking
 */
export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
}

/**
 * Entity representing a booking in the system
 * Contains all information about event bookings including guest information and payment details
 */
@Entity()
export class Booking extends BaseEntity {
  /**
   * Reference to the event being booked
   */
  @ManyToOne(() => Event)
  event!: Event;

  /**
   * Reference to the user who made the booking (optional for registered users)
   */
  @ManyToOne(() => User, { nullable: true })
  user?: User;

  /**
   * Guest's first name (for non-registered users)
   */
  @Property({ length: 100, nullable: true })
  guest_first_name?: string;

  /**
   * Guest's last name (for non-registered users)
   */
  @Property({ length: 100, nullable: true })
  guest_last_name?: string;

  /**
   * Guest's email (for non-registered users)
   */
  @Property({ length: 255, nullable: true })
  guest_email?: string;

  /**
   * Guest's gender (for non-registered users)
   */
  @Enum({ items: () => GENDER, nullable: true })
  guest_gender?: GENDER;

  /**
   * Guest's phone number (for non-registered users)
   */
  @Property({ length: 20, nullable: true })
  guest_phone?: string;

  /**
   * Current status of the booking
   */
  @Enum(() => BookingStatus)
  @Property()
  booking_status: BookingStatus = BookingStatus.PENDING;

  /**
   * Number of tickets booked
   */
  @Property({ type: 'integer' })
  ticket_quantity: number = 1;

  /**
   * Total amount for the booking
   */
  @Property({ type: 'decimal', precision: 10, scale: 2 })
  total_amount!: number;

  /**
   * Payment method used
   */
  @Property({ length: 50, nullable: true })
  payment_method?: string;

  /**
   * Reference number for the payment
   */
  @Property({ length: 255, nullable: true })
  payment_reference?: string;

  /**
   * Date when the booking was made
   */
  @Property()
  booking_date: Date = new Date();

  /**
   * Date when the booking was cancelled
   */
  @Property({ nullable: true })
  cancelled_at?: Date;

  /**
   * Reason for cancellation
   */
  @Property({ type: 'text', nullable: true })
  cancellation_reason?: string;

  /**
   * Any special requirements or notes for the booking
   */
  @Property({ type: 'text', nullable: true })
  special_requirements?: string;

  /**
   * Unique constraint for registered users to prevent multiple bookings for the same event
   */
  @Unique({ properties: ['event', 'user'] })
  unique_user_booking?: string;
}

import { Opt, PrimaryKey, Property } from '@mikro-orm/core';
import { generateRandomId } from '@utils/helper';

export abstract class BaseEntity {
  /**
   * Primary key identifier for the user
   */
  @PrimaryKey({ columnType: 'varchar', length: 20 })
  id: string = generateRandomId();

  /**
   * ID of the user who created this record
   */
  @Property({ length: 20, nullable: true })
  created_by: Opt<string>;

  /**
   * ID of the user who last updated this record
   */
  @Property({ length: 20, nullable: true })
  updated_by: Opt<string>;

  /**
   * Timestamp when the user record was created
   * Automatically set to current date when record is created
   */
  @Property({ columnType: 'timestamp with time zone' })
  created_at: Opt<Date> = new Date();

  /**
   * Timestamp when the user record was last updated
   * Automatically set to current date on update
   */
  @Property({
    onUpdate: () => new Date(),
    columnType: 'timestamp with time zone',
  })
  updated_at: Opt<Date> = new Date();

  /**
   * Soft delete timestamp, null for active users
   * When set, indicates the user has been deleted
   */
  @Property({ nullable: true, columnType: 'timestamp with time zone' })
  deleted_at: Opt<Date>;
}

import { BeforeCreate, BeforeUpdate, Entity, Enum, Filter, Opt, Property } from '@mikro-orm/core';
import * as bcrypt from 'bcryptjs';
import { BaseEntity } from './base.entity';

const SALT_ROUND = 11;

export enum ADMIN_ROLE {
  SUPER_ADMIN = 'SUPER_ADMIN',
  EVENT_MANAGER = 'EVENT_MANAGER',
}

@Entity({ tableName: 'administrator' })
@Filter({ name: 'isActive', cond: { deleted_at: null } })
@Filter({ name: 'isDeleted', cond: { deleted_at: { $ne: null } } })
@Filter({ name: 'isBlocked', cond: { block_to: { $gt: new Date() } } })
@Filter({ name: 'isNotBlocked', cond: { block_to: { $lte: new Date() } } })
export class Administrator extends BaseEntity {
  /**
   * Administrator's email address, must be unique
   */
  @Property({ unique: true, length: 255 })
  email!: string;

  /**
   * Administrator's hashed password
   */
  @Property({ length: 255, lazy: true })
  password!: string;

  /**
   * Token used for password reset functionality
   */
  @Property({ nullable: true, length: 255 })
  reset_token: Opt<string>;

  /**
   * Expiration date for the reset token
   */
  @Property({ nullable: true, columnType: 'timestamp with time zone' })
  reset_token_expired_at: Opt<Date>;

  /**
   * ID of the administrator's avatar/profile image
   */
  @Property({ nullable: true, length: 20 })
  avatar_id: Opt<string>;

  /**
   * Administrator's first name
   */
  @Property({ nullable: true, length: 255 })
  first_name: Opt<string>;

  /**
   * Administrator's last name
   */
  @Property({ nullable: true, length: 255 })
  last_name: Opt<string>;

  /**
   * Administrator's full name
   */
  @Property({ getter: true, persist: false })
  get fullName(): Opt<string> {
    return `${this.first_name} ${this.last_name}`;
  }

  /**
   * Administrator's role in the system, defaults to EVENT_MANAGER
   */
  @Enum({ items: () => ADMIN_ROLE, default: ADMIN_ROLE.EVENT_MANAGER })
  role: Opt<ADMIN_ROLE> = ADMIN_ROLE.EVENT_MANAGER;

  /**
   * Date until which the administrator is blocked/suspended
   */
  @Property({ nullable: true, columnType: 'timestamp with time zone' })
  block_to: Opt<Date>;

  /**
   * Hash a password using bcrypt
   * @param password The password to hash
   * @returns The hashed password
   */
  static async hashPassword(password: string) {
    return await bcrypt.hash(password, SALT_ROUND);
  }

  /**
   * Hash the password before creating a new administrator
   */
  @BeforeCreate()
  async beforeCreate() {
    this.password = await Administrator.hashPassword(this.password);
  }

  /**
   * Hash the password before updating a administrator
   */
  @BeforeUpdate()
  async beforeUpdate() {
    if (this.password) {
      this.password = await Administrator.hashPassword(this.password);
    }
  }
}

import { GENDER } from '@configs/enum/customer';
import {
  BeforeCreate,
  BeforeUpdate,
  Entity,
  Enum,
  Filter,
  ManyToOne,
  Opt,
  Property,
} from '@mikro-orm/core';
import * as bcrypt from 'bcryptjs';
import { BaseEntity } from './base.entity';
import { FileStorage } from './file-storage.entity';

const SALT_ROUND = 11;
/**
 * User entity representing the user table in the database
 * Stores user authentication and profile information
 */
@Entity({ tableName: 'user' })
@Filter({ name: 'isActive', cond: { deleted_at: null } })
@Filter({ name: 'isDeleted', cond: { deleted_at: { $ne: null } } })
@Filter({ name: 'isBlocked', cond: { block_to: { $gt: new Date() } } })
@Filter({ name: 'isNotBlocked', cond: { block_to: { $lte: new Date() } } })
export class User extends BaseEntity {
  /**
   * User's email address, must be unique
   */
  @Property({ unique: true, length: 255 })
  email!: string;

  /**
   * User's hashed password
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
   * ID of the user's avatar/profile image
   */
  @ManyToOne(() => FileStorage, { nullable: true })
  avatar?: Opt<FileStorage>;

  /**
   * User's first name
   */
  @Property({ nullable: true, length: 255 })
  first_name: Opt<string>;

  /**
   * User's last name
   */
  @Property({ nullable: true, length: 255 })
  last_name: Opt<string>;

  /**
   * User's full name
   */
  @Property({ getter: true, persist: false })
  get fullName(): Opt<string> {
    return `${this.first_name} ${this.last_name}`;
  }

  /**
   * User's gender
   */
  @Enum({ items: () => GENDER, default: GENDER.MALE })
  gender: Opt<GENDER> = GENDER.MALE;

  /**
   * User's phone number, limited to 13 characters
   */
  @Property({ nullable: true, length: 13 })
  phone: Opt<string>;

  /**
   * User's biography or description about themselves
   */
  @Property({ nullable: true, length: 3000, type: 'text' })
  bio: Opt<string>;

  /**
   * User's city information
   */
  @Property({ nullable: true, length: 255 })
  city: Opt<string>;

  /**
   * User's address information
   */
  @Property({ nullable: true, length: 500 })
  address: Opt<string>;

  /**
   * Date until which the user is blocked/suspended
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
   * Hash the password before creating a new user
   */
  @BeforeCreate()
  async beforeCreate() {
    this.password = await User.hashPassword(this.password);
  }

  /**
   * Hash the password before updating a user
   */
  @BeforeUpdate()
  async beforeUpdate() {
    if (this.password) {
      this.password = await User.hashPassword(this.password);
    }
  }
}

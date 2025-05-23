import { User } from '@entities/user.entity';
import {
  EntityRepository,
  FilterQuery,
  FindOptions,
  Populate,
  wrap,
} from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { getPaginationParams } from '@utils/pagination';
import { CreateUserDto, SearchUserDto, UpdateUserDto } from './dtos';

@Injectable()
export class UserRepository extends EntityRepository<User> {
  constructor(em: EntityManager) {
    super(em, User);
  }

  /**
   * Find a user by email
   * @param email The email of the user to find
   * @returns The user if found, null otherwise
   */
  async findByEmail(
    email: string,
    populate: Populate<User, 'password'>,
  ): Promise<User | null> {
    return this.findOne(
      { email },
      { filters: ['isActive'], populate: populate },
    );
  }

  /**
   * Find a user by ID
   * @param id The ID of the user to find
   * @returns The user if found, null otherwise
   */
  async findById(
    id: string,
    populate?: Populate<User, 'password'>,
  ): Promise<User | null> {
    return this.findOne({ id }, { filters: ['isActive'], populate: populate });
  }

  /**
   * Find conditions
   */
  async findConditions(
    conditions: FilterQuery<User>,
    options?: FindOptions<User>,
  ) {
    return this.find(conditions, options);
  }

  /**
   * Create a new user
   */
  async createNewUser(body: CreateUserDto) {
    const user = this.create(body);
    await this.em.persistAndFlush(user);
    return { id: user.id };
  }

  /**
   * Update user
   */
  async updateUser(user: User, body: UpdateUserDto) {
    wrap(user).assign(body, {
      merge: true,
    });
    await this.em.flush();
    return { id: user.id };
  }

  /**
   * Delete user
   */
  async deleteUser(user: User) {
    wrap(user).assign(
      {
        deleted_at: new Date(),
      },
      {
        merge: true,
      },
    );
    await this.em.flush();
  }

  /**
   * Update password
   */
  async updatePassword(user: User, newPassword: string) {
    user.password = newPassword;
    await this.em.flush();
    return { id: user.id };
  }

  /**
   * Update reset token
   */
  async updateResetToken(
    user: User,
    resetToken: string,
    resetTokenExpiredAt: Date,
  ) {
    user.reset_token = resetToken;
    user.reset_token_expired_at = resetTokenExpiredAt;
    await this.em.flush();
    return { id: user.id };
  }

  /**
   * Get users
   */
  async getUsers(query: SearchUserDto) {
    const { page, limit, sortBy, sortOrder, skip } = getPaginationParams(query);

    const conditions: FilterQuery<User> = {};

    // search by email
    if (query.email) {
      conditions.email = { $like: `%${query.email}%` };
    }

    // search by phone
    if (query.phone) {
      conditions.phone = { $like: `%${query.phone}%` };
    }

    const [users, total] = await this.findAndCount(conditions, {
      filters: ['isActive'],
      orderBy: { [sortBy]: sortOrder },
      offset: skip,
      limit,
    });

    return {
      data: users,
      total,
      pagination: {
        page,
        limit,
      },
    };
  }
}

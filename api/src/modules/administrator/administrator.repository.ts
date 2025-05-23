import { Administrator } from '@entities/administator.entity';
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
import { CreateAdministratorDto } from './dtos/create-administrator.dto';
import { UpdateAdministratorDto } from './dtos/update-administrator.dto';

@Injectable()
export class AdministratorRepository extends EntityRepository<Administrator> {
  constructor(em: EntityManager) {
    super(em, Administrator);
  }

  /**
   * Find an administrator by email
   * @param email The email of the administrator to find
   * @returns The administrator if found, null otherwise
   */
  async findByEmail(
    email: string,
    populate?: Populate<Administrator, 'password'>,
  ): Promise<Administrator | null> {
    return this.findOne(
      { email },
      { filters: ['isActive'], populate: populate },
    );
  }

  /**
   * Find an administrator by ID
   * @param id The ID of the administrator to find
   * @returns The administrator if found, null otherwise
   */
  async findById(
    id: string,
    populate?: Populate<Administrator, 'password'>,
  ): Promise<Administrator | null> {
    return this.findOne({ id }, { filters: ['isActive'], populate: populate });
  }

  /**
   * Find conditions
   */
  async findConditions(
    conditions: FilterQuery<Administrator>,
    options?: FindOptions<Administrator>,
  ) {
    return this.find(conditions, options);
  }

  /**
   * Create a new administrator
   */
  async createNewAdministrator(body: CreateAdministratorDto) {
    const administrator = this.create(body);
    await this.em.persistAndFlush(administrator);
    return { id: administrator.id };
  }

  /**
   * Update administrator
   */
  async updateAdministrator(
    administrator: Administrator,
    body: UpdateAdministratorDto,
  ) {
    wrap(administrator).assign(body, {
      merge: true,
    });
    await this.em.flush();
    return { id: administrator.id };
  }

  /**
   * Delete administrator
   */
  async deleteAdministrator(administrator: Administrator) {
    wrap(administrator).assign(
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
  async updatePassword(administrator: Administrator, newPassword: string) {
    administrator.password = newPassword;
    await this.em.flush();
    return { id: administrator.id };
  }

  /**
   * Get administrators with pagination
   */
  async getAdministrators(query: any) {
    const { page, limit, sortBy, sortOrder, skip } = getPaginationParams(query);

    const conditions: FilterQuery<Administrator> = {};

    // search by email
    if (query.email) {
      conditions.email = { $like: `%${query.email}%` };
    }

    // search by fullName
    if (query.fullName) {
      conditions.fullName = { $like: `%${query.fullName}%` };
    }

    const [administrators, total] = await this.findAndCount(conditions, {
      filters: ['isActive'],
      orderBy: { [sortBy]: sortOrder },
      offset: skip,
      limit,
    });

    return {
      data: administrators,
      total,
      pagination: {
        page,
        limit,
      },
    };
  }
}

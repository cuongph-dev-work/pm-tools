import { EntityRepository } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';

import { Project, PROJECT_STATUS } from '@entities/project.entity';
import { SearchProjectDto } from './dtos';

@Injectable()
export class ProjectRepository extends EntityRepository<Project> {
  async findProjectsWithFilters(filters: SearchProjectDto, page: number = 1, limit: number = 10) {
    const qb = this.createQueryBuilder('p')
      .leftJoinAndSelect('p.owner', 'owner')
      .leftJoinAndSelect('p.members', 'members')
      .leftJoinAndSelect('p.invites', 'invites');

    // Apply filters
    if (filters.name) {
      qb.andWhere({ name: { $ilike: `%${filters.name}%` } });
    }

    if (filters.description) {
      qb.andWhere({ description: { $ilike: `%${filters.description}%` } });
    }

    if (filters.status) {
      qb.andWhere({ status: filters.status });
    }

    if (filters.tags && filters.tags.length > 0) {
      qb.andWhere({ tags: { $overlap: filters.tags } });
    }

    if (filters.owner_id) {
      qb.andWhere({ owner: filters.owner_id });
    }

    if (filters.member_id) {
      qb.andWhere({ members: { user: filters.member_id } });
    }

    // Get total count
    const total = await qb.getCount();

    // Apply pagination
    const offset = (page - 1) * limit;
    qb.offset(offset).limit(limit);

    // Order by created_at desc
    qb.orderBy({ created_at: 'DESC' });

    const projects = await qb.getResult();

    return {
      data: projects,
      total,
      page,
      limit,
      total_pages: Math.ceil(total / limit),
    };
  }

  async findProjectById(id: string) {
    return this.findOne(
      { id },
      {
        populate: ['owner', 'members.user', 'members.user.avatar', 'invites'],
      },
    );
  }

  async findProjectsByOwner(ownerId: string) {
    return this.find(
      { owner: ownerId },
      {
        populate: ['owner', 'members', 'invites'],
        orderBy: { created_at: 'DESC' },
      },
    );
  }

  async findProjectsByMember(userId: string) {
    return this.find(
      { members: { user: userId } },
      {
        populate: ['owner', 'members', 'invites'],
        orderBy: { created_at: 'DESC' },
      },
    );
  }

  async findActiveProjects() {
    return this.find(
      { status: PROJECT_STATUS.ACTIVE },
      {
        populate: ['owner', 'members'],
        orderBy: { created_at: 'DESC' },
      },
    );
  }
}

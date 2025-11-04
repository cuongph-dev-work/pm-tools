import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { Injectable, Logger } from '@nestjs/common';

import { MEMBER_STATUS, PROJECT_ROLE, PROJECT_STATUS, USER_ROLE } from '@configs/enum/db';
import { ProjectMember } from '@entities/project-member.entity';
import { Project } from '@entities/project.entity';
import { User } from '@entities/user.entity';
import { plainToInstance } from 'class-transformer';
import { ProjectResponseDto, SearchProjectDto } from './dtos';

@Injectable()
export class ProjectRepository extends EntityRepository<Project> {
  private readonly logger = new Logger(ProjectRepository.name);
  constructor(em: EntityManager) {
    super(em, Project);
  }
  async findProjectsWithFilters(filters: SearchProjectDto, page: number = 1, limit: number = 10, currentUser: User) {
    const qb = this.createQueryBuilder('p').leftJoinAndSelect('p.owner', 'owner').leftJoinAndSelect('p.members', 'members').leftJoinAndSelect('p.invites', 'invites');
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

    if (filters.owner_id) {
      qb.andWhere({ owner: filters.owner_id });
    }

    if (filters.member_id) {
      qb.andWhere({ members: { user: filters.member_id } });
    }

    if (currentUser.role !== USER_ROLE.ADMIN) {
      qb.andWhere({ owner: currentUser.id });
    }

    // filter active projects
    await qb.applyFilters(['isActive']);

    const clonedQb = qb.clone();

    // Prepare pagination and ordering
    const offset = (page - 1) * limit;
    qb.offset(offset).limit(limit);
    qb.orderBy({ created_at: 'DESC' });

    const [total, projects] = await Promise.all([clonedQb.getCount(), qb.getResult()]);

    return {
      data: projects.map(project => {
        const members = project.members?.getItems();
        const invites = project.invites?.getItems();
        const memberCount = members?.filter(member => member.status === 'ACTIVE').length;
        const inviteCount = invites?.filter(invite => invite.status === 'PENDING').length;

        return plainToInstance(ProjectResponseDto, {
          ...project,
          member_count: memberCount,
          invite_count: inviteCount,
        });
      }),
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
        populate: ['owner', 'members.user', 'invites'],
        filters: ['isActive'],
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

  async createPrjAndAddMember(payload: Project, currentUser: User) {
    return this.em.transactional(async em => {
      const project = em.create(Project, payload);
      await em.persistAndFlush(project);

      const member = new ProjectMember();
      member.user = currentUser;
      member.project = project;
      member.role = PROJECT_ROLE.PROJECT_MANAGER;
      member.status = MEMBER_STATUS.ACTIVE;
      member.joined_at = new Date();

      await em.persistAndFlush(member);

      return { id: project.id };
    });
  }

  async findMembersInProject(projectId: string): Promise<ProjectMember[] | null> {
    const project = await this.findOne({ id: projectId }, { populate: ['members.user'] });
    return project?.members?.getItems() || null;
  }
}

import { Project } from '@entities/project.entity';
import { User } from '@entities/user.entity';
import { EntityManager } from '@mikro-orm/core';
import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProjectDto, SearchProjectDto, UpdateProjectDto } from './dtos';
import { ProjectRepository } from './project.repository';

@Injectable()
export class ProjectService {
  constructor(
    private readonly projectRepository: ProjectRepository,
    private readonly em: EntityManager,
  ) {}

  async createProject(createProjectDto: CreateProjectDto, currentUser: User) {
    const project = new Project();
    project.name = createProjectDto.name;
    project.description = createProjectDto.description;
    project.owner = currentUser;
    project.tags = createProjectDto.tags;

    if (createProjectDto.start_date) {
      project.start_date = new Date(createProjectDto.start_date);
    }

    if (createProjectDto.end_date) {
      project.end_date = new Date(createProjectDto.end_date);
    }

    await this.em.persistAndFlush(project);
    return this.findProjectById(project.id);
  }

  async findProjects(filters: SearchProjectDto, _currentUser: User) {
    const page = filters.page ? parseInt(filters.page) : 1;
    const limit = filters.limit ? parseInt(filters.limit) : 10;

    return this.projectRepository.findProjectsWithFilters(filters, page, limit);
  }

  async findProjectById(id: string) {
    const project = await this.projectRepository.findProjectById(id);
    if (!project) {
      throw new NotFoundException('Project not found');
    }
    return project;
  }

  async updateProject(id: string, updateProjectDto: UpdateProjectDto, currentUser: User) {
    const project = await this.findProjectById(id);

    // Check if user is owner or has permission
    if (project.owner.id !== currentUser.id) {
      throw new ForbiddenException('You can only update your own projects');
    }

    if (updateProjectDto.name !== undefined) {
      project.name = updateProjectDto.name;
    }

    if (updateProjectDto.description !== undefined) {
      project.description = updateProjectDto.description;
    }

    if (updateProjectDto.tags !== undefined) {
      project.tags = updateProjectDto.tags;
    }

    if (updateProjectDto.status !== undefined) {
      project.status = updateProjectDto.status;
    }

    if (updateProjectDto.start_date !== undefined) {
      project.start_date = new Date(updateProjectDto.start_date);
    }

    if (updateProjectDto.end_date !== undefined) {
      project.end_date = new Date(updateProjectDto.end_date);
    }

    await this.em.persistAndFlush(project);
    return this.findProjectById(id);
  }

  async deleteProject(id: string, currentUser: User) {
    const project = await this.findProjectById(id);

    // Check if user is owner
    if (project.owner.id !== currentUser.id) {
      throw new ForbiddenException('You can only delete your own projects');
    }

    await this.em.removeAndFlush(project);
    return { message: 'Project deleted successfully' };
  }

  async findMyProjects(currentUser: User) {
    return this.projectRepository.findProjectsByOwner(currentUser.id);
  }

  async findProjectsIMemberOf(currentUser: User) {
    return this.projectRepository.findProjectsByMember(currentUser.id);
  }

  async findActiveProjects() {
    return this.projectRepository.findActiveProjects();
  }

  async getProjectStats(id: string, currentUser: User) {
    const project = await this.findProjectById(id);

    // Check if user is member or owner
    const isOwner = project.owner.id === currentUser.id;
    const isMember = project.members?.some(member => member.user.id === currentUser.id);

    if (!isOwner && !isMember) {
      throw new ForbiddenException('You do not have access to this project');
    }

    const memberCount = project.members?.filter(member => member.status === 'ACTIVE').length;
    const inviteCount = project.invites?.filter(invite => invite.status === 'PENDING').length;

    return {
      id: project.id,
      name: project.name,
      member_count: memberCount,
      invite_count: inviteCount,
      status: project.status,
      created_at: project.created_at,
    };
  }
}

import { Project } from '@entities/project.entity';
import { User } from '@entities/user.entity';
import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { isUndefined } from 'lodash';
import { I18nService } from 'nestjs-i18n';
import { WrapperType } from 'src/types/request.type';
import { CreateProjectDto, SearchProjectDto, UpdateProjectDto } from './dtos';
import { ProjectResponseDto } from './dtos/project-response.dto';
import { ProjectRepository } from './project.repository';

@Injectable()
export class ProjectService {
  constructor(
    @Inject(forwardRef(() => ProjectRepository))
    private readonly projectRepository: WrapperType<ProjectRepository>,
    private readonly i18n: I18nService,
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

    await this.projectRepository.getEntityManager().persistAndFlush(project);
    return { id: project.id };
  }

  async updateProject(id: string, updateProjectDto: UpdateProjectDto, currentUser: User) {
    const project = await this.findProjectById(id);
    if (!project) {
      throw new NotFoundException(this.i18n.t('message.project_not_found'));
    }
    if (project.owner.id !== currentUser.id) {
      throw new ForbiddenException(this.i18n.t('message.project_update_forbidden'));
    }
    if (!isUndefined(updateProjectDto.name)) {
      project.name = updateProjectDto.name;
    }
    if (!isUndefined(updateProjectDto.description)) {
      project.description = updateProjectDto.description;
    }
    if (!isUndefined(updateProjectDto.tags)) {
      project.tags = updateProjectDto.tags;
    }
    if (!isUndefined(updateProjectDto.status)) {
      project.status = updateProjectDto.status;
    }
    if (!isUndefined(updateProjectDto.start_date)) {
      const startDate = new Date(updateProjectDto.start_date);
      project.start_date = startDate;
    }
    if (!isUndefined(updateProjectDto.end_date)) {
      const endDate = new Date(updateProjectDto.end_date);
      project.end_date = endDate;
    }
    await this.projectRepository.getEntityManager().persistAndFlush(project);
    return { id: project.id };
  }

  async findProjects(filters: SearchProjectDto, currentUser: User) {
    const page = filters.page ? parseInt(filters.page) : 1;
    const limit = filters.limit ? parseInt(filters.limit) : 10;

    return this.projectRepository.findProjectsWithFilters(filters, page, limit, currentUser);
  }

  async findProjectById(id: string): Promise<ProjectResponseDto> {
    const project = await this.projectRepository.findProjectById(id);
    if (!project) {
      throw new NotFoundException('Project not found');
    }
    return plainToInstance(ProjectResponseDto, project);
  }

  async deleteProject(id: string, currentUser: User) {
    const project = await this.findProjectById(id);

    // Check if user is owner
    if (project.owner.id !== currentUser.id) {
      throw new ForbiddenException('You can only delete your own projects');
    }

    await this.projectRepository.getEntityManager().removeAndFlush(project);
    return { success: true };
  }

  async findProjectsIMemberOf(currentUser: User) {
    return this.projectRepository.findProjectsByMember(currentUser.id);
  }

  async findActiveProjects() {
    return this.projectRepository.findActiveProjects();
  }

  // async getProjectStats(id: string, currentUser: User) {
  //   const project = await this.findProjectById(id);

  //   // Check if user is member or owner
  //   const isOwner = project.owner.id === currentUser.id;
  //   const isMember = project.members?.some(member => member.user.id === currentUser.id);

  //   if (!isOwner && !isMember) {
  //     throw new ForbiddenException('You do not have access to this project');
  //   }

  //   const memberCount = project.members?.filter(member => member.status === 'ACTIVE').length;
  //   const inviteCount = project.invites?.filter(invite => invite.status === 'PENDING').length;

  //   return {
  //     id: project.id,
  //     name: project.name,
  //     member_count: memberCount,
  //     invite_count: inviteCount,
  //     status: project.status,
  //     created_at: project.created_at,
  //   };
  // }
}

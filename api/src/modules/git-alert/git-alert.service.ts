import { GIT_ALERT_PRIORITY } from '@configs/enum/db';
import { GitAlert } from '@entities/git-alert.entity';
import { GitRepository } from '@entities/git-repository.entity';
import { ProjectRepository } from '@modules/project/project.repository';
import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { WrapperType } from 'src/types/request.type';
import { CreateGitAlertDto } from './dtos';
import { GitAlertRepository } from './git-alert.repository';

@Injectable()
export class GitAlertService {
  constructor(
    @Inject(forwardRef(() => GitAlertRepository))
    private readonly gitAlertRepository: WrapperType<GitAlertRepository>,
    @Inject(forwardRef(() => ProjectRepository))
    private readonly projectRepository: WrapperType<ProjectRepository>,
    @Inject(forwardRef(() => GitRepository))
    private readonly gitRepository: WrapperType<GitRepository>,
    private readonly i18n: I18nService,
  ) {}

  async createGitAlert(data: CreateGitAlertDto, repository: GitRepository) {
    const gitAlert = new GitAlert();
    gitAlert.title = data.title;
    gitAlert.description = data.description;
    gitAlert.type = data.type;
    gitAlert.priority = data.priority || GIT_ALERT_PRIORITY.LOW;
    gitAlert.tags = data.tags || [];
    gitAlert.metadata = data.metadata;
    gitAlert.repository = repository;
    gitAlert.project = repository.project;

    await this.gitAlertRepository.getEntityManager().persistAndFlush(gitAlert);

    return gitAlert;
  }

  // async findProjectByGitUrl(gitUrl: string): Promise<Project | null> {
  // const project = await this.projectRepository.findOne({ git_url: gitUrl });
  // if (!project) {
  //   throw new NotFoundException('Project not found');
  // }
  // return project;
  // }

  // async

  // async createGitAlert(
  //   projectId: string,
  //   createGitAlertDto: CreateGitAlertDto,
  //   currentUser: User,
  // ): Promise<GitAlertResponseDto> {
  //   // Verify project exists
  //   const project = await this.projectRepository.findOne({ id: projectId });
  //   if (!project) {
  //     throw new NotFoundException('Project not found');
  //   }

  //   // Verify repository exists and belongs to project
  //   const repository = await this.gitAlertRepository.getEntityManager().findOne(GitRepository, {
  //     id: createGitAlertDto.repository_id,
  //     project: { id: projectId },
  //   });
  //   if (!repository) {
  //     throw new NotFoundException('Repository not found or does not belong to project');
  //   }

  //   const gitAlert = new GitAlert();
  //   gitAlert.title = createGitAlertDto.title;
  //   gitAlert.description = createGitAlertDto.description;
  //   gitAlert.type = createGitAlertDto.type;
  //   gitAlert.priority = createGitAlertDto.priority || 'MEDIUM';
  //   gitAlert.branch = createGitAlertDto.branch;
  //   gitAlert.commit_hash = createGitAlertDto.commit_hash;
  //   gitAlert.pull_request_number = createGitAlertDto.pull_request_number;
  //   gitAlert.issue_number = createGitAlertDto.issue_number;
  //   gitAlert.external_url = createGitAlertDto.external_url;
  //   gitAlert.is_actionable = createGitAlertDto.is_actionable || false;
  //   gitAlert.action_required = createGitAlertDto.action_required;
  //   gitAlert.alert_timestamp = new Date(createGitAlertDto.alert_timestamp);
  //   gitAlert.repository = repository;
  //   gitAlert.project = project;
  //   gitAlert.triggered_by = currentUser;
  //   gitAlert.created_by = currentUser;

  //   await this.gitAlertRepository.persistAndFlush(gitAlert);

  //   return this.mapToResponseDto(gitAlert);
  // }

  // async updateGitAlert(
  //   projectId: string,
  //   alertId: string,
  //   updateGitAlertDto: UpdateGitAlertDto,
  //   currentUser: User,
  // ): Promise<GitAlertResponseDto> {
  //   const gitAlert = await this.gitAlertRepository.findGitAlertById(projectId, alertId);
  //   if (!gitAlert) {
  //     throw new NotFoundException('Git alert not found');
  //   }

  //   // Update fields
  //   if (updateGitAlertDto.title !== undefined) {
  //     gitAlert.title = updateGitAlertDto.title;
  //   }
  //   if (updateGitAlertDto.description !== undefined) {
  //     gitAlert.description = updateGitAlertDto.description;
  //   }
  //   if (updateGitAlertDto.type !== undefined) {
  //     gitAlert.type = updateGitAlertDto.type;
  //   }
  //   if (updateGitAlertDto.status !== undefined) {
  //     gitAlert.status = updateGitAlertDto.status;
  //   }
  //   if (updateGitAlertDto.priority !== undefined) {
  //     gitAlert.priority = updateGitAlertDto.priority;
  //   }
  //   if (updateGitAlertDto.branch !== undefined) {
  //     gitAlert.branch = updateGitAlertDto.branch;
  //   }
  //   if (updateGitAlertDto.commit_hash !== undefined) {
  //     gitAlert.commit_hash = updateGitAlertDto.commit_hash;
  //   }
  //   if (updateGitAlertDto.pull_request_number !== undefined) {
  //     gitAlert.pull_request_number = updateGitAlertDto.pull_request_number;
  //   }
  //   if (updateGitAlertDto.issue_number !== undefined) {
  //     gitAlert.issue_number = updateGitAlertDto.issue_number;
  //   }
  //   if (updateGitAlertDto.external_url !== undefined) {
  //     gitAlert.external_url = updateGitAlertDto.external_url;
  //   }
  //   if (updateGitAlertDto.is_actionable !== undefined) {
  //     gitAlert.is_actionable = updateGitAlertDto.is_actionable;
  //   }
  //   if (updateGitAlertDto.action_required !== undefined) {
  //     gitAlert.action_required = updateGitAlertDto.action_required;
  //   }

  //   gitAlert.updated_by = currentUser;

  //   await this.gitAlertRepository.persistAndFlush(gitAlert);

  //   return this.mapToResponseDto(gitAlert);
  // }

  // async findGitAlertById(projectId: string, alertId: string): Promise<GitAlertResponseDto> {
  //   const gitAlert = await this.gitAlertRepository.findGitAlertById(projectId, alertId);
  //   if (!gitAlert) {
  //     throw new NotFoundException('Git alert not found');
  //   }

  //   return this.mapToResponseDto(gitAlert);
  // }

  // async findGitAlertsByProject(
  //   projectId: string,
  //   searchDto: SearchGitAlertDto,
  // ): Promise<GitAlertListResponseDto> {
  //   const [alerts, total] = await this.gitAlertRepository.findGitAlertsByProject(
  //     projectId,
  //     searchDto,
  //   );

  //   const { page = 1, limit = 10 } = searchDto;
  //   const totalPages = Math.ceil(total / limit);

  //   return {
  //     data: alerts.map(alert => this.mapToResponseDto(alert)),
  //     pagination: {
  //       page,
  //       limit,
  //       total,
  //       total_pages: totalPages,
  //     },
  //   };
  // }

  // async getGitAlertSummary(projectId: string): Promise<GitAlertSummaryDto> {
  //   return this.gitAlertRepository.getGitAlertSummary(projectId);
  // }

  // async markAsRead(projectId: string, alertId: string, currentUser: User): Promise<void> {
  //   const gitAlert = await this.gitAlertRepository.findGitAlertById(projectId, alertId);
  //   if (!gitAlert) {
  //     throw new NotFoundException('Git alert not found');
  //   }

  //   if (gitAlert.status === GIT_ALERT_STATUS.READ) {
  //     throw new BadRequestException('Alert is already marked as read');
  //   }

  //   await this.gitAlertRepository.markAsRead(alertId, currentUser.id);
  // }

  // async markAllAsRead(projectId: string, currentUser: User): Promise<{ count: number }> {
  //   const count = await this.gitAlertRepository.markAllAsRead(projectId, currentUser.id);
  //   return { count };
  // }

  // async deleteGitAlert(projectId: string, alertId: string): Promise<void> {
  //   const gitAlert = await this.gitAlertRepository.findGitAlertById(projectId, alertId);
  //   if (!gitAlert) {
  //     throw new NotFoundException('Git alert not found');
  //   }

  //   await this.gitAlertRepository.deleteGitAlert(projectId, alertId);
  // }

  // async findGitAlertsByRepository(
  //   projectId: string,
  //   repositoryId: string,
  //   limit: number = 50,
  // ): Promise<GitAlertResponseDto[]> {
  //   // Verify repository belongs to project
  //   const repository = await this.gitAlertRepository.getEntityManager().findOne(GitRepository, {
  //     id: repositoryId,
  //     project: { id: projectId },
  //   });
  //   if (!repository) {
  //     throw new NotFoundException('Repository not found or does not belong to project');
  //   }

  //   const alerts = await this.gitAlertRepository.findGitAlertsByRepository(repositoryId, limit);
  //   return alerts.map(alert => this.mapToResponseDto(alert));
  // }

  // private mapToResponseDto(gitAlert: GitAlert): GitAlertResponseDto {
  //   return {
  //     id: gitAlert.id,
  //     title: gitAlert.title,
  //     description: gitAlert.description,
  //     type: gitAlert.type,
  //     status: gitAlert.status,
  //     priority: gitAlert.priority,
  //     branch: gitAlert.branch,
  //     commit_hash: gitAlert.commit_hash,
  //     pull_request_number: gitAlert.pull_request_number,
  //     issue_number: gitAlert.issue_number,
  //     external_url: gitAlert.external_url,
  //     is_actionable: gitAlert.is_actionable,
  //     action_required: gitAlert.action_required,
  //     alert_timestamp: gitAlert.alert_timestamp,
  //     read_at: gitAlert.read_at,
  //     created_at: gitAlert.created_at,
  //     updated_at: gitAlert.updated_at,
  //     repository: gitAlert.repository
  //       ? {
  //           id: gitAlert.repository.id,
  //           name: gitAlert.repository.name,
  //           full_name: gitAlert.repository.full_name,
  //           provider: gitAlert.repository.provider,
  //         }
  //       : null,
  //     project: gitAlert.project
  //       ? {
  //           id: gitAlert.project.id,
  //           name: gitAlert.project.name,
  //         }
  //       : null,
  //     triggered_by: gitAlert.triggered_by
  //       ? {
  //           id: gitAlert.triggered_by.id,
  //           email: gitAlert.triggered_by.email,
  //           first_name: gitAlert.triggered_by.first_name,
  //           last_name: gitAlert.triggered_by.last_name,
  //         }
  //       : null,
  //     read_by: gitAlert.read_by
  //       ? {
  //           id: gitAlert.read_by.id,
  //           email: gitAlert.read_by.email,
  //           first_name: gitAlert.read_by.first_name,
  //           last_name: gitAlert.read_by.last_name,
  //         }
  //       : null,
  //     created_by: gitAlert.created_by
  //       ? {
  //           id: gitAlert.created_by.id,
  //           email: gitAlert.created_by.email,
  //           first_name: gitAlert.created_by.first_name,
  //           last_name: gitAlert.created_by.last_name,
  //         }
  //       : null,
  //     updated_by: gitAlert.updated_by
  //       ? {
  //           id: gitAlert.updated_by.id,
  //           email: gitAlert.updated_by.email,
  //           first_name: gitAlert.updated_by.first_name,
  //           last_name: gitAlert.updated_by.last_name,
  //         }
  //       : null,
  //   };
  // }
}

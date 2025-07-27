import { SPRINT_STATUS } from '@configs/enum/db';
import { Sprint } from '@entities/sprint.entity';
import { ProjectRepository } from '@modules/project/project.repository';
import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { I18nService } from 'nestjs-i18n';
import { WrapperType } from 'src/types/request.type';
import { CreateSprintDto, SearchSprintDto, SprintListResponseDto, SprintResponseDto } from './dtos';
import { SprintRepository } from './sprint.repository';

@Injectable()
export class SprintService {
  private readonly logger = new Logger(SprintService.name);

  constructor(
    @Inject(forwardRef(() => SprintRepository))
    private readonly sprintRepository: WrapperType<SprintRepository>,
    @Inject(forwardRef(() => ProjectRepository))
    private readonly projectRepository: WrapperType<ProjectRepository>,
    private readonly i18n: I18nService,
  ) {}

  private async findProjectById(project_id: string) {
    const project = await this.projectRepository.findProjectById(project_id);
    if (!project) {
      throw new NotFoundException(this.i18n.t('message.project_not_found'));
    }
    return project;
  }

  async createSprint(projectId: string, createSprintDto: CreateSprintDto): Promise<{ id: string }> {
    const { name, description, start_date, end_date } = createSprintDto;

    // Validate project exists
    const project = await this.findProjectById(projectId);

    const sprint = new Sprint();
    sprint.name = name;
    sprint.description = description;
    sprint.start_date = start_date ? new Date(start_date) : undefined;
    sprint.end_date = end_date ? new Date(end_date) : undefined;
    sprint.project = project;
    sprint.status = SPRINT_STATUS.PLANNING;
    // TODO: add tags to sprint

    await this.sprintRepository.getEntityManager().persistAndFlush(sprint);

    return {
      id: sprint.id,
    };
  }

  async findSprintById(projectId: string, id: string): Promise<SprintResponseDto> {
    const sprint = await this.sprintRepository.findWithRelations(projectId, id);
    if (!sprint) {
      throw new NotFoundException(this.i18n.t('message.sprint_not_found'));
    }

    return plainToInstance(SprintResponseDto, sprint);
  }

  async closeSprint(projectId: string, id: string) {
    const sprint = await this.sprintRepository.findWithRelations(projectId, id);
    if (!sprint) {
      throw new NotFoundException(this.i18n.t('message.sprint_not_found'));
    }
    if (sprint.status !== SPRINT_STATUS.PLANNING) {
      throw new BadRequestException(this.i18n.t('message.sprint_not_in_planning_status'));
    }
    sprint.status = SPRINT_STATUS.CLOSED;
    await this.sprintRepository.getEntityManager().persistAndFlush(sprint);
    return {
      id: sprint.id,
    };
  }

  async openSprint(projectId: string, id: string) {
    const sprint = await this.sprintRepository.findWithRelations(projectId, id);
    if (!sprint) {
      throw new NotFoundException(this.i18n.t('message.sprint_not_found'));
    }
    sprint.status = SPRINT_STATUS.IN_PROGRESS;
    await this.sprintRepository.getEntityManager().persistAndFlush(sprint);
    return {
      id: sprint.id,
    };
  }

  async findAllSprints(projectId: string, searchDto: SearchSprintDto) {
    const [sprints, total] = await this.sprintRepository.searchSprints(projectId, searchDto);
    return {
      data: plainToInstance(SprintListResponseDto, sprints),
      total,
    };
  }
}

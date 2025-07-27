import { Sprint } from '@entities/sprint.entity';
import { EntityManager, EntityRepository, FilterQuery } from '@mikro-orm/postgresql';
import { Injectable, Logger } from '@nestjs/common';
import { SearchSprintDto } from './dtos';

@Injectable()
export class SprintRepository extends EntityRepository<Sprint> {
  private readonly logger = new Logger(SprintRepository.name);

  constructor(em: EntityManager) {
    super(em, Sprint);
  }

  async findWithRelations(projectId: string, id: string): Promise<Sprint | null> {
    return this.findOne(
      { id, project: projectId },
      {
        populate: ['tasks', 'project'],
      },
    );
  }

  async searchSprints(projectId: string, searchDto: SearchSprintDto): Promise<[Sprint[], number]> {
    const { keywords } = searchDto;

    this.logger.log('keywords', keywords);
    const where: FilterQuery<Sprint> = { project: projectId };

    if (keywords) {
      where.$or = [
        { name: { $ilike: `%${keywords}%` } },
        { description: { $ilike: `%${keywords}%` } },
      ];
    }

    // Get sprints and sort them in memory to prioritize IN_PROGRESS
    const [sprints, total] = await this.findAndCount(where, {
      orderBy: { created_at: 'DESC' },
      populate: ['project'],
    });

    // Sort to prioritize IN_PROGRESS sprints first
    sprints.sort((a, b) => {
      if (a.status === 'IN_PROGRESS' && b.status !== 'IN_PROGRESS') return -1;
      if (a.status !== 'IN_PROGRESS' && b.status === 'IN_PROGRESS') return 1;
      return 0;
    });

    return [sprints, total];
  }
}

import { GitAlert } from '@entities/git-alert.entity';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { Injectable, Logger } from '@nestjs/common';
import { SearchGitAlertDto } from './dtos';

@Injectable()
export class GitAlertRepository extends EntityRepository<GitAlert> {
  private readonly logger = new Logger(GitAlertRepository.name);
  constructor(em: EntityManager) {
    super(em, GitAlert);
  }

  async findGitAlertsByProject(projectId: string, searchDto: SearchGitAlertDto): Promise<[GitAlert[], number]> {
    const { page = 1, limit = 10, ...filters } = searchDto;
    const offset = (page - 1) * limit;

    const qb = this.createQueryBuilder('alert')
      .leftJoinAndSelect('alert.repository', 'repository')
      .leftJoinAndSelect('alert.project', 'project')
      .leftJoinAndSelect('alert.triggered_by', 'triggered_by')
      .leftJoinAndSelect('alert.read_by', 'read_by')
      .leftJoinAndSelect('alert.created_by', 'created_by')
      .leftJoinAndSelect('alert.updated_by', 'updated_by')
      .where('alert.project.id = ?', [projectId])
      .andWhere('alert.deleted_at IS NULL');

    // Apply filters
    if (filters.search) {
      qb.andWhere('(alert.title ILIKE ? OR alert.description ILIKE ?)', [`%${filters.search}%`, `%${filters.search}%`]);
    }

    if (filters.type) {
      qb.andWhere('alert.type = ?', [filters.type]);
    }

    if (filters.priority) {
      qb.andWhere('alert.priority = ?', [filters.priority]);
    }

    if (filters.branch) {
      qb.andWhere('alert.branch = ?', [filters.branch]);
    }

    if (filters.repository_id) {
      qb.andWhere('alert.repository.id = ?', [filters.repository_id]);
    }

    if (filters.is_actionable !== undefined) {
      qb.andWhere('alert.is_actionable = ?', [filters.is_actionable]);
    }

    if (filters.triggered_by_id) {
      qb.andWhere('alert.triggered_by.id = ?', [filters.triggered_by_id]);
    }

    if (filters.from_date) {
      qb.andWhere('alert.alert_timestamp >= ?', [new Date(filters.from_date)]);
    }

    if (filters.to_date) {
      qb.andWhere('alert.alert_timestamp <= ?', [new Date(filters.to_date)]);
    }

    const [alerts, total] = await qb.orderBy({ 'alert.created_at': 'DESC' }).limit(limit).offset(offset).getResultAndCount();

    return [alerts, total];
  }

  async findGitAlertById(projectId: string, alertId: string): Promise<GitAlert | null> {
    return this.findOne(
      {
        id: alertId,
        project: { id: projectId },
        deleted_at: null,
      },
      {
        populate: ['repository', 'project'],
      },
    );
  }

  // async getGitAlertSummary(projectId: string): Promise<{
  //   total: number;
  //   unread: number;
  //   actionable: number;
  //   by_type: Record<GIT_ALERT_TYPE, number>;
  //   by_status: Record<GIT_ALERT_STATUS, number>;
  //   by_priority: Record<GIT_ALERT_PRIORITY, number>;
  // }> {
  //   const qb = this.createQueryBuilder('alert')
  //     .where('alert.project.id = ?', [projectId])
  //     .andWhere('alert.deleted_at IS NULL');

  //   const [total, unread, actionable] = await Promise.all([
  //     qb.count().execute(),
  //     qb.clone().andWhere('alert.status = ?', [GIT_ALERT_STATUS.UNREAD]).count().execute(),
  //     qb.clone().andWhere('alert.is_actionable = ?', [true]).count().execute(),
  //   ]);

  //   // Get counts by type
  //   const byType = await this.getCountsByField('type', projectId);
  //   const byStatus = await this.getCountsByField('status', projectId);
  //   const byPriority = await this.getCountsByField('priority', projectId);

  //   return {
  //     total,
  //     unread,
  //     actionable,
  //     by_type: byType as Record<GIT_ALERT_TYPE, number>,
  //     by_status: byStatus as Record<GIT_ALERT_STATUS, number>,
  //     by_priority: byPriority as Record<GIT_ALERT_PRIORITY, number>,
  //   };
  // }

  // private async getCountsByField(
  //   field: string,
  //   projectId: string,
  // ): Promise<Record<string, number>> {
  //   const result = await this.createQueryBuilder('alert')
  //     .select(`alert.${field} as ${field}`)
  //     .addSelect('COUNT(*) as count')
  //     .where('alert.project.id = ?', [projectId])
  //     .andWhere('alert.deleted_at IS NULL')
  //     .groupBy(`alert.${field}`)
  //     .execute();

  //   const counts: Record<string, number> = {};
  //   result.forEach((row: any) => {
  //     counts[row[field]] = parseInt(row.count);
  //   });

  //   return counts;
  // }

  // async markAsRead(alertId: string, userId: string): Promise<void> {
  //   await this.nativeUpdate(
  //     { id: alertId },
  //     {
  //       status: GIT_ALERT_STATUS.READ,
  //       read_at: new Date(),
  //       read_by: userId,
  //       updated_at: new Date(),
  //     },
  //   );
  // }

  // async markAllAsRead(projectId: string, userId: string): Promise<number> {
  //   const result = await this.nativeUpdate(
  //     {
  //       project: { id: projectId },
  //       status: GIT_ALERT_STATUS.UNREAD,
  //       deleted_at: null,
  //     },
  //     {
  //       status: GIT_ALERT_STATUS.READ,
  //       read_at: new Date(),
  //       read_by: userId,
  //       updated_at: new Date(),
  //     },
  //   );

  //   return result.affectedRows || 0;
  // }

  async deleteGitAlert(projectId: string, alertId: string): Promise<void> {
    await this.nativeUpdate({ id: alertId, project: { id: projectId } }, { deleted_at: new Date() });
  }

  // async findGitAlertsByRepository(repositoryId: string, limit: number = 50): Promise<GitAlert[]> {
  //   return this.find(
  //     {
  //       repository: { id: repositoryId },
  //       deleted_at: null,
  //     },
  //     {
  //       orderBy: { created_at: 'DESC' },
  //       limit,
  //       populate: ['repository', 'project', 'triggered_by'],
  //     },
  //   );
  // }
}

import { ProjectMember } from '@entities/project-member.entity';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ProjectMemberRepository extends EntityRepository<ProjectMember> {
  constructor(em: EntityManager) {
    super(em, ProjectMember);
  }

  async findMemberByEmail(projectId: string, email: string) {
    return this.findOne({
      project: projectId,
      user: { email },
    });
  }
}

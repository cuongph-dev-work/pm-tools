import { GitRepository } from '@entities/git-repository.entity';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GitRepoRepository extends EntityRepository<GitRepository> {
  constructor(em: EntityManager) {
    super(em, GitRepository);
  }

  async findGitRepositoryByUrl(url: string): Promise<GitRepository | null> {
    return this.findOne({ url }, { populate: ['project'] });
  }
}

import { GitRepository } from '@entities/git-repository.entity';
import { EntityRepository } from '@mikro-orm/postgresql';

export class GitRepoRepository extends EntityRepository<GitRepository> {
  async findGitRepositoryByUrl(url: string): Promise<GitRepository | null> {
    return this.findOne({ url });
  }
}

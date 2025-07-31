import { GitAlertRecipient } from '@entities/git-alert-recipient.entity';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class GitAlertRecipientRepository extends EntityRepository<GitAlertRecipient> {
  private readonly logger = new Logger(GitAlertRecipientRepository.name);
  constructor(em: EntityManager) {
    super(em, GitAlertRecipient);
  }
}

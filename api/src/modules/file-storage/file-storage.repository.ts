import { EntityRepository } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { FileStorage } from '@entities/file-storage.entity';

@Injectable()
export class FileStorageRepository extends EntityRepository<FileStorage> {
  constructor(em: EntityManager) {
    super(em, FileStorage);
  }

  async findOneById(id: string) {
    return this.findOne({ id }, { filters: ['isActive'] });
  }
}

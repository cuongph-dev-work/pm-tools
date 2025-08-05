import { Entity, ManyToOne, Property } from '@mikro-orm/core';
import { WrapperType } from 'src/types/request.type';
import { AuditableEntity } from './auditable.abstract';
import { Project } from './project.entity';

@Entity({ tableName: 'layout_checker' })
export class LayoutChecker extends AuditableEntity {
  @Property({ columnType: 'varchar' })
  figma_url!: string;

  @Property({ columnType: 'varchar' })
  figma_token!: string;

  @Property({ columnType: 'varchar' })
  website_url!: string;

  @ManyToOne(() => Project)
  project!: WrapperType<Project>;
}

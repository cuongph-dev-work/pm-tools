import { Entity, ManyToOne, Property } from '@mikro-orm/core';
import { WrapperType } from 'src/types/request.type';
import { AuditableEntity } from './auditable.abstract';
import { LayoutCheckerVersion } from './layout-checker-version.entity';

@Entity({ tableName: 'comment_on_layout_checker' })
export class CommentOnLayoutChecker extends AuditableEntity {
  @Property({ length: 500 })
  comment!: string;

  @Property({ type: 'text[]', columnType: 'text[]' })
  highlight_urls!: string[];

  @ManyToOne(() => LayoutCheckerVersion)
  layout_checker_version!: WrapperType<LayoutCheckerVersion>;
}

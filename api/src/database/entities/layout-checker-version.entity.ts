import { Entity, ManyToOne, Property } from '@mikro-orm/core';
import { WrapperType } from 'src/types/request.type';
import { BaseEntity } from './base.abstract';
import { LayoutChecker } from './layout-checker.entity';

@Entity({ tableName: 'layout_checker_version' })
export class LayoutCheckerVersion extends BaseEntity {
  @Property({ columnType: 'varchar' })
  version!: string;

  @Property({ columnType: 'varchar' })
  diff_pixel_url!: string;

  @ManyToOne(() => LayoutChecker)
  layout_checker!: WrapperType<LayoutChecker>;
}

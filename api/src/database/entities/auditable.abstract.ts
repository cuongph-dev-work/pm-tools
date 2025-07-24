import { ManyToOne } from '@mikro-orm/core';
import { WrapperType } from 'src/types/request.type';
import { BaseEntity } from './base.abstract';
import { User } from './user.entity';

export abstract class AuditableEntity extends BaseEntity {
  @ManyToOne(() => User, { nullable: true })
  created_by?: WrapperType<User>;

  @ManyToOne(() => User, { nullable: true })
  updated_by?: WrapperType<User>;
}

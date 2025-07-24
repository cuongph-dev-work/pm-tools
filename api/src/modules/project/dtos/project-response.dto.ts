import { PROJECT_STATUS } from '@configs/enum/db';
import { Exclude, Expose, Type } from 'class-transformer';

@Exclude()
class OwnerResponseDto {
  @Expose()
  id: string;

  @Expose()
  email: string;

  @Expose()
  first_name?: string;

  @Expose()
  last_name?: string;

  @Expose()
  fullName?: string;
}
@Exclude()
export class ProjectResponseDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  description?: string;

  @Expose()
  tags?: string[];

  @Expose()
  status: PROJECT_STATUS;

  @Expose()
  start_date?: Date;

  @Expose()
  end_date?: Date;

  @Expose()
  @Type(() => OwnerResponseDto)
  owner: OwnerResponseDto;

  @Expose()
  created_at: Date;

  @Expose()
  updated_at: Date;

  @Expose()
  member_count?: number;

  @Expose()
  invite_count?: number;
}

export class ProjectListResponseDto {
  data: ProjectResponseDto[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

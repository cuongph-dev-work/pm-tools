import { INVITE_STATUS, PROJECT_ROLE } from '@configs/enum/db';
import { Exclude, Expose, Type } from 'class-transformer';

@Exclude()
class ProjectDto {
  @Expose()
  id: string;

  @Expose()
  name: string;
}

@Exclude()
class InvitedByDto {
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
export class InviteResponseDto {
  @Expose()
  id: string;

  @Expose()
  @Type(() => ProjectDto)
  project: ProjectDto;

  @Expose()
  @Type(() => InvitedByDto)
  invited_by: InvitedByDto;

  @Expose()
  invited_email: string;

  @Expose()
  role: PROJECT_ROLE;

  @Expose()
  status: INVITE_STATUS;

  @Expose()
  expired_at: Date;

  @Expose()
  accepted_at?: Date;

  @Expose()
  rejected_at?: Date;

  @Expose()
  message?: string;

  @Expose()
  created_at: Date;
}

export class InviteListResponseDto {
  data: InviteResponseDto[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

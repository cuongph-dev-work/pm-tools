import { PROJECT_STATUS } from '@configs/enum/db';

export class ProjectResponseDto {
  id: string;
  name: string;
  description?: string;
  tags?: string[];
  status: PROJECT_STATUS;
  start_date?: Date;
  end_date?: Date;
  owner: {
    id: string;
    email: string;
    first_name?: string;
    last_name?: string;
    fullName?: string;
  };
  created_at: Date;
  updated_at: Date;
  member_count?: number;
  invite_count?: number;
}

export class ProjectListResponseDto {
  data: ProjectResponseDto[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

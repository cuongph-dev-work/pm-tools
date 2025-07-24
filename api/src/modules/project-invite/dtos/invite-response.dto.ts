import { INVITE_STATUS, PROJECT_ROLE } from '@configs/enum/db';

export class InviteResponseDto {
  id: string;
  project: {
    id: string;
    name: string;
  };
  invited_by: {
    id: string;
    email: string;
    first_name?: string;
    last_name?: string;
    fullName?: string;
  };
  invited_email: string;
  role: PROJECT_ROLE;
  status: INVITE_STATUS;
  expired_at: Date;
  accepted_at?: Date;
  rejected_at?: Date;
  message?: string;
  created_at: Date;
}

export class InviteListResponseDto {
  data: InviteResponseDto[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

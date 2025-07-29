import { GIT_ALERT_PRIORITY, GIT_ALERT_STATUS, GIT_ALERT_TYPE } from '@configs/enum/db';

export class GitAlertResponseDto {
  id: string;
  title: string;
  description?: string;
  type: GIT_ALERT_TYPE;
  status: GIT_ALERT_STATUS;
  priority: GIT_ALERT_PRIORITY;
  branch?: string;
  commit_hash?: string;
  pull_request_number?: number;
  issue_number?: number;
  external_url?: string;
  is_actionable: boolean;
  action_required?: string;
  alert_timestamp: Date;
  read_at?: Date;
  created_at: Date;
  updated_at: Date;

  // Related entities
  repository: {
    id: string;
    name: string;
    full_name: string;
    provider: string;
  };

  project: {
    id: string;
    name: string;
  };

  triggered_by?: {
    id: string;
    email: string;
    first_name?: string;
    last_name?: string;
  };

  read_by?: {
    id: string;
    email: string;
    first_name?: string;
    last_name?: string;
  };

  created_by?: {
    id: string;
    email: string;
    first_name?: string;
    last_name?: string;
  };

  updated_by?: {
    id: string;
    email: string;
    first_name?: string;
    last_name?: string;
  };
}

export class GitAlertSummaryDto {
  total: number;
  unread: number;
  actionable: number;
  by_type: Record<GIT_ALERT_TYPE, number>;
  by_status: Record<GIT_ALERT_STATUS, number>;
  by_priority: Record<GIT_ALERT_PRIORITY, number>;
}

export class GitAlertListResponseDto {
  data: GitAlertResponseDto[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}

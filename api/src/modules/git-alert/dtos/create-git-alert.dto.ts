import { GIT_ALERT_PRIORITY, GIT_ALERT_TAG, GIT_ALERT_TYPE } from '@configs/enum/db';

export class CreateGitAlertDto {
  title: string;
  description?: string;
  type: GIT_ALERT_TYPE;
  priority?: GIT_ALERT_PRIORITY;
  tags?: GIT_ALERT_TAG[];
  metadata?: any;
  // branch?: string;
  // commit_hash?: string;
  // pull_request_number?: number;
  // issue_number?: number;
  // external_url?: string;
  // alert_timestamp: string;
  // repository_id: string;
}

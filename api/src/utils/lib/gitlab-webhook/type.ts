export interface WebhookOptions {
  secret: string;
}

// Union type cho tất cả GitLab event names
export type GitLabEventName = 'pipeline' | 'merge_request' | 'note' | 'push' | 'tag_push' | 'issue' | 'job' | 'deployment' | 'wiki_page' | 'release';

// Union type cho tất cả GitLab event payloads
export type GitLabEventPayload =
  | GitlabPipelineEvent
  | GitlabMergeRequestEvent
  | GitlabNoteEvent
  | GitlabPushEvent
  | GitlabTagPushEvent
  | GitlabIssueEvent
  | GitlabJobEvent
  | GitlabDeploymentEvent
  | GitlabWikiPageEvent
  | GitlabReleaseEvent;

export interface GitLabWebhookData {
  body: GitLabEventPayload;
  headers: WebhookGitLabHeaders;
  rawBody: Buffer;
}

export interface WebhookGitLabHeaders {
  'x-gitlab-event': string;
  'x-gitlab-token': string;
  'x-gitlab-event-uuid': string;
  'content-type': string;
}

export interface GitlabRepository {
  name: string;
  url: string;
  description: string;
  homepage: string;
}

export interface GitlabProject {
  id: number;
  name: string;
  description: string;
  web_url: string;
  avatar_url?: string;
  git_ssh_url: string;
  git_http_url: string;
  namespace: string;
  visibility_level: number;
  path_with_namespace: string;
  default_branch: string;
  ci_config_path?: string;
  homepage: string;
  url: string;
  ssh_url: string;
  http_url: string;
}

export interface GitlabUser {
  id: number;
  name: string;
  username: string;
  avatar_url: string;
  email?: string;
}

export interface GitlabCommit {
  id: string;
  message: string;
  title: string;
  timestamp: string;
  url: string;
  author: {
    name: string;
    email: string;
  };
}

export interface GitlabPipelineEvent {
  object_kind: 'pipeline';
  object_attributes: {
    id: number;
    iid: number;
    name: string | null;
    ref: string;
    tag: boolean;
    sha: string;
    before_sha: string;
    source: string;
    status: string;
    detailed_status: string;
    stages: string[];
    created_at: string;
    finished_at: string | null;
    duration: number | null;
    queued_duration: number | null;
    variables: any[];
    url: string;
  };
  merge_request: any | null;
  user: GitlabUser;
  project: GitlabProject;
  commit: GitlabCommit;
  builds: GitlabBuild[];
}

export interface GitlabBuild {
  id: number;
  stage: string;
  name: string;
  status: string;
  created_at: string;
  started_at: string | null;
  finished_at: string | null;
  duration: number | null;
  queued_duration: number | null;
  failure_reason: string | null;
  when: string;
  manual: boolean;
  allow_failure: boolean;
  user: GitlabUser;
  runner: any | null;
  artifacts_file: {
    filename: string | null;
    size: number | null;
  };
  environment: any | null;
}

export interface GitlabMergeRequestEvent {
  object_kind: 'merge_request';
  event_type: 'merge_request';
  user: GitlabUser;
  project: GitlabProject;
  object_attributes: {
    assignee_id?: number;
    author_id: number;
    created_at: string;
    description: string;
    draft: boolean;
    head_pipeline_id?: number;
    id: number;
    iid: number;
    last_edited_at?: string;
    last_edited_by_id?: number;
    merge_commit_sha?: string;
    merge_error?: string;
    merge_params: {
      force_remove_source_branch?: string;
    };
    merge_status: MergeStatus;
    merge_user_id?: number;
    merge_when_pipeline_succeeds: boolean;
    milestone_id?: number;
    source_branch: string;
    source_project_id: number;
    state_id: number;
    target_branch: string;
    target_project_id: number;
    time_estimate: number;
    title: string;
    updated_at: string;
    updated_by_id?: number;
    url: string;
    source: GitlabProject;
    target: GitlabProject;
    last_commit: GitlabCommit;
    work_in_progress: boolean;
    total_time_spent: number;
    time_change: number;
    human_total_time_spent?: string;
    human_time_change?: string;
    human_time_estimate?: string;
    assignee_ids: number[];
    reviewer_ids: number[];
    labels: string[];
    state: string;
    blocking_discussions_resolved: boolean;
    first_contribution: boolean;
    detailed_merge_status: DetailedMergeStatus;
    action: 'open' | 'close' | 'reopen' | 'update' | 'approved' | 'unapproved' | 'approval' | 'unapproval' | 'merge';
  };
  labels: string[];
  changes: Record<string, any>;
  repository: GitlabRepository;
  assignees?: GitlabUser[];
}

export interface GitlabNoteEvent {
  object_kind: 'note';
  event_type: 'note';
  user: GitlabUser;
  project_id: number;
  project: GitlabProject;
  object_attributes: {
    id: number;
    note: string;
    noteable_id: number;
    noteable_type: string; // 'MergeRequest', 'Issue', etc.
    created_at: string;
    updated_at: string;
    url: string;
    discussion_id?: string;
    type?: string; // 'DiffNote' nếu là inline comment
    line_code?: string;
    position?: any;
    original_position?: any;
    description?: string;
  };
  repository: GitlabRepository;
  merge_request?: GitlabMergeRequestEvent['object_attributes'];
  issue?: any;
}

export interface GitlabPushEvent {
  object_kind: 'push';
  event_name: 'push';
  user: GitlabUser;
  project: GitlabProject;
  repository: GitlabRepository;
  commits: GitlabCommit[];
  total_commits_count: number;
  ref: string; // branch name
  checkout_sha: string;
  before_sha: string;
  after_sha: string;
}

export interface GitlabTagPushEvent {
  object_kind: 'tag_push';
  event_name: 'tag_push';
  user: GitlabUser;
  project: GitlabProject;
  repository: GitlabRepository;
  commits: GitlabCommit[];
  total_commits_count: number;
  ref: string; // tag name
  checkout_sha: string;
  before_sha: string;
  after_sha: string;
}

export interface GitlabIssueEvent {
  object_kind: 'issue';
  event_type: 'issue';
  user: GitlabUser;
  project: GitlabProject;
  object_attributes: {
    id: number;
    title: string;
    description: string;
    state: string;
    created_at: string;
    updated_at: string;
    closed_at?: string;
    url: string;
    action: string;
    assignee_ids: number[];
    labels: string[];
  };
  repository: GitlabRepository;
  assignees?: GitlabUser[];
  labels?: string[];
}

export interface GitlabJobEvent {
  object_kind: 'job';
  user: GitlabUser;
  project: GitlabProject;
  commit: GitlabCommit;
  repository: GitlabRepository;
  object_attributes: {
    id: number;
    name: string;
    stage: string;
    status: string;
    created_at: string;
    started_at?: string;
    finished_at?: string;
    duration?: number;
    queued_duration?: number;
    failure_reason?: string;
    ref: string;
    tag: boolean;
    sha: string;
    before_sha: string;
    trace?: string;
    artifacts_file?: {
      filename: string;
      size: number;
    };
  };
}

export interface GitlabDeploymentEvent {
  object_kind: 'deployment';
  user: GitlabUser;
  project: GitlabProject;
  object_attributes: {
    id: number;
    ref: string;
    tag: boolean;
    sha: string;
    before_sha: string;
    environment: string;
    name: string;
    url: string;
    created_at: string;
    updated_at: string;
    status: string;
  };
  environment: {
    name: string;
    url: string;
    external_url?: string;
  };
  commit: GitlabCommit;
  repository: GitlabRepository;
}

export interface GitlabWikiPageEvent {
  object_kind: 'wiki_page';
  user: GitlabUser;
  project: GitlabProject;
  object_attributes: {
    title: string;
    content: string;
    format: string;
    message: string;
    slug: string;
    url: string;
    action: string;
    created_at: string;
    updated_at: string;
  };
  repository: GitlabRepository;
}

export interface GitlabReleaseEvent {
  object_kind: 'release';
  user: GitlabUser;
  project: GitlabProject;
  object_attributes: {
    id: number;
    name: string;
    tag_name: string;
    description: string;
    created_at: string;
    updated_at: string;
    url: string;
    action: string;
  };
  commit: GitlabCommit;
  repository: GitlabRepository;
}

export type MergeStatus = 'can_be_merged' | 'cannot_be_merged';
export type DetailedMergeStatus = 'mergeable' | 'conflict' | 'checking' | 'unstable' | 'blocked';

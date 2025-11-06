// Task types enum
export enum TASK_TYPE {
  TASK = "TASK",
  CHANGE_REQUEST = "CHANGE_REQUEST",
  FEEDBACK = "FEEDBACK",
  NEW_FEATURE = "NEW_FEATURE",
  SUB_TASK = "SUB_TASK",
  IMPROVEMENT = "IMPROVEMENT",
  BUG = "BUG",
  BUG_CUSTOMER = "BUG_CUSTOMER",
  LEAKAGE = "LEAKAGE",
}

// Task status enum - matches API validation requirements
export enum TASK_STATUS {
  OPEN = "OPEN",
  REOPEN = "REOPEN",
  IN_PROGRESS = "IN_PROGRESS",
  IN_REVIEW = "IN_REVIEW",
  RESOLVED = "RESOLVED",
  DONE = "DONE",
  PENDING = "PENDING",
  CANCELLED = "CANCELLED",
  // Legacy statuses for backward compatibility
  TODO = "TODO",
  BLOCKED = "BLOCKED",
}

// Task priority enum
export enum TASK_PRIORITY {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
}

// Task types từ API (backward compatibility)
export type TaskType = "task" | "bug" | "story" | "epic";
export type TaskStatus = "todo" | "in-progress" | "done" | "blocked" | "open";
export type TaskPriority = "high" | "medium" | "low";

// Tag DTO
export interface TagDTO {
  id?: string;
  name: string;
}

// User DTO
export interface UserDTO {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  fullName: string;
}

// Sprint DTO
export interface SprintDTO {
  id: string;
  name: string;
  description?: string;
  start_date?: string;
  end_date?: string;
}

// Create Task DTO
export interface CreateTaskDTO {
  title: string;
  description?: string;
  type: TASK_TYPE | string; // API accepts uppercase enum values
  status?: TaskStatus;
  priority?: TASK_PRIORITY | string; // API accepts uppercase enum values
  estimate?: number;
  due_date: string; // format: date (YYYY-MM-DD)
  assignee_id?: string;
  parent_task_id?: string;
  sprint_ids?: string[];
  tags: TagDTO[];
}

// Update Task DTO
export interface UpdateTaskDTO {
  title?: string;
  description?: string;
  type?: TaskType;
  status?: TaskStatus;
  priority?: TaskPriority;
  estimate?: number;
  due_date?: string;
  assignee_id?: string;
  parent_task_id?: string;
  sprint_ids?: string[];
  tags?: TagDTO[];
  clear_tags?: boolean;
  remove_tag_ids?: string[];
  clear_sprints?: boolean;
  remove_sprint_ids?: string[];
}

// Task Response DTO - matches API response format
export interface TaskDTO {
  id: string;
  title: string;
  description?: string | null;
  type: TASK_TYPE | string; // API returns uppercase enum values like "TASK"
  status: TASK_STATUS | string; // API returns uppercase enum values like "OPEN"
  priority?: TASK_PRIORITY | string | null; // API returns uppercase enum values like "MEDIUM"
  estimate?: number | null;
  due_date?: string | null; // ISO string format
  assignee?: UserDTO | null;
  sprints?: SprintDTO[] | null;
  project_id?: string; // Optional, may not be in response
  tags?: TagDTO[] | null;
  parent_task?: TaskDTO | null;
  sub_tasks?: TaskDTO[] | null;
  created_by?: UserDTO | null;
  updated_by?: UserDTO | null;
  created_at?: string | null; // ISO string format
  updated_at?: string | null; // ISO string format
  is_overdue?: boolean | null;
}

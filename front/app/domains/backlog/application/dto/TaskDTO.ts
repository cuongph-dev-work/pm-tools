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

// Task priority enum
export enum TASK_PRIORITY {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
}

// Task types từ API (backward compatibility)
export type TaskType = "task" | "bug" | "story" | "epic";
export type TaskStatus = "todo" | "in-progress" | "done" | "blocked";
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

// Task Response DTO
export interface TaskDTO {
  id: string;
  title: string;
  description?: string;
  type: TaskType;
  status: TaskStatus;
  priority?: TaskPriority;
  estimate?: number;
  due_date?: string;
  assignee?: UserDTO;
  sprints?: SprintDTO[];
  project_id: string;
  tags?: TagDTO[];
  parent_task?: TaskDTO;
  sub_tasks?: TaskDTO[];
  created_by?: UserDTO;
  updated_by?: UserDTO;
  created_at?: string;
  updated_at?: string;
  is_overdue?: boolean;
}

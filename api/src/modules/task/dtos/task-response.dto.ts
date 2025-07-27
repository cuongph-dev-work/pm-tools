import { TASK_PRIORITY, TASK_STATUS, TASK_TYPE } from '@configs/enum/db';

export class TagResponseDto {
  id: string;

  name: string;

  description?: string;
}

export class SprintResponseDto {
  id: string;

  name: string;

  description?: string;

  start_date?: string;

  end_date?: string;
}

export class UserResponseDto {
  id: string;

  email: string;

  first_name?: string;

  last_name?: string;

  fullName: string;
}

export class TaskResponseDto {
  id: string;

  title: string;

  description?: string;

  type: TASK_TYPE;

  status: TASK_STATUS;

  priority: TASK_PRIORITY;

  estimate?: number;

  due_date?: string;

  assignee?: UserResponseDto;

  sprints: SprintResponseDto[];

  project_id: string;

  tags: TagResponseDto[];

  parent_task?: TaskResponseDto;

  sub_tasks: TaskResponseDto[];

  created_by?: UserResponseDto;

  updated_by?: UserResponseDto;

  created_at: string;

  updated_at: string;
}

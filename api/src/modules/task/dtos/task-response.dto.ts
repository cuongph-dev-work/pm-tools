import { TASK_PRIORITY, TASK_STATUS, TASK_TYPE } from '@configs/enum/db';
import { Exclude, Expose, Transform, Type } from 'class-transformer';

@Exclude()
export class TagResponseDto {
  @Expose()
  id: string;

  @Expose()
  name: string;
}

@Exclude()
export class SprintResponseDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  description?: string;

  @Expose()
  start_date?: string;

  @Expose()
  end_date?: string;
}

@Exclude()
export class UserResponseDto {
  @Expose()
  id: string;

  @Expose()
  email: string;

  @Expose()
  first_name?: string;

  @Expose()
  last_name?: string;

  @Expose()
  fullName: string;
}

@Exclude()
export class TaskResponseDto {
  @Expose()
  id: string;

  @Expose()
  title: string;

  @Expose()
  description?: string;

  @Expose()
  type: TASK_TYPE;

  @Expose()
  status: TASK_STATUS;

  @Expose()
  priority: TASK_PRIORITY;

  @Expose()
  estimate?: number;

  @Expose()
  due_date?: string;

  @Expose()
  @Type(() => UserResponseDto)
  assignee?: UserResponseDto;

  @Expose()
  @Type(() => SprintResponseDto)
  sprints?: SprintResponseDto[];

  @Expose()
  project_id: string;

  @Expose()
  @Type(() => TagResponseDto)
  tags?: TagResponseDto[];

  @Expose()
  @Type(() => TaskResponseDto)
  parent_task?: TaskResponseDto;

  @Expose()
  @Type(() => TaskResponseDto)
  sub_tasks?: TaskResponseDto[];

  @Expose()
  @Type(() => UserResponseDto)
  created_by?: UserResponseDto;

  @Expose()
  @Type(() => UserResponseDto)
  updated_by?: UserResponseDto;

  @Expose()
  created_at: string;

  @Expose()
  updated_at: string;

  @Expose()
  @Transform(({ obj }) => obj.due_date && new Date(obj.due_date) < new Date())
  is_overdue: boolean;
}

import { TASK_PRIORITY, TASK_STATUS, TASK_TYPE } from '@configs/enum/db';
import { PaginationDto } from '@shared/dtos';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class SearchTaskDto extends PaginationDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(TASK_TYPE)
  type?: TASK_TYPE;

  @IsOptional()
  @IsEnum(TASK_STATUS)
  status?: TASK_STATUS;

  @IsOptional()
  @IsEnum(TASK_PRIORITY)
  priority?: TASK_PRIORITY;

  @IsOptional()
  @IsString()
  assignee_id?: string;

  @IsOptional()
  @IsString()
  sprint_id?: string;

  @IsOptional()
  @IsString()
  project_id?: string;

  @IsOptional()
  @IsString()
  tag_id?: string;

  @IsOptional()
  @IsString()
  parent_task_id?: string;
}

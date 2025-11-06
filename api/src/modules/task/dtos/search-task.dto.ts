import { TASK_PRIORITY, TASK_STATUS, TASK_TYPE } from '@configs/enum/db';
import { ArrayField } from '@decorators/validation/array.decorator';
import { EnumField } from '@decorators/validation/enum.decorator';
import { StringField } from '@decorators/validation/string.decorator';
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

export class SearchTaskInSprintDto {
  @StringField({
    isOptional: true,
  })
  keyword?: string;

  @EnumField(() => TASK_TYPE, {
    isOptional: true,
  })
  type?: TASK_TYPE;

  @EnumField(() => TASK_STATUS, {
    isOptional: true,
  })
  status?: TASK_STATUS;

  @EnumField(() => TASK_PRIORITY, {
    isOptional: true,
  })
  priority?: TASK_PRIORITY;
}

export class SearchTaskQueryDto {
  @StringField({
    isOptional: true,
  })
  keyword?: string;

  @EnumField(() => TASK_TYPE, {
    isOptional: true,
  })
  type?: TASK_TYPE;

  @EnumField(() => TASK_STATUS, {
    isOptional: true,
  })
  status?: TASK_STATUS;

  @EnumField(() => TASK_PRIORITY, {
    isOptional: true,
  })
  priority?: TASK_PRIORITY;

  @ArrayField(
    () =>
      StringField({
        isOptional: true,
        prefix: 'tag',
        each: true,
      }),
    {
      isOptional: true,
    },
  )
  tags?: string[];
}

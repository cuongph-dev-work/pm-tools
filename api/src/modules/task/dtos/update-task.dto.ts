import { TASK_PRIORITY, TASK_STATUS, TASK_TYPE } from '@configs/enum/db';
import { ArrayField } from '@decorators/validation/array.decorator';
import { BooleanField } from '@decorators/validation/boolean.decorator';
import { EnumField } from '@decorators/validation/enum.decorator';
import { NumberField } from '@decorators/validation/number.decorator';
import { StringField } from '@decorators/validation/string.decorator';

class TagDto {
  @StringField({
    prefix: 'tag',
  })
  name: string;

  @StringField({
    prefix: 'tag',
    isOptional: true,
  })
  id?: string;
}

export class UpdateTaskDto {
  @StringField({
    max: 255,
    prefix: 'task',
    isOptional: true,
  })
  title?: string;

  @StringField({
    max: 3000,
    isOptional: true,
    prefix: 'task',
  })
  description?: string;

  @EnumField(() => TASK_TYPE, {
    prefix: 'task',
    isOptional: true,
  })
  type?: TASK_TYPE;

  @EnumField(() => TASK_STATUS, {
    isOptional: true,
    prefix: 'task',
  })
  status?: TASK_STATUS;

  @EnumField(() => TASK_PRIORITY, {
    isOptional: true,
    prefix: 'task',
  })
  priority?: TASK_PRIORITY;

  @NumberField({
    min: 0,
    isOptional: true,
    prefix: 'task',
  })
  estimate?: number;

  @StringField({
    prefix: 'task',
    isDateString: true,
    isOptional: true,
  })
  due_date?: string;

  @StringField({
    isOptional: true,
    prefix: 'task',
  })
  assignee_id?: string;

  @StringField({
    isOptional: true,
    prefix: 'task',
  })
  parent_task_id?: string;

  @ArrayField(
    () =>
      StringField({
        isOptional: true,
        prefix: 'task',
        each: true,
      }),
    {
      isOptional: true,
    },
  )
  sprint_ids?: string[];

  @ArrayField(TagDto, {
    isOptional: true,
  })
  tags?: TagDto[];

  @BooleanField({
    isOptional: true,
    prefix: 'task',
  })
  clear_tags?: boolean;

  @ArrayField(
    () =>
      StringField({
        isOptional: true,
        prefix: 'task',
        each: true,
      }),
    {
      isOptional: true,
    },
  )
  remove_tag_ids?: string[];

  @BooleanField({
    isOptional: true,
    prefix: 'task',
  })
  clear_sprints?: boolean;

  @ArrayField(
    () =>
      StringField({
        isOptional: true,
        prefix: 'task',
        each: true,
      }),
    {
      isOptional: true,
    },
  )
  remove_sprint_ids?: string[];
}

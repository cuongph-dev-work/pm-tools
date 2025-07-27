import { TASK_PRIORITY, TASK_STATUS, TASK_TYPE } from '@configs/enum/db';
import { ArrayField } from '@decorators/validation/array.decorator';
import { EnumField } from '@decorators/validation/enum.decorator';
import { NumberField } from '@decorators/validation/number.decorator';
import { StringField } from '@decorators/validation/string.decorator';

export class CreateTaskDto {
  @StringField({
    max: 255,
    prefix: 'task',
  })
  title: string;

  @StringField({
    max: 3000,
    isOptional: true,
    prefix: 'task',
  })
  description?: string;

  @EnumField(() => TASK_TYPE, {
    prefix: 'task',
  })
  type: TASK_TYPE;

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
    isOptional: true,
    prefix: 'task',
    isDateString: true,
  })
  due_date?: string;

  @StringField({
    isOptional: true,
    prefix: 'task',
  })
  assignee_id?: string;

  @StringField({
    prefix: 'task',
  })
  project_id: string;

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
}

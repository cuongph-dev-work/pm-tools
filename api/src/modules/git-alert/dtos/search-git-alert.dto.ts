import { GIT_ALERT_PRIORITY, GIT_ALERT_STATUS, GIT_ALERT_TYPE } from '@configs/enum/db';
import { BooleanField } from '@decorators/validation/boolean.decorator';
import { EnumField } from '@decorators/validation/enum.decorator';
import { NumberField } from '@decorators/validation/number.decorator';
import { StringField } from '@decorators/validation/string.decorator';

export class SearchGitAlertDto {
  @StringField({
    isOptional: true,
    prefix: 'search',
  })
  search?: string;

  @EnumField(() => GIT_ALERT_TYPE, {
    isOptional: true,
    prefix: 'search',
  })
  type?: GIT_ALERT_TYPE;

  @EnumField(() => GIT_ALERT_STATUS, {
    isOptional: true,
    prefix: 'search',
  })
  status?: GIT_ALERT_STATUS;

  @EnumField(() => GIT_ALERT_PRIORITY, {
    isOptional: true,
    prefix: 'search',
  })
  priority?: GIT_ALERT_PRIORITY;

  @StringField({
    isOptional: true,
    prefix: 'search',
  })
  branch?: string;

  @StringField({
    isOptional: true,
    prefix: 'search',
  })
  repository_id?: string;

  @BooleanField({
    isOptional: true,
    prefix: 'search',
  })
  is_actionable?: boolean;

  @StringField({
    isOptional: true,
    prefix: 'search',
  })
  triggered_by_id?: string;

  @StringField({
    isOptional: true,
    prefix: 'search',
    isDateString: true,
  })
  from_date?: string;

  @StringField({
    isOptional: true,
    prefix: 'search',
    isDateString: true,
  })
  to_date?: string;

  @NumberField({
    min: 1,
    isOptional: true,
    prefix: 'search',
  })
  page?: number;

  @NumberField({
    min: 1,
    max: 100,
    isOptional: true,
    prefix: 'search',
  })
  limit?: number;
}

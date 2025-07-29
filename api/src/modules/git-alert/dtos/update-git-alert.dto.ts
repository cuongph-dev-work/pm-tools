import { GIT_ALERT_PRIORITY, GIT_ALERT_STATUS, GIT_ALERT_TYPE } from '@configs/enum/db';
import { BooleanField } from '@decorators/validation/boolean.decorator';
import { EnumField } from '@decorators/validation/enum.decorator';
import { NumberField } from '@decorators/validation/number.decorator';
import { StringField } from '@decorators/validation/string.decorator';

export class UpdateGitAlertDto {
  @StringField({
    max: 255,
    isOptional: true,
    prefix: 'git_alert',
  })
  title?: string;

  @StringField({
    max: 2000,
    isOptional: true,
    prefix: 'git_alert',
  })
  description?: string;

  @EnumField(() => GIT_ALERT_TYPE, {
    isOptional: true,
    prefix: 'git_alert',
  })
  type?: GIT_ALERT_TYPE;

  @EnumField(() => GIT_ALERT_STATUS, {
    isOptional: true,
    prefix: 'git_alert',
  })
  status?: GIT_ALERT_STATUS;

  @EnumField(() => GIT_ALERT_PRIORITY, {
    isOptional: true,
    prefix: 'git_alert',
  })
  priority?: GIT_ALERT_PRIORITY;

  @StringField({
    isOptional: true,
    prefix: 'git_alert',
  })
  branch?: string;

  @StringField({
    isOptional: true,
    prefix: 'git_alert',
  })
  commit_hash?: string;

  @NumberField({
    min: 1,
    isOptional: true,
    prefix: 'git_alert',
  })
  pull_request_number?: number;

  @NumberField({
    min: 1,
    isOptional: true,
    prefix: 'git_alert',
  })
  issue_number?: number;

  @StringField({
    isOptional: true,
    prefix: 'git_alert',
  })
  external_url?: string;

  @BooleanField({
    isOptional: true,
    prefix: 'git_alert',
  })
  is_actionable?: boolean;

  @StringField({
    isOptional: true,
    prefix: 'git_alert',
  })
  action_required?: string;
}

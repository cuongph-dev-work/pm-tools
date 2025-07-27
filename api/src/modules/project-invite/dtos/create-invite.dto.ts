import { PROJECT_ROLE } from '@configs/enum/db';
import { ArrayField } from '@decorators/validation/array.decorator';
import { EnumField } from '@decorators/validation/enum.decorator';
import { StringField } from '@decorators/validation/string.decorator';

export class CreateInviteDto {
  @ArrayField(() =>
    StringField({
      isEmail: true,
      max: 255,
      each: true,
      prefix: 'project_invite',
    }),
  )
  invited_email: string[];

  @EnumField(() => PROJECT_ROLE, {
    prefix: 'project_invite',
  })
  role: PROJECT_ROLE;

  @StringField({
    max: 1000,
    isOptional: true,
    prefix: 'project_invite',
  })
  message?: string;
}

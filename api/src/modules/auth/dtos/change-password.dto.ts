import { StringField } from '@decorators/validation/string.decorator';

export class ChangePasswordDto {
  @StringField({
    max: 255,
  })
  current_password: string;

  @StringField({
    max: 255,
    isPassword: true,
  })
  new_password: string;

  @StringField({
    max: 255,
    isSame: 'new_password',
  })
  new_password_confirmation: string;
}

import { StringField } from '@decorators/validation/string.decorator';

export class SetFirstPasswordDto {
  @StringField({
    max: 255,
  })
  token: string;

  @StringField({
    max: 255,
    isPassword: true,
  })
  password: string;
}

import { StringField } from '@decorators/validation/string.decorator';

export class UpdateUserDto {
  @StringField({
    max: 255,
  })
  first_name: string;

  @StringField({
    max: 255,
  })
  last_name: string;

  @StringField({
    isPhone: true,
    max: 13,
  })
  phone: string;
}

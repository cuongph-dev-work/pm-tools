import { ADMIN_ROLE } from '@configs/enum/user';
import { EnumField } from '@decorators/validation/enum.decorator';
import { StringField } from '@decorators/validation/string.decorator';

export class CreateUserDto {
  @StringField({
    isEmail: true,
    max: 255,
  })
  email: string;

  @StringField({
    isPassword: true,
    max: 255,
  })
  password: string;

  @StringField({
    max: 255,
  })
  first_name: string;

  @StringField({
    max: 255,
  })
  middle_name: string;

  @StringField({
    max: 255,
  })
  last_name: string;

  @StringField({
    isPhone: true,
    max: 13,
  })
  phone: string;

  @EnumField(() => ADMIN_ROLE, {
    isOptional: true,
  })
  role: ADMIN_ROLE;
}

import { StringField } from '@decorators/validation/string.decorator';

export enum TARGET_MODEL {
  USER = 'USER',
  ADMIN = 'ADMIN',
}
export class SignInDTO {
  @StringField({
    isEmail: true,
  })
  email: string;

  @StringField()
  password: string;
}

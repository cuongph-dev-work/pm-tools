import { StringField } from '@decorators/validation/string.decorator';

export class SignInDTO {
  @StringField({
    isEmail: true,
  })
  email: string;

  @StringField()
  password: string;
}

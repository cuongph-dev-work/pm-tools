import { StringField } from '@decorators/validation/string.decorator';

export class ResetPasswordDto {
  @StringField({
    isEmail: true,
    max: 255,
  })
  email: string;

  @StringField({
    max: 255,
    isUrl: true,
    urlOptions: {
      require_tld: false,
    },
  })
  redirect_url: string;
}

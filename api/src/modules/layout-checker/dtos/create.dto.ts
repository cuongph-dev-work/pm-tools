import { StringField } from '@decorators/validation/string.decorator';

export class CreateLayoutCheckerDto {
  @StringField({
    max: 2000,
  })
  figmaUrl: string;

  @StringField({
    max: 2000,
  })
  figmaToken: string;

  @StringField({
    max: 2000,
  })
  websiteUrl: string;
}

import { StringField } from '@decorators/validation/string.decorator';

export class CreateLayoutCheckerDto {
  @StringField({
    max: 2000,
  })
  figmaUrl: string;

  @StringField({
    max: 2000,
  })
  figmaFileKey: string;

  @StringField({
    max: 2000,
  })
  websiteUrl: string;
}

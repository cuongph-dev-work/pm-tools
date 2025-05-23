import { StringField } from '@decorators/validation/string.decorator';

export class GetFileDto {
  @StringField({
    isOptional: true,
  })
  quality: string;

  @StringField({
    isOptional: true,
  })
  fetch_format: string;

  @StringField({
    isOptional: true,
  })
  crop: string;

  @StringField({
    isOptional: true,
  })
  gravity: string;

  @StringField({
    isOptional: true,
    isNumberString: true,
  })
  width: string;

  @StringField({
    isOptional: true,
    isNumberString: true,
  })
  height: string;

  @StringField({
    isOptional: true,
  })
  aspect_ratio: string;
}

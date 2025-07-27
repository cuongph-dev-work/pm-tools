import { StringField } from '@decorators/validation/string.decorator';

export class SearchSprintDto {
  @StringField({ isOptional: true })
  keywords?: string;
}

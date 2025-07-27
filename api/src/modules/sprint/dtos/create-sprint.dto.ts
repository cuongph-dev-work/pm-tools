import { StringField } from '@decorators/validation/string.decorator';

export class CreateSprintDto {
  @StringField({ max: 255 })
  name!: string;

  @StringField({ max: 1000, isOptional: true })
  description?: string;

  @StringField({ isDateString: true })
  start_date!: string;

  @StringField({ isDateString: true })
  end_date!: string;
}

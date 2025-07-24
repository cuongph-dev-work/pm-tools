import { ArrayField } from '@decorators/validation/array.decorator';
import { StringField } from '@decorators/validation/string.decorator';

export class CreateProjectDto {
  @StringField({
    max: 255,
  })
  name: string;

  @StringField({
    max: 3000,
    isOptional: true,
  })
  description?: string;

  @ArrayField(String, {
    isOptional: true,
  })
  tags?: string[];

  @StringField({
    isOptional: true,
    isDateString: true,
  })
  start_date?: string;

  @StringField({
    isOptional: true,
    isDateString: true,
  })
  end_date?: string;
}

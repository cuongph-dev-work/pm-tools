import { ArrayField } from '@decorators/validation/array.decorator';
import { StringField } from '@decorators/validation/string.decorator';

export class CreateProjectDto {
  @StringField({
    max: 255,
    prefix: 'project',
  })
  name: string;

  @StringField({
    max: 3000,
    isOptional: true,
    prefix: 'project',
  })
  description?: string;

  @ArrayField(
    () => {
      return StringField({ isOnlyString: true, max: 50, each: true, prefix: 'project' });
    },
    {
      isOptional: true,
      prefix: 'project',
      min: 1,
      max: 10,
    },
  )
  tags?: string[];

  @StringField({
    isOptional: true,
    isDateString: true,
    prefix: 'project',
  })
  start_date?: string;

  @StringField({
    isOptional: true,
    isDateString: true,
    prefix: 'project',
  })
  end_date?: string;
}

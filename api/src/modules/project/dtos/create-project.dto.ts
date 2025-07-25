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

  @StringField({
    isOptional: true,
    prefix: 'project',
  })
  tags?: string;

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

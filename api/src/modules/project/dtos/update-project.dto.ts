import { PROJECT_STATUS } from '@configs/enum/db';
import { ArrayField } from '@decorators/validation/array.decorator';
import { EnumField } from '@decorators/validation/enum.decorator';
import { StringField } from '@decorators/validation/string.decorator';
import { IsOptional } from 'class-validator';

export class UpdateProjectDto {
  @IsOptional()
  @StringField({
    max: 255,
    isOptional: true,
    prefix: 'project',
  })
  name?: string;

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
      min: 0,
      max: 10,
    },
  )
  tags?: string[];

  @EnumField(() => PROJECT_STATUS, {
    isOptional: true,
    prefix: 'project',
  })
  status?: PROJECT_STATUS;

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

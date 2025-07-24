import { PROJECT_STATUS } from '@configs/enum/db';
import { EnumField } from '@decorators/validation/enum.decorator';
import { StringField } from '@decorators/validation/string.decorator';

export class SearchProjectDto {
  @StringField({
    max: 255,
    isOptional: true,
  })
  name?: string;

  @StringField({
    max: 255,
    isOptional: true,
  })
  description?: string;

  @EnumField(() => PROJECT_STATUS, {
    isOptional: true,
    prefix: 'project',
  })
  status?: PROJECT_STATUS;

  @StringField({
    max: 20,
    isOptional: true,
  })
  owner_id?: string;

  @StringField({
    max: 20,
    isOptional: true,
  })
  member_id?: string;

  @StringField({
    max: 10,
    isOptional: true,
  })
  page?: string;

  @StringField({
    max: 10,
    isOptional: true,
  })
  limit?: string;
}

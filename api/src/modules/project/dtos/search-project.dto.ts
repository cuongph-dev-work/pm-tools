import { PROJECT_STATUS } from '@configs/enum/db';
import { StringField } from '@decorators/validation/string.decorator';
import { Transform } from 'class-transformer';
import { IsArray, IsEnum, IsOptional } from 'class-validator';

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

  @IsOptional()
  @IsEnum(PROJECT_STATUS)
  status?: PROJECT_STATUS;

  @IsOptional()
  @IsArray()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.split(',').map((tag: string) => tag.trim());
    }
    return value;
  })
  tags?: string[];

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

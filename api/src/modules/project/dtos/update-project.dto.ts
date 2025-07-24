import { PROJECT_STATUS } from '@configs/enum/db';
import { StringField } from '@decorators/validation/string.decorator';
import { Transform } from 'class-transformer';
import { IsArray, IsDateString, IsEnum, IsOptional } from 'class-validator';

export class UpdateProjectDto {
  @IsOptional()
  @StringField({
    max: 255,
  })
  name?: string;

  @StringField({
    max: 3000,
    isOptional: true,
  })
  description?: string;

  @IsOptional()
  @IsArray()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.split(',').map((tag: string) => tag.trim());
    }
    return value;
  })
  tags?: string[];

  @IsOptional()
  @IsEnum(PROJECT_STATUS)
  status?: PROJECT_STATUS;

  @IsOptional()
  @IsDateString()
  start_date?: string;

  @IsOptional()
  @IsDateString()
  end_date?: string;
}

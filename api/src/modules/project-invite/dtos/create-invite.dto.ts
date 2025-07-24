import { PROJECT_ROLE } from '@configs/enum/db';
import { StringField } from '@decorators/validation/string.decorator';
import { IsEnum } from 'class-validator';

export class CreateInviteDto {
  @StringField({
    isEmail: true,
    max: 255,
  })
  invited_email: string;

  @IsEnum(PROJECT_ROLE)
  role: PROJECT_ROLE;

  @StringField({
    max: 1000,
    isOptional: true,
  })
  message?: string;
}

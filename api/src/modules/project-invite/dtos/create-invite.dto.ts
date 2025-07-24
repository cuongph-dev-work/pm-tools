import { StringField } from '@decorators/validation/string.decorator';
import { IsEnum } from 'class-validator';
import { PROJECT_ROLE } from '../../../database/entities/project-member.entity';

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

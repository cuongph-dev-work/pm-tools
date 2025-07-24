import { INVITE_STATUS } from '@configs/enum/db';
import { IsEnum } from 'class-validator';

export class RespondInviteDto {
  @IsEnum(INVITE_STATUS)
  action: INVITE_STATUS;
}

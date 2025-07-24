import { INVITE_STATUS } from '@entities/project-invite-member.entity';
import { IsEnum } from 'class-validator';

export class RespondInviteDto {
  @IsEnum(INVITE_STATUS)
  action: 'ACCEPT' | 'REJECT';
}

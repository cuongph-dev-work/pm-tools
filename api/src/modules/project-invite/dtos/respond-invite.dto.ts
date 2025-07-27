import { INVITE_STATUS } from '@configs/enum/db';
import { EnumField } from '@decorators/validation/enum.decorator';

export class RespondInviteDto {
  @EnumField(() => INVITE_STATUS, {
    prefix: 'project_invite',
  })
  action: INVITE_STATUS;
}

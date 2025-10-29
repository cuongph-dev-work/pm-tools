import { USER_ROLE } from '@configs/enum/db';
import { CurrentUser } from '@decorators/current-user.decorator';
import { Roles } from '@decorators/role.decorator';
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { User } from '../../database/entities/user.entity';
import { CreateInviteDto, RespondInviteDto } from './dtos';
import { ProjectInviteService } from './project-invite.service';

@Controller('project-invites')
export class ProjectInviteController {
  constructor(private readonly projectInviteService: ProjectInviteService) {}

  @Roles([USER_ROLE.ADMIN, USER_ROLE.PM])
  @Post('/projects/:projectId/invites')
  createInvite(@Param('projectId') projectId: string, @Body() body: CreateInviteDto, @CurrentUser() currentUser: User) {
    return this.projectInviteService.createInvite(projectId, body, currentUser);
  }

  @Roles([USER_ROLE.ADMIN, USER_ROLE.PM])
  @Get('/projects/:projectId/members')
  getMembersByProject(@Param('projectId') projectId: string) {
    return this.projectInviteService.findMembersByProject(projectId);
  }

  @Roles([])
  @Get('/my-invites')
  getMyInvites(@CurrentUser() currentUser: User) {
    return this.projectInviteService.findMyInvites(currentUser);
  }

  @Roles([])
  @Get('/invites/token/:token')
  getInviteByToken(@Param('token') token: string) {
    return this.projectInviteService.findInviteByToken(token);
  }

  @Roles([])
  @Post('/invites/:token/respond')
  respondToInvite(@Param('token') token: string, @Body() body: RespondInviteDto, @CurrentUser() currentUser: User) {
    return this.projectInviteService.respondToInvite(token, body, currentUser);
  }

  // @Roles([USER_ROLE.ADMIN, USER_ROLE.PM])
  // @Put('/invites/:id/resend')
  // resendInvite(@Param('id') id: string, @CurrentUser() currentUser: User) {
  //   return this.projectInviteService.resendInvite(id, currentUser);
  // }

  // @Roles([USER_ROLE.ADMIN, USER_ROLE.PM])
  // @HttpCode(HttpStatus.NO_CONTENT)
  // @Delete('/invites/:id')
  // cancelInvite(@Param('id') id: string, @CurrentUser() currentUser: User) {
  //   return this.projectInviteService.cancelInvite(id, currentUser);
  // }

  // @Roles([])
  // @Post('/cleanup-expired')
  // cleanupExpiredInvites() {
  //   return this.projectInviteService.cleanupExpiredInvites();
  // }
}

import { ProjectInviteMember } from '@entities/project-invite-member.entity';
import { ProjectMember } from '@entities/project-member.entity';
import { Project } from '@entities/project.entity';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { ProjectRepository } from '@modules/project/project.repository';
import { Module } from '@nestjs/common';
import { ProjectInviteController } from './project-invite.controller';
import { ProjectInviteRepository } from './project-invite.repository';
import { ProjectInviteService } from './project-invite.service';
import { ProjectMemberRepository } from './project-member.repository';

@Module({
  imports: [MikroOrmModule.forFeature([ProjectInviteMember, Project, ProjectMember])],
  controllers: [ProjectInviteController],
  providers: [
    ProjectInviteService,
    ProjectInviteRepository,
    ProjectRepository,
    ProjectMemberRepository,
  ],
  exports: [ProjectInviteService, ProjectInviteRepository],
})
export class ProjectInviteModule {}

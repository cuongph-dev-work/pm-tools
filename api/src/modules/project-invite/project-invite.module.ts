import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { ProjectInviteMember } from '../../database/entities/project-invite-member.entity';
import { ProjectMember } from '../../database/entities/project-member.entity';
import { Project } from '../../database/entities/project.entity';
import { ProjectInviteController } from './project-invite.controller';
import { ProjectInviteRepository } from './project-invite.repository';
import { ProjectInviteService } from './project-invite.service';

@Module({
  imports: [MikroOrmModule.forFeature([ProjectInviteMember, Project, ProjectMember])],
  controllers: [ProjectInviteController],
  providers: [ProjectInviteService, ProjectInviteRepository],
  exports: [ProjectInviteService],
})
export class ProjectInviteModule {}

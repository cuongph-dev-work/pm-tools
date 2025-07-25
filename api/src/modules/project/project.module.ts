import { ProjectInviteMember } from '@entities/project-invite-member.entity';
import { ProjectMember } from '@entities/project-member.entity';
import { Project } from '@entities/project.entity';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { ProjectInviteRepository } from '@modules/project-invite/project-invite.repository';
import { UserModule } from '@modules/user/user.module';
import { Module } from '@nestjs/common';
import { ProjectController } from './project.controller';
import { ProjectRepository } from './project.repository';
import { ProjectService } from './project.service';

@Module({
  imports: [MikroOrmModule.forFeature([ProjectInviteMember, Project, ProjectMember]), UserModule],
  controllers: [ProjectController],
  providers: [ProjectService, ProjectRepository, ProjectInviteRepository],
  exports: [ProjectService],
})
export class ProjectModule {}

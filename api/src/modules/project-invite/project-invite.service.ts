import { User } from '@entities/user.entity';
import { ProjectRepository } from '@modules/project/project.repository';
import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { generateToken } from '@utils/helper';
import { I18nService } from 'nestjs-i18n';
import { WrapperType } from 'src/types/request.type';
import { CreateInviteDto } from './dtos';
import { ProjectInviteRepository } from './project-invite.repository';
import { ProjectMemberRepository } from './project-member.repository';

@Injectable()
export class ProjectInviteService {
  private readonly logger = new Logger(ProjectInviteService.name);
  constructor(
    @Inject(forwardRef(() => ProjectInviteRepository))
    private readonly projectInviteRepository: WrapperType<ProjectInviteRepository>,
    @Inject(forwardRef(() => ProjectRepository))
    private readonly projectRepository: WrapperType<ProjectRepository>,
    @Inject(forwardRef(() => ProjectMemberRepository))
    private readonly projectMemberRepository: WrapperType<ProjectMemberRepository>,
    private readonly i18n: I18nService,
  ) {}

  private async checkUserIsAlreadyMember(projectId: string, email: string) {
    const existingMember = await this.projectMemberRepository.findMemberByEmail(projectId, email);
    if (existingMember) {
      throw new BadRequestException(this.i18n.t('message.user_already_member'));
    }
  }

  private async checkUserIsAlreadyInvited(projectId: string, email: string) {
    const existingInvite = await this.projectInviteRepository.findPendingInviteByEmail(
      projectId,
      email,
    );

    if (existingInvite) {
      throw new BadRequestException(this.i18n.t('message.invitation_already_sent'));
    }
  }

  async createInvite(projectId: string, createInviteDto: CreateInviteDto, currentUser: User) {
    // Check if project exists
    const project = await this.projectRepository.findOne({ id: projectId });
    if (!project) {
      throw new NotFoundException(this.i18n.t('project_not_found'));
    }

    // Check if user has permission to invite (owner or project manager)
    const isOwner = project.owner.id === currentUser.id;
    if (!isOwner) {
      throw new ForbiddenException(this.i18n.t('project_invite_permission_denied'));
    }

    // Check if user is already a member or already invited to this project, let throw error if so
    for (const email of createInviteDto.invited_email) {
      await this.checkUserIsAlreadyMember(projectId, email);
      await this.checkUserIsAlreadyInvited(projectId, email);
    }

    const invites = createInviteDto.invited_email.map((email: string) => ({
      project,
      invited_by: currentUser,
      invited_email: email,
      role: createInviteDto.role,
      message: createInviteDto.message,
      token: generateToken(64),
      expired_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    }));

    // Use MikroORM's persistAndFlush for batch insert with proper entity handling
    const inviteEntities = invites.map(invite => this.projectInviteRepository.create(invite));
    await this.projectInviteRepository.getEntityManager().persistAndFlush(inviteEntities);

    return {
      invited_emails: createInviteDto.invited_email,
    };
  }

  // async findInviteById(id: string) {
  //   const invite = await this.projectInviteRepository.findOne(
  //     { id },
  //     {
  //       populate: ['project', 'invited_by'],
  //     },
  //   );

  //   if (!invite) {
  //     throw new NotFoundException(this.i18n.t('projectInvite.invitationNotFound'));
  //   }

  //   return plainToInstance(InviteResponseDto, invite);
  // }

  // async findInviteByToken(token: string) {
  //   const invite = await this.projectInviteRepository.findInviteByToken(token);

  //   if (!invite) {
  //     throw new NotFoundException(this.i18n.t('projectInvite.invalidInvitationToken'));
  //   }

  //   // Check if invite is expired
  //   if (invite.expired_at < new Date()) {
  //     throw new BadRequestException(this.i18n.t('projectInvite.invitationExpired'));
  //   }

  //   return plainToInstance(InviteResponseDto, invite);
  // }

  // async findInvitesByProject(projectId: string, currentUser: User) {
  //   // Check if user has access to project
  //   const project = await this.em.findOne(Project, { id: projectId });
  //   if (!project) {
  //     throw new NotFoundException(this.i18n.t('project_not_found'));
  //   }

  //   const isOwner = project.owner.id === currentUser.id;
  //   const isMember = await this.em.findOne(ProjectMember, {
  //     project: projectId,
  //     user: currentUser.id,
  //     status: MEMBER_STATUS.ACTIVE,
  //   });

  //   if (!isOwner && !isMember) {
  //     throw new ForbiddenException(this.i18n.t('projectInvite.accessDenied'));
  //   }

  //   return this.projectInviteRepository.findInvitesByProject(projectId);
  // }

  // async findMyInvites(currentUser: User) {
  //   return this.projectInviteRepository.findInvitesByEmail(currentUser.email);
  // }

  // async findPendingInvites(currentUser: User) {
  //   return this.projectInviteRepository.findPendingInvitesByEmail(currentUser.email);
  // }

  // async respondToInvite(token: string, respondInviteDto: RespondInviteDto, currentUser: User) {
  //   const invite = await this.findInviteByToken(token);

  //   // Check if invite is for current user
  //   if (invite.invited_email !== currentUser.email) {
  //     throw new ForbiddenException(this.i18n.t('projectInvite.invitationNotForYou'));
  //   }

  //   // Check if invite is still pending
  //   if (invite.status !== INVITE_STATUS.PENDING) {
  //     throw new BadRequestException(this.i18n.t('projectInvite.invitationAlreadyResponded'));
  //   }

  //   if (respondInviteDto.action === INVITE_STATUS.ACCEPTED) {
  //     // Add user to project members
  //     const member = new ProjectMember();
  //     member.project = invite.project;
  //     member.user = currentUser;
  //     member.role = invite.role;
  //     member.status = MEMBER_STATUS.ACTIVE;

  //     await this.em.persistAndFlush(member);

  //     // Update invite status
  //     invite.status = INVITE_STATUS.ACCEPTED;
  //     invite.accepted_at = new Date();
  //   } else {
  //     // Update invite status to rejected
  //     invite.status = INVITE_STATUS.REJECTED;
  //     invite.rejected_at = new Date();
  //   }

  //   await this.em.persistAndFlush(invite);

  //   return {
  //     message: this.i18n.t(`projectInvite.invitation${respondInviteDto.action.toLowerCase()}ed`),
  //   };
  // }

  // async cancelInvite(inviteId: string, currentUser: User) {
  //   const invite = await this.findInviteById(inviteId);

  //   // Check if user has permission to cancel invite
  //   const isOwner = invite.project.owner.id === currentUser.id;
  //   const isInviter = invite.invited_by.id === currentUser.id;

  //   if (!isOwner && !isInviter) {
  //     throw new ForbiddenException(this.i18n.t('projectInvite.canOnlyCancelSentInvitations'));
  //   }

  //   // Check if invite is still pending
  //   if (invite.status !== INVITE_STATUS.PENDING) {
  //     throw new BadRequestException(this.i18n.t('projectInvite.canOnlyCancelPendingInvitations'));
  //   }

  //   await this.em.removeAndFlush(invite);

  //   return { message: this.i18n.t('projectInvite.invitationCancelled') };
  // }

  // async resendInvite(inviteId: string, currentUser: User) {
  //   const invite = await this.findInviteById(inviteId);

  //   // Check if user has permission to resend invite
  //   const isOwner = invite.project.owner.id === currentUser.id;
  //   const isInviter = invite.invited_by.id === currentUser.id;

  //   if (!isOwner && !isInviter) {
  //     throw new ForbiddenException(this.i18n.t('projectInvite.canOnlyResendSentInvitations'));
  //   }

  //   // Check if invite is still pending
  //   if (invite.status !== INVITE_STATUS.PENDING) {
  //     throw new BadRequestException(this.i18n.t('projectInvite.canOnlyResendPendingInvitations'));
  //   }

  //   // Generate new token and extend expiration
  //   invite.token = this.generateInviteToken();
  //   invite.expired_at = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

  //   await this.em.persistAndFlush(invite);

  //   return this.findInviteById(invite.id);
  // }

  // async cleanupExpiredInvites() {
  //   const expiredInvites = await this.projectInviteRepository.findExpiredInvites();

  //   for (const invite of expiredInvites) {
  //     invite.status = INVITE_STATUS.EXPIRED;
  //   }

  //   await this.em.persistAndFlush(expiredInvites);

  //   return {
  //     message: this.i18n.t('projectInvite.expiredInvitationsUpdated', {
  //       count: expiredInvites.length,
  //     }),
  //   };
  // }
}

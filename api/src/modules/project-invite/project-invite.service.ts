import { INVITE_STATUS, ProjectInviteMember } from '@entities/project-invite-member.entity';
import { MEMBER_STATUS, PROJECT_ROLE, ProjectMember } from '@entities/project-member.entity';
import { Project } from '@entities/project.entity';
import { User } from '@entities/user.entity';
import { EntityManager } from '@mikro-orm/core';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as crypto from 'crypto';
import { CreateInviteDto, RespondInviteDto } from './dtos';
import { ProjectInviteRepository } from './project-invite.repository';

@Injectable()
export class ProjectInviteService {
  constructor(
    private readonly projectInviteRepository: ProjectInviteRepository,
    private readonly em: EntityManager,
  ) {}

  async createInvite(projectId: string, createInviteDto: CreateInviteDto, currentUser: User) {
    // Check if project exists
    const project = await this.em.findOne(Project, { id: projectId });
    if (!project) {
      throw new NotFoundException('Project not found');
    }

    // Check if user has permission to invite (owner or project manager)
    const isOwner = project.owner.id === currentUser.id;
    const isProjectManager = await this.em.findOne(ProjectMember, {
      project: projectId,
      user: currentUser.id,
      role: PROJECT_ROLE.PROJECT_MANAGER,
      status: MEMBER_STATUS.ACTIVE,
    });

    if (!isOwner && !isProjectManager) {
      throw new ForbiddenException('You do not have permission to invite members to this project');
    }

    // Check if user is already a member
    const existingMember = await this.em.findOne(ProjectMember, {
      project: projectId,
      user: { email: createInviteDto.invited_email },
    });

    if (existingMember) {
      throw new BadRequestException('User is already a member of this project');
    }

    // Check if there's already a pending invite for this email
    const existingInvite = await this.em.findOne(ProjectInviteMember, {
      project: projectId,
      invited_email: createInviteDto.invited_email,
      status: INVITE_STATUS.PENDING,
    });

    if (existingInvite) {
      throw new BadRequestException('An invitation has already been sent to this email');
    }

    // Create invite
    const invite = new ProjectInviteMember();
    invite.project = project;
    invite.invited_by = currentUser;
    invite.invited_email = createInviteDto.invited_email;
    invite.role = createInviteDto.role;
    invite.message = createInviteDto.message;
    invite.token = this.generateInviteToken();
    invite.expired_at = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    await this.em.persistAndFlush(invite);

    return this.findInviteById(invite.id);
  }

  async findInviteById(id: string) {
    const invite = await this.projectInviteRepository.findOne(
      { id },
      {
        populate: ['project', 'invited_by'],
      },
    );

    if (!invite) {
      throw new NotFoundException('Invitation not found');
    }

    return invite;
  }

  async findInviteByToken(token: string) {
    const invite = await this.projectInviteRepository.findInviteByToken(token);

    if (!invite) {
      throw new NotFoundException('Invalid invitation token');
    }

    // Check if invite is expired
    if (invite.expired_at < new Date()) {
      throw new BadRequestException('Invitation has expired');
    }

    return invite;
  }

  async findInvitesByProject(projectId: string, currentUser: User) {
    // Check if user has access to project
    const project = await this.em.findOne(Project, { id: projectId });
    if (!project) {
      throw new NotFoundException('Project not found');
    }

    const isOwner = project.owner.id === currentUser.id;
    const isMember = await this.em.findOne(ProjectMember, {
      project: projectId,
      user: currentUser.id,
      status: MEMBER_STATUS.ACTIVE,
    });

    if (!isOwner && !isMember) {
      throw new ForbiddenException('You do not have access to this project');
    }

    return this.projectInviteRepository.findInvitesByProject(projectId);
  }

  async findMyInvites(currentUser: User) {
    return this.projectInviteRepository.findInvitesByEmail(currentUser.email);
  }

  async findPendingInvites(currentUser: User) {
    return this.projectInviteRepository.findPendingInvitesByEmail(currentUser.email);
  }

  async respondToInvite(token: string, respondInviteDto: RespondInviteDto, currentUser: User) {
    const invite = await this.findInviteByToken(token);

    // Check if invite is for current user
    if (invite.invited_email !== currentUser.email) {
      throw new ForbiddenException('This invitation is not for you');
    }

    // Check if invite is still pending
    if (invite.status !== INVITE_STATUS.PENDING) {
      throw new BadRequestException('Invitation has already been responded to');
    }

    if (respondInviteDto.action === 'ACCEPT') {
      // Add user to project members
      const member = new ProjectMember();
      member.project = invite.project;
      member.user = currentUser;
      member.role = invite.role;
      member.status = MEMBER_STATUS.ACTIVE;

      await this.em.persistAndFlush(member);

      // Update invite status
      invite.status = INVITE_STATUS.ACCEPTED;
      invite.accepted_at = new Date();
    } else {
      // Update invite status to rejected
      invite.status = INVITE_STATUS.REJECTED;
      invite.rejected_at = new Date();
    }

    await this.em.persistAndFlush(invite);

    return {
      message: `Invitation ${respondInviteDto.action.toLowerCase()}ed successfully`,
    };
  }

  async cancelInvite(inviteId: string, currentUser: User) {
    const invite = await this.findInviteById(inviteId);

    // Check if user has permission to cancel invite
    const isOwner = invite.project.owner.id === currentUser.id;
    const isInviter = invite.invited_by.id === currentUser.id;

    if (!isOwner && !isInviter) {
      throw new ForbiddenException('You can only cancel invitations you sent');
    }

    // Check if invite is still pending
    if (invite.status !== INVITE_STATUS.PENDING) {
      throw new BadRequestException('Can only cancel pending invitations');
    }

    await this.em.removeAndFlush(invite);

    return { message: 'Invitation cancelled successfully' };
  }

  async resendInvite(inviteId: string, currentUser: User) {
    const invite = await this.findInviteById(inviteId);

    // Check if user has permission to resend invite
    const isOwner = invite.project.owner.id === currentUser.id;
    const isInviter = invite.invited_by.id === currentUser.id;

    if (!isOwner && !isInviter) {
      throw new ForbiddenException('You can only resend invitations you sent');
    }

    // Check if invite is still pending
    if (invite.status !== INVITE_STATUS.PENDING) {
      throw new BadRequestException('Can only resend pending invitations');
    }

    // Generate new token and extend expiration
    invite.token = this.generateInviteToken();
    invite.expired_at = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    await this.em.persistAndFlush(invite);

    return this.findInviteById(invite.id);
  }

  async cleanupExpiredInvites() {
    const expiredInvites = await this.projectInviteRepository.findExpiredInvites();

    for (const invite of expiredInvites) {
      invite.status = INVITE_STATUS.EXPIRED;
    }

    await this.em.persistAndFlush(expiredInvites);

    return { message: `${expiredInvites.length} expired invitations updated` };
  }

  private generateInviteToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }
}

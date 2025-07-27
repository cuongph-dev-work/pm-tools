import { INVITE_STATUS } from '@configs/enum/db';
import { ProjectInviteMember } from '@entities/project-invite-member.entity';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ProjectInviteRepository extends EntityRepository<ProjectInviteMember> {
  constructor(em: EntityManager) {
    super(em, ProjectInviteMember);
  }

  async findInviteByToken(token: string) {
    return this.findOne(
      { token },
      {
        populate: ['project', 'invited_by'],
      },
    );
  }

  async findInvitesByProject(projectId: string) {
    return this.find(
      { project: projectId },
      {
        populate: ['invited_by'],
        orderBy: { created_at: 'DESC' },
      },
    );
  }

  async findInvitesByEmail(email: string) {
    return this.find(
      { invited_email: email },
      {
        populate: ['project', 'invited_by'],
        orderBy: { created_at: 'DESC' },
      },
    );
  }

  async findPendingInvitesByEmail(email: string) {
    return this.find(
      {
        invited_email: email,
        status: INVITE_STATUS.PENDING,
        expired_at: { $gt: new Date() },
      },
      {
        populate: ['project', 'invited_by'],
        orderBy: { created_at: 'DESC' },
      },
    );
  }

  async findExpiredInvites() {
    return this.find({
      status: INVITE_STATUS.PENDING,
      expired_at: { $lte: new Date() },
    });
  }

  async updateInviteStatus(id: string, status: INVITE_STATUS) {
    const invite = await this.findOne({ id });
    if (!invite) {
      return null;
    }

    invite.status = status;

    if (status === INVITE_STATUS.ACCEPTED) {
      invite.accepted_at = new Date();
    } else if (status === INVITE_STATUS.REJECTED) {
      invite.rejected_at = new Date();
    }

    await this.em.persistAndFlush(invite);
    return invite;
  }

  async findPendingInviteByEmail(projectId: string, email: string) {
    return this.findOne({
      project: projectId,
      invited_email: email,
      status: INVITE_STATUS.PENDING,
      expired_at: { $gt: new Date() },
    });
  }

  async findPendingInviteByProject(projectId: string) {
    return this.find({
      project: projectId,
      status: INVITE_STATUS.PENDING,
      expired_at: { $gt: new Date() },
    });
  }
}

import type { ProjectId, ProjectOwner, ProjectStatus } from "./types";

export interface ProjectListItemProps {
  id: ProjectId;
  name: string;
  description?: string;
  tags?: string[];
  status: ProjectStatus;
  startDate?: string | null;
  endDate?: string | null;
  owner: ProjectOwner;
  createdAt: string;
  updatedAt: string;
  memberCount?: number;
  inviteCount?: number;
}

// Entity for list items (with member_count and invite_count)
export class ProjectListItemEntity {
  readonly id: ProjectId;
  readonly name: string;
  readonly description?: string;
  readonly tags: string[];
  readonly status: ProjectStatus;
  readonly startDate?: string | null;
  readonly endDate?: string | null;
  readonly owner: ProjectOwner;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly memberCount: number;
  readonly inviteCount: number;

  constructor(props: ProjectListItemProps) {
    this.id = props.id;
    this.name = props.name;
    this.description = props.description;
    this.tags = props.tags ?? [];
    this.status = props.status;
    this.startDate = props.startDate ?? undefined;
    this.endDate = props.endDate ?? undefined;
    this.owner = props.owner;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
    this.memberCount = props.memberCount ?? 0;
    this.inviteCount = props.inviteCount ?? 0;
  }

  toJSON(): ProjectListItemProps {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      tags: this.tags,
      status: this.status,
      startDate: this.startDate,
      endDate: this.endDate,
      owner: this.owner,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      memberCount: this.memberCount,
      inviteCount: this.inviteCount,
    };
  }
}

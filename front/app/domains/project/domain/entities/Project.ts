export type ProjectId = string;

export type ProjectStatus = "ACTIVE" | "INACTIVE" | "COMPLETED" | "CANCELLED";

export interface ProjectOwner {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
}

export interface ProjectProps {
  id: ProjectId;
  name: string;
  description?: string;
  tags?: string[];
  status: ProjectStatus;
  startDate?: string;
  endDate?: string;
  owner: ProjectOwner;
  createdAt: string;
  updatedAt: string;
  memberCount?: number;
  inviteCount?: number;
}

export class ProjectEntity {
  readonly id: ProjectId;
  readonly name: string;
  readonly description?: string;
  readonly tags: string[];
  readonly status: ProjectStatus;
  readonly startDate?: string;
  readonly endDate?: string;
  readonly owner: ProjectOwner;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly memberCount: number;
  readonly inviteCount: number;

  constructor(props: ProjectProps) {
    this.id = props.id;
    this.name = props.name;
    this.description = props.description;
    this.tags = props.tags ?? [];
    this.status = props.status;
    this.startDate = props.startDate;
    this.endDate = props.endDate;
    this.owner = props.owner;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
    this.memberCount = props.memberCount ?? 0;
    this.inviteCount = props.inviteCount ?? 0;
  }

  toJSON(): ProjectProps {
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

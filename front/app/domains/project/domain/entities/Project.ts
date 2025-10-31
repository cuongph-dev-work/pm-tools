export type ProjectId = string;

export interface ProjectTag {
  label: string;
  color?: "blue" | "red" | "green" | "yellow" | "purple" | "orange" | string;
}

export interface ProjectMember {
  id: string;
  name: string;
  email: string;
  role: string;
  isOwner?: boolean;
  joinedAt?: string;
  avatarUrl?: string;
}

export interface ProjectProps {
  id: ProjectId;
  name: string;
  description?: string;
  tags?: ProjectTag[];
  memberCount?: number;
  startDate?: string;
  endDate?: string;
  members?: ProjectMember[];
}

export class ProjectEntity {
  readonly id: ProjectId;
  readonly name: string;
  readonly description?: string;
  readonly tags: ProjectTag[];
  readonly memberCount: number;
  readonly startDate?: string;
  readonly endDate?: string;
  readonly members: ProjectMember[];

  constructor(props: ProjectProps) {
    this.id = props.id;
    this.name = props.name;
    this.description = props.description;
    this.tags = props.tags ?? [];
    this.memberCount = props.memberCount ?? props.members?.length ?? 0;
    this.startDate = props.startDate;
    this.endDate = props.endDate;
    this.members = props.members ?? [];
  }
}

import type { MemberDTO } from "../../application/dto/MemberDTO";
import { ProjectEntity } from "../entities/Project";
import { ProjectListItemEntity } from "../entities/ProjectListItem";
import type { ProjectId } from "../entities/types";

export interface CreateProjectData {
  name: string;
  description?: string;
  tags?: string;
  startDate?: string;
  endDate?: string;
}

export interface UpdateProjectData {
  name?: string;
  description?: string;
  tags?: string;
  status?: "ACTIVE" | "INACTIVE" | "COMPLETED" | "CANCELLED";
  startDate?: string;
  endDate?: string;
}

export interface ProjectFilters {
  name?: string;
  description?: string;
  status?: string;
  ownerId?: string;
  memberId?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedProjects {
  data: ProjectListItemEntity[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ProjectRepository {
  findAll(filters?: ProjectFilters): Promise<PaginatedProjects>;
  findById(id: ProjectId): Promise<ProjectEntity | null>;
  findMemberOf(): Promise<ProjectListItemEntity[]>;
  getMembers(projectId: ProjectId): Promise<MemberDTO[]>;
  searchMembers(projectId: ProjectId, keyword: string): Promise<MemberDTO[]>;
  create(data: CreateProjectData): Promise<string>;
  update(id: ProjectId, data: UpdateProjectData): Promise<string>;
  delete(id: ProjectId): Promise<{ success: boolean }>;
}

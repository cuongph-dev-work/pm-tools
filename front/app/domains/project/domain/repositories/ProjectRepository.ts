import { ProjectEntity, type ProjectId } from "../entities/Project";

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
  data: ProjectEntity[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ProjectRepository {
  findAll(filters?: ProjectFilters): Promise<PaginatedProjects>;
  findById(id: ProjectId): Promise<ProjectEntity | null>;
  findMemberOf(): Promise<ProjectEntity[]>;
  create(data: CreateProjectData): Promise<ProjectEntity>;
  update(id: ProjectId, data: UpdateProjectData): Promise<ProjectEntity>;
  delete(id: ProjectId): Promise<void>;
}

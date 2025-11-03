import type {
  ProjectRepository,
  CreateProjectData,
  UpdateProjectData,
  ProjectFilters,
  PaginatedProjects,
} from "~/domains/project/domain/repositories/ProjectRepository";
import type { ProjectId } from "~/domains/project/domain/entities/Project";
import { ProjectEntity } from "~/domains/project/domain/entities/Project";
import type { ProjectDTO, CreateProjectRequestDTO, UpdateProjectRequestDTO, PaginatedProjectsDTO } from "~/domains/project/application/dto/ProjectDTO";
import { ProjectMapper } from "~/domains/project/application/mappers/ProjectMapper";
import { apiClient } from "~/shared/utils/api";
import { PROJECT_ENDPOINTS } from "../endpoints";

export class ApiProjectRepository implements ProjectRepository {
  async findAll(filters?: ProjectFilters): Promise<PaginatedProjects> {
    const params = new URLSearchParams();

    if (filters?.name) params.append("name", filters.name);
    if (filters?.description) params.append("description", filters.description);
    if (filters?.status) params.append("status", filters.status);
    if (filters?.ownerId) params.append("owner_id", filters.ownerId);
    if (filters?.memberId) params.append("member_id", filters.memberId);
    if (filters?.page) params.append("page", filters.page.toString());
    if (filters?.limit) params.append("limit", filters.limit.toString());

    const url = `${PROJECT_ENDPOINTS.LIST}${params.toString() ? `?${params.toString()}` : ""}`;
    const response = await apiClient.get<PaginatedProjectsDTO>(url);

    return {
      data: ProjectMapper.toEntityList(response.data.data),
      total: response.data.total,
      page: response.data.page,
      limit: response.data.limit,
      totalPages: response.data.total_pages,
    };
  }

  async findById(id: ProjectId): Promise<ProjectEntity | null> {
    try {
      const url = PROJECT_ENDPOINTS.GET.replace(":id", id);
      const response = await apiClient.get<ProjectDTO>(url);
      return ProjectMapper.toEntity(response.data);
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  }

  async findMemberOf(): Promise<ProjectEntity[]> {
    const response = await apiClient.get<{ data: ProjectDTO[] }>(
      PROJECT_ENDPOINTS.MEMBER_OF
    );
    return ProjectMapper.toEntityList(response.data.data);
  }

  async create(data: CreateProjectData): Promise<ProjectEntity> {
    const requestData: CreateProjectRequestDTO = {
      name: data.name,
      description: data.description,
      tags: data.tags,
      start_date: data.startDate,
      end_date: data.endDate,
    };

    const response = await apiClient.post<ProjectDTO>(
      PROJECT_ENDPOINTS.CREATE,
      requestData
    );

    return ProjectMapper.toEntity(response.data);
  }

  async update(id: ProjectId, data: UpdateProjectData): Promise<ProjectEntity> {
    const url = PROJECT_ENDPOINTS.UPDATE.replace(":id", id);

    const requestData: UpdateProjectRequestDTO = {
      name: data.name,
      description: data.description,
      tags: data.tags,
      status: data.status,
      start_date: data.startDate,
      end_date: data.endDate,
    };

    const response = await apiClient.patch<ProjectDTO>(url, requestData);

    return ProjectMapper.toEntity(response.data);
  }

  async delete(id: ProjectId): Promise<void> {
    const url = PROJECT_ENDPOINTS.DELETE.replace(":id", id);
    await apiClient.delete(url);
  }
}

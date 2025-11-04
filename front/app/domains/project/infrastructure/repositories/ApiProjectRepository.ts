import type {
  MemberDTO,
  MemberResponseDTO,
} from "~/domains/project/application/dto/MemberDTO";
import type {
  CreateProjectRequestDTO,
  PaginatedProjectsDTO,
  ProjectDTO,
  ProjectListItemDTO,
  UpdateProjectRequestDTO,
} from "~/domains/project/application/dto/ProjectDTO";
import { ProjectMapper } from "~/domains/project/application/mappers/ProjectMapper";
import { ProjectEntity } from "~/domains/project/domain/entities/Project";
import { ProjectListItemEntity } from "~/domains/project/domain/entities/ProjectListItem";
import type { ProjectId } from "~/domains/project/domain/entities/types";
import type {
  CreateProjectData,
  PaginatedProjects,
  ProjectFilters,
  ProjectRepository,
  UpdateProjectData,
} from "~/domains/project/domain/repositories/ProjectRepository";
import { ApiException, apiRequest } from "~/shared/utils/api";
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
    const response = await apiRequest<PaginatedProjectsDTO>(url);

    return {
      data: ProjectMapper.toListItemEntityList(response.data),
      total: response.total,
      page: response.page,
      limit: response.limit,
      totalPages: response.total_pages,
    };
  }

  async findById(id: ProjectId): Promise<ProjectEntity | null> {
    try {
      const url = PROJECT_ENDPOINTS.GET.replace(":id", id);
      const response = await apiRequest<ProjectDTO>(url);
      return ProjectMapper.toEntity(response);
    } catch (error: unknown) {
      if (error instanceof ApiException && error.statusCode === 404) {
        return null;
      }
      throw error;
    }
  }

  async findMemberOf(): Promise<ProjectListItemEntity[]> {
    const response = await apiRequest<{ data: ProjectListItemDTO[] }>(
      PROJECT_ENDPOINTS.MEMBER_OF
    );
    return ProjectMapper.toListItemEntityList(response.data);
  }

  async getMembers(projectId: ProjectId): Promise<MemberDTO[]> {
    const url = PROJECT_ENDPOINTS.MEMBERS.replace(":id", projectId);
    const response = await apiRequest<MemberResponseDTO[]>(url);

    // Get project to check owner
    const project = await this.findById(projectId);
    const ownerId = project?.owner.id;

    return response.map(member => ({
      id: member.id,
      name: member.user.fullName,
      email: member.user.email,
      role: member.role,
      status: member.status,
      isOwner: member.user.id === ownerId,
      joinedAt: member.joined_at,
      leftAt: member.left_at,
      avatarUrl: undefined, // TODO: Add avatar_url if available in API
    }));
  }

  async create(data: CreateProjectData): Promise<string> {
    const requestData: CreateProjectRequestDTO = {
      name: data.name,
      description: data.description,
      tags: data.tags,
      start_date: data.startDate,
      end_date: data.endDate,
    };

    const response = await apiRequest<{ id: string }>(
      PROJECT_ENDPOINTS.CREATE,
      {
        method: "POST",
        data: requestData,
      }
    );

    return response.id;
  }

  async update(id: ProjectId, data: UpdateProjectData): Promise<string> {
    const url = PROJECT_ENDPOINTS.UPDATE.replace(":id", id);

    const requestData: UpdateProjectRequestDTO = {
      name: data.name,
      description: data.description,
      tags: data.tags,
      status: data.status,
      start_date: data.startDate,
      end_date: data.endDate,
    };

    const response = await apiRequest<{ id: string }>(url, {
      method: "PATCH",
      data: requestData,
    });

    return response.id;
  }

  async delete(id: ProjectId): Promise<{ success: boolean }> {
    const url = PROJECT_ENDPOINTS.DELETE.replace(":id", id);
    return await apiRequest<{ success: boolean }>(url, {
      method: "DELETE",
    });
  }
}

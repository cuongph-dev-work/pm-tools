import {
  mapPriorityToApi,
  mapStatusToApi,
} from "~/shared/constants/taskOptions";
import { apiRequest } from "~/shared/utils/api";
import type { CreateTaskDTO, TaskDTO } from "../../application/dto/TaskDto";
import { TaskEntity } from "../../domain/entities/Task";
import type { TaskRepository } from "../../domain/repositories/TaskRepository";
import { TASK_ENDPOINTS } from "../endpoints";

export interface SearchTasksParams {
  keyword?: string;
  type?: string;
  status?: string;
  priority?: string;
  tags?: string[];
  sprint?: string;
}

export interface SearchTasksResponse {
  data: TaskDTO[];
}

export class ApiTaskRepository implements TaskRepository {
  async getById(_id: string): Promise<TaskEntity | null> {
    // TODO: Implement get task by id from API
    throw new Error("Not implemented");
  }

  async create(projectId: string, data: CreateTaskDTO): Promise<TaskDTO> {
    return apiRequest<TaskDTO>(TASK_ENDPOINTS.createTask(projectId), {
      method: "POST",
      data,
    });
  }

  async search(
    projectId: string,
    params: SearchTasksParams = {}
  ): Promise<TaskDTO[]> {
    const queryParams = new URLSearchParams();
    if (params.keyword) queryParams.append("keyword", params.keyword);
    if (params.type) queryParams.append("type", params.type);

    // Map status from UI format to API format
    if (params.status) {
      const apiStatus = mapStatusToApi(params.status);
      queryParams.append("status", apiStatus);
    }

    // Map priority from UI format to API format
    if (params.priority) {
      const apiPriority = mapPriorityToApi(params.priority);
      queryParams.append("priority", apiPriority);
    }

    if (params.tags && params.tags.length > 0) {
      params.tags.forEach(tag => queryParams.append("tags", tag));
    }

    // Nếu có sprint, sử dụng endpoint sprint thay vì search endpoint
    let url: string;
    if (params.sprint) {
      url = `${TASK_ENDPOINTS.getSprintTasks(projectId, params.sprint)}${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
    } else {
      url = `${TASK_ENDPOINTS.searchTasks(projectId)}${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
    }

    const response = await apiRequest<SearchTasksResponse>(url, {
      method: "GET",
    });
    return response.data;
  }
}

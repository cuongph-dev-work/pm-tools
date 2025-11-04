import { apiRequest } from "~/shared/utils/api";
import type { CreateTaskDTO, TaskDTO } from "../../application/dto/TaskDTO";
import { TaskEntity } from "../../domain/entities/Task";
import type { TaskRepository } from "../../domain/repositories/TaskRepository";
import { TASK_ENDPOINTS } from "../endpoints";

export class ApiTaskRepository implements TaskRepository {
  async list(): Promise<TaskEntity[]> {
    // TODO: Implement list tasks from API
    throw new Error("Not implemented");
  }

  async getById(id: string): Promise<TaskEntity | null> {
    // TODO: Implement get task by id from API
    throw new Error("Not implemented");
  }

  async create(projectId: string, data: CreateTaskDTO): Promise<TaskDTO> {
    return apiRequest<TaskDTO>(TASK_ENDPOINTS.createTask(projectId), {
      method: "POST",
      data,
    });
  }
}

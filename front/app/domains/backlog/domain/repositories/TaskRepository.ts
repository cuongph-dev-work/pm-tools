import type { CreateTaskDTO, TaskDTO } from "../../application/dto/TaskDto";
import { TaskEntity, type TaskId } from "../entities/Task";

export interface TaskRepository {
  getById(id: TaskId): Promise<TaskEntity | null>;
  create(projectId: string, data: CreateTaskDTO): Promise<TaskDTO>;
}

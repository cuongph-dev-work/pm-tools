import { TaskEntity, type TaskId } from "../entities/Task";
import type { CreateTaskDTO, TaskDTO } from "../../application/dto/TaskDTO";

export interface TaskRepository {
  list(): Promise<TaskEntity[]>;
  getById(id: TaskId): Promise<TaskEntity | null>;
  create(projectId: string, data: CreateTaskDTO): Promise<TaskDTO>;
}

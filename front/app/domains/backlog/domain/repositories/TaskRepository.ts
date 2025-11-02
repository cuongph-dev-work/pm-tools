import { TaskEntity, type TaskId } from "../entities/Task";

export interface TaskRepository {
  list(): Promise<TaskEntity[]>;
  getById(id: TaskId): Promise<TaskEntity | null>;
}

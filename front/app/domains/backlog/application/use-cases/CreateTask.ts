import type { TaskRepository } from "../../domain/repositories/TaskRepository";
import type { CreateTaskDTO, TaskDTO } from "../dto/TaskDto";

export class CreateTaskUseCase {
  constructor(private repository: TaskRepository) {}

  async execute(projectId: string, input: CreateTaskDTO): Promise<TaskDTO> {
    return await this.repository.create(projectId, input);
  }
}

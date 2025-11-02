import type { TaskRepository } from "../../domain/repositories/TaskRepository";
import type { TaskDTO } from "../dto/TaskDTO";
import { TaskMapper } from "../mappers/TaskMapper";

export class ListTasksUseCase {
  private readonly repository: TaskRepository;

  constructor(repository: TaskRepository) {
    this.repository = repository;
  }

  async execute(): Promise<TaskDTO[]> {
    const entities = await this.repository.list();
    return entities.map(TaskMapper.toDTO);
  }
}

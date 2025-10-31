import type { ProjectRepository } from "../../domain/repositories/ProjectRepository";
import type { ProjectDTO } from "../dto/ProjectDTO";
import { ProjectMapper } from "../mappers/ProjectMapper";

export class ListProjectsUseCase {
  private readonly repository: ProjectRepository;

  constructor(repository: ProjectRepository) {
    this.repository = repository;
  }

  async execute(): Promise<ProjectDTO[]> {
    const entities = await this.repository.list();
    return entities.map(ProjectMapper.toDTO);
  }
}

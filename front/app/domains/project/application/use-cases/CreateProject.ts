import type { ProjectRepository, CreateProjectData } from "~/domains/project/domain/repositories/ProjectRepository";
import { ProjectEntity } from "~/domains/project/domain/entities/Project";

export class CreateProjectUseCase {
  constructor(private readonly repository: ProjectRepository) {}

  async execute(data: CreateProjectData): Promise<ProjectEntity> {
    return await this.repository.create(data);
  }
}

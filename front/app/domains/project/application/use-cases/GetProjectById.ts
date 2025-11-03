import type { ProjectRepository } from "~/domains/project/domain/repositories/ProjectRepository";
import type { ProjectId } from "~/domains/project/domain/entities/Project";
import { ProjectEntity } from "~/domains/project/domain/entities/Project";

export class GetProjectByIdUseCase {
  constructor(private readonly repository: ProjectRepository) {}

  async execute(id: ProjectId): Promise<ProjectEntity | null> {
    return await this.repository.findById(id);
  }
}

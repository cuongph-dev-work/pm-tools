import type { ProjectRepository } from "~/domains/project/domain/repositories/ProjectRepository";
import type { ProjectId } from "~/domains/project/domain/entities/Project";

export class DeleteProjectUseCase {
  constructor(private readonly repository: ProjectRepository) {}

  async execute(id: ProjectId): Promise<void> {
    await this.repository.delete(id);
  }
}

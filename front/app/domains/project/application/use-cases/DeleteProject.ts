import type { ProjectId } from "~/domains/project/domain/entities/Project";
import type { ProjectRepository } from "~/domains/project/domain/repositories/ProjectRepository";

export class DeleteProjectUseCase {
  constructor(private readonly repository: ProjectRepository) {}

  async execute(id: ProjectId): Promise<{ success: boolean }> {
    return await this.repository.delete(id);
  }
}

import type {
  ProjectRepository,
  UpdateProjectData,
} from "~/domains/project/domain/repositories/ProjectRepository";
import type { ProjectId } from "~/domains/project/domain/entities/Project";
import { ProjectEntity } from "~/domains/project/domain/entities/Project";

export class UpdateProjectUseCase {
  constructor(private readonly repository: ProjectRepository) {}

  async execute(
    id: ProjectId,
    data: UpdateProjectData
  ): Promise<ProjectEntity> {
    return await this.repository.update(id, data);
  }
}

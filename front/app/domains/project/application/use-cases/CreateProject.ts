import type {
  CreateProjectData,
  ProjectRepository,
} from "~/domains/project/domain/repositories/ProjectRepository";

export class CreateProjectUseCase {
  constructor(private readonly repository: ProjectRepository) {}

  async execute(data: CreateProjectData): Promise<string> {
    return await this.repository.create(data);
  }
}

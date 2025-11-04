import type {
  ProjectRepository,
  ProjectFilters,
  PaginatedProjects,
} from "~/domains/project/domain/repositories/ProjectRepository";

export class ListProjectsUseCase {
  constructor(private readonly repository: ProjectRepository) {}

  async execute(filters?: ProjectFilters): Promise<PaginatedProjects> {
    return await this.repository.findAll(filters);
  }
}

export class ListMemberProjectsUseCase {
  constructor(private readonly repository: ProjectRepository) {}

  async execute() {
    return await this.repository.findMemberOf();
  }
}

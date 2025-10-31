import type { ProjectRepository } from "../../domain/repositories/ProjectRepository";
import type { MemberDTO } from "../dto/MemberDTO";

export class GetProjectMembersUseCase {
  private readonly repository: ProjectRepository;

  constructor(repository: ProjectRepository) {
    this.repository = repository;
  }

  async execute(projectId: string): Promise<MemberDTO[]> {
    const project = await this.repository.getById(projectId);
    return project?.members ?? [];
  }
}

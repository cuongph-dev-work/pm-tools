import type { ProjectRepository } from "../../domain/repositories/ProjectRepository";
import type { MemberDTO } from "../dto/MemberDTO";
import type { ProjectId } from "../../domain/entities/Project";

export class GetProjectMembersUseCase {
  private readonly repository: ProjectRepository;

  constructor(repository: ProjectRepository) {
    this.repository = repository;
  }

  async execute(projectId: ProjectId): Promise<MemberDTO[]> {
    return await this.repository.getMembers(projectId);
  }
}

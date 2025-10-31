import { ProjectEntity, type ProjectId } from "../entities/Project";

export interface ProjectRepository {
  list(): Promise<ProjectEntity[]>;
  getById(id: ProjectId): Promise<ProjectEntity | null>;
}

import { ProjectEntity } from "../../domain/entities/Project";
import type { ProjectDTO } from "../dto/ProjectDTO";

export class ProjectMapper {
  static toDTO(entity: ProjectEntity): ProjectDTO {
    return {
      id: entity.id,
      name: entity.name,
      description: entity.description,
      tags: (entity.tags ?? []).map(t => ({ label: t.label, color: t.color })),
      memberCount: entity.memberCount,
      startDate: entity.startDate,
      endDate: entity.endDate,
    };
  }
}

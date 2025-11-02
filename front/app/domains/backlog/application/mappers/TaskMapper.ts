import { TaskEntity } from "../../domain/entities/Task";
import type { TaskDTO } from "../dto/TaskDTO";

export class TaskMapper {
  static toDTO(entity: TaskEntity): TaskDTO {
    return {
      id: entity.id,
      title: entity.title,
      description: entity.description,
      status: entity.status,
      priority: entity.priority,
      sprint: entity.sprint,
      assignee: entity.assignee,
      updatedDate: entity.updatedDate,
    };
  }
}

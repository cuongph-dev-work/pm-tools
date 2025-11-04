import { parseEstimateToHours } from "~/shared/utils/estimate";
import { TaskEntity } from "../../domain/entities/Task";
import type { CreateTaskFormData } from "../../domain/validation/task.schema";
import type { CreateTaskDTO, TaskDTO } from "../dto/TaskDTO";

export class TaskMapper {
  static toDTO(entity: TaskEntity): TaskDTO {
    return {
      id: entity.id,
      title: entity.title,
      description: entity.description,
      type: "task",
      status: entity.status as TaskDTO["status"],
      priority: entity.priority,
      project_id: "",
    };
  }

  static toCreateRequestDTO(formData: CreateTaskFormData): CreateTaskDTO {
    // Parse estimateHours to number if it's a string
    let estimateHours: number | undefined;
    if (
      formData.estimateHours !== undefined &&
      formData.estimateHours !== null
    ) {
      if (typeof formData.estimateHours === "string") {
        const parsed = parseEstimateToHours(formData.estimateHours);
        estimateHours = parsed !== null ? parsed : undefined;
      } else {
        estimateHours = formData.estimateHours;
      }
    }

    // API accepts uppercase enum values directly
    return {
      title: formData.title,
      description: formData.description || undefined,
      type: formData.type, // Send uppercase enum value directly
      priority: formData.priority, // Send uppercase enum value directly
      estimate: estimateHours,
      due_date: formData.dueDate,
      assignee_id: formData.assignee || undefined,
      tags: formData.tags.map(tag => ({
        name: tag.value,
      })),
    };
  }
}

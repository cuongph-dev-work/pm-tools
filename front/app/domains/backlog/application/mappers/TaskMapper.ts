import { parseEstimateToHours } from "~/shared/utils/estimate";
import { TaskEntity } from "../../domain/entities/Task";
import type { CreateTaskFormData } from "../../domain/validation/task.schema";
import type { CreateTaskDTO, TaskDTO } from "../dto/TaskDto";

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

  static toEntity(dto: TaskDTO): TaskEntity {
    // Map API status (uppercase) to entity status (lowercase)
    const mapStatus = (status: string): "todo" | "in-progress" | "done" => {
      const upperStatus = status.toUpperCase();
      if (upperStatus === "IN_PROGRESS" || upperStatus === "IN-PROGRESS") {
        return "in-progress";
      }
      if (upperStatus === "DONE" || upperStatus === "COMPLETED") {
        return "done";
      }
      return "todo"; // Default for OPEN, TODO, etc.
    };

    // Map API priority (uppercase) to entity priority (lowercase)
    const mapPriority = (
      priority?: string | null
    ): "high" | "medium" | "low" | undefined => {
      if (!priority) return undefined;
      const upperPriority = priority.toUpperCase();
      if (upperPriority === "HIGH") return "high";
      if (upperPriority === "MEDIUM") return "medium";
      if (upperPriority === "LOW") return "low";
      return undefined;
    };

    return new TaskEntity({
      id: dto.id,
      title: dto.title,
      description: dto.description || undefined,
      status: mapStatus(dto.status),
      priority: mapPriority(dto.priority),
      sprint: dto.sprints?.[0]?.id,
      assignee: dto.assignee?.id,
      updatedDate: dto.updated_at || undefined,
    });
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
      parent_task_id: formData.parentTaskId || undefined,
      tags: formData.tags.map(tag => ({
        name: tag.value,
      })),
    };
  }
}

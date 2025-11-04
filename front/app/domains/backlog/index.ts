// Public API exports for Backlog domain

// DTOs
export type {
  CreateTaskDTO,
  SprintDTO,
  TagDTO,
  TaskDTO,
  TaskPriority,
  TaskStatus,
  TaskType,
  UpdateTaskDTO,
  UserDTO,
} from "./application/dto/TaskDTO";

// Hooks
export { useCreateTaskForm } from "./application/hooks/useCreateTaskForm";
export { useCreateTaskMutation } from "./application/hooks/useCreateTaskMutation";
export { useFilterTasks } from "./application/hooks/useFilterTasks";
export { useListTasks } from "./application/hooks/useListTasks";
export { useListTasksQuery } from "./application/hooks/useListTasksQuery";

// Validation schemas
export {
  createTaskFormSchema,
  tagSchema,
} from "./domain/validation/task.schema";
export type { CreateTaskFormData } from "./domain/validation/task.schema";

// Components
export { TaskCard } from "./ui/components/atoms/TaskCard";
export { CreateTaskForm } from "./ui/components/molecules/CreateTaskForm";
export { TaskBacklogFilters } from "./ui/components/molecules/TaskBacklogFilters";
export { TaskList } from "./ui/components/molecules/TaskList";

// Screens
export { default as CreateTaskDialog } from "./ui/screens/CreateTaskDialog";
export { default as TaskBacklog } from "./ui/screens/TaskBacklog";

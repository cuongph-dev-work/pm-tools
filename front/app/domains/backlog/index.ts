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
} from "./application/dto/TaskDto";

// Hooks
export { useCreateTaskMutation } from "./application/hooks/mutation/create.mutation";
export { useSearchTasks } from "./application/hooks/query/search.query";
export { useCreateTaskForm } from "./application/hooks/useCreateTaskForm";
export { useFilterTasks } from "./application/hooks/useFilterTasks";
export { useListTasks } from "./application/hooks/useListTasks";

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

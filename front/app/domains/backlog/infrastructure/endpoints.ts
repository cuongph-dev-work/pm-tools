// Domain-specific API endpoints for Task/Backlog
// Keep path-only strings; baseURL is configured in the axios client

export const TASK_ENDPOINTS = {
  createTask: (projectId: string) => `/projects/${projectId}/tasks`,
  searchTasks: (projectId: string) => `/projects/${projectId}/tasks`,
  getTaskById: (projectId: string, taskId: string) =>
    `/projects/${projectId}/tasks/${taskId}`,
  updateTask: (projectId: string, taskId: string) =>
    `/projects/${projectId}/tasks/${taskId}`,
  deleteTask: (projectId: string, taskId: string) =>
    `/projects/${projectId}/tasks/${taskId}`,
  getSprintTasks: (projectId: string, sprintId: string) =>
    `/projects/${projectId}/tasks/sprint/${sprintId}`,
  addTaskToSprint: (projectId: string, taskId: string, sprintId: string) =>
    `/projects/${projectId}/tasks/${taskId}/sprint/${sprintId}`,
  moveTaskToBacklog: (projectId: string, taskId: string) =>
    `/projects/${projectId}/tasks/${taskId}/move-to-backlog`,
} as const;

export type TaskEndpointKey = keyof typeof TASK_ENDPOINTS;

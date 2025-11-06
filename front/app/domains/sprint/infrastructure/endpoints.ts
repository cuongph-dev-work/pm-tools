// Domain-specific API endpoints for Sprint
// Keep path-only strings; baseURL is configured in the axios client

export const SPRINT_ENDPOINTS = {
  list: (projectId: string) => `/projects/${projectId}/sprints`,
  getById: (projectId: string, sprintId: string) =>
    `/projects/${projectId}/sprints/${sprintId}`,
  create: (projectId: string) => `/projects/${projectId}/sprints`,
  close: (projectId: string, sprintId: string) =>
    `/projects/${projectId}/sprints/${sprintId}/close`,
  open: (projectId: string, sprintId: string) =>
    `/projects/${projectId}/sprints/${sprintId}/open`,
} as const;

export type SprintEndpointKey = keyof typeof SPRINT_ENDPOINTS;

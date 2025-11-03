export const PROJECT_ENDPOINTS = {
  LIST: "/projects",
  GET: "/projects/:id",
  CREATE: "/projects",
  UPDATE: "/projects/:id",
  DELETE: "/projects/:id",
  MEMBER_OF: "/projects/member-of",
  STATS: "/projects/:id/stats",
} as const;

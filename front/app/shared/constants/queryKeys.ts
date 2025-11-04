export const queryKeys = {
  auth: {
    all: ["auth"] as const,
    signIn: () => [...queryKeys.auth.all, "sign-in"] as const,
  },
  tasks: {
    all: ["tasks"] as const,
    lists: () => [...queryKeys.tasks.all, "list"] as const,
    list: () => [...queryKeys.tasks.lists()] as const,
  },
  projects: {
    all: ["projects"] as const,
    lists: () => [...queryKeys.projects.all, "list"] as const,
    list: () => [...queryKeys.projects.lists()] as const,
    detail: (id: string) => [...queryKeys.projects.all, "detail", id] as const,
    members: (id: string) => [...queryKeys.projects.all, "members", id] as const,
  },
} as const;

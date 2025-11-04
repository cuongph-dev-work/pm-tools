import {
  index,
  layout,
  route,
  type RouteConfig,
} from "@react-router/dev/routes";

export default [
  route("/login", "./domains/auth/ui/screens/Login.tsx"),
  // Error pages - không cần auth
  route("/403", "./domains/error/ui/screens/Forbidden.tsx"),
  route("/500", "./domains/error/ui/screens/InternalServerError.tsx"),
  // Protected routes - cần auth
  layout("./shared/layouts/default.tsx", [
    index("./domains/home/ui/screens/Home.tsx"),
    route("/projects", "./domains/project/ui/screens/ProjectManagement.tsx"),
    route(
      "/:projectId/backlog",
      "./domains/backlog/ui/screens/TaskBacklog.tsx"
    ),
    route("/:projectId/kanban", "./domains/kanban/ui/screens/Kanban.tsx"),
    route("/:projectId/sprint", "./domains/sprint/ui/screens/Sprint.tsx"),
    // route("/post", "./pages/post.tsx"),
  ]),
  // Catch-all route for unknown paths - không cần auth
  route("*", "./domains/error/ui/screens/NotFound.tsx"),
] satisfies RouteConfig;

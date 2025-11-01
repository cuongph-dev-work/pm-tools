import {
  index,
  layout,
  route,
  type RouteConfig,
} from "@react-router/dev/routes";

export default [
  layout("./shared/layouts/default.tsx", [
    index("./domains/home/ui/screens/Home.tsx"),
    route("/projects", "./domains/project/ui/screens/ProjectManagement.tsx"),
    // route("/post", "./pages/post.tsx"),
    // Catch-all route for unknown paths (optional)
    route("*", "./domains/error/ui/screens/NotFound.tsx"),
  ]),
] satisfies RouteConfig;

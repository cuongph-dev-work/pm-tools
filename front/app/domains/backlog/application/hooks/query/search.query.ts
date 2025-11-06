import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "~/shared/constants/queryKeys";
import { useProjects } from "~/shared/hooks/useProjects";
import {
  ApiTaskRepository,
  type SearchTasksParams,
} from "../../../infrastructure/repositories/ApiTaskRepository";

const repository = new ApiTaskRepository();

export function useSearchTasks(
  params: SearchTasksParams = {},
  enabled: boolean = true
) {
  const { currentProject } = useProjects();
  const projectId = currentProject?.id;

  return useQuery({
    queryKey: projectId
      ? [
          ...queryKeys.tasks.all,
          "search",
          projectId,
          params.keyword || "",
          params.type || "",
          params.status || "",
          params.priority || "",
          params.sprint || "",
          params.tags || [],
        ]
      : ["tasks", "search", "null"],
    queryFn: () => {
      if (!projectId) {
        throw new Error("Project ID is required");
      }
      return repository.search(projectId, params);
    },
    enabled: enabled && !!projectId,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}

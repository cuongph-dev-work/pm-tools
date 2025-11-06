import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "~/shared/constants/queryKeys";
import { useProjects } from "~/shared/hooks/useProjects";
import { ApiSprintRepository } from "../../../infrastructure/repositories/ApiSprintRepository";

const repository = new ApiSprintRepository();

export function useListSprints(keywords?: string) {
  const { currentProject } = useProjects();
  const projectId = currentProject?.id;

  return useQuery({
    queryKey: projectId
      ? [...queryKeys.sprints.all, "list", projectId, keywords || ""]
      : ["sprints", "list", "null"],
    queryFn: () => {
      if (!projectId) {
        throw new Error("Project ID is required");
      }
      return repository.list(projectId, { keywords });
    },
    enabled: !!projectId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

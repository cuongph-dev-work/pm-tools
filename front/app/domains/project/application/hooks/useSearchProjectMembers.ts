import { useQuery } from "@tanstack/react-query";
import type { ProjectId } from "~/domains/project/domain/entities/Project";
import { ApiProjectRepository } from "~/domains/project/infrastructure/repositories/ApiProjectRepository";
import { queryKeys } from "~/shared/constants/queryKeys";

const repository = new ApiProjectRepository();

export function useSearchProjectMembers(
  projectId: ProjectId | null | undefined,
  keyword: string,
  enabled: boolean = true
) {
  return useQuery({
    queryKey: projectId
      ? [...queryKeys.projects.members(projectId), "search", keyword || ""]
      : ["projects", "members", "search", "null"],
    queryFn: () => {
      if (!projectId) {
        throw new Error("Project ID is required");
      }
      return repository.searchMembers(projectId, keyword || "");
    },
    enabled: enabled && !!projectId,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}

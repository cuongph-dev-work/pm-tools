import { useQuery } from "@tanstack/react-query";
import type { ProjectId } from "~/domains/project/domain/entities/Project";
import { ApiProjectRepository } from "~/domains/project/infrastructure/repositories/ApiProjectRepository";
import { queryKeys } from "~/shared/constants/queryKeys";
import { GetProjectMembersUseCase } from "../../use-cases/GetProjectMembers";

const repository = new ApiProjectRepository();
const getProjectMembersUseCase = new GetProjectMembersUseCase(repository);

export function useListProjectMembersQuery(
  projectId: ProjectId | null | undefined,
  enabled: boolean = true
) {
  return useQuery({
    queryKey: projectId
      ? queryKeys.projects.members(projectId)
      : ["projects", "members", "null"],
    queryFn: () => {
      if (!projectId) {
        throw new Error("Project ID is required");
      }
      return getProjectMembersUseCase.execute(projectId);
    },
    enabled: enabled && !!projectId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

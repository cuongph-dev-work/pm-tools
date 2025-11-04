import { useQuery } from "@tanstack/react-query";
import type { ProjectFilters } from "~/domains/project/domain/repositories/ProjectRepository";
import { ApiProjectRepository } from "~/domains/project/infrastructure/repositories/ApiProjectRepository";
import { queryKeys } from "~/shared/constants/queryKeys";
import { ListProjectsUseCase } from "../../use-cases/ListProjects";

const repository = new ApiProjectRepository();
const listProjectsUseCase = new ListProjectsUseCase(repository);

export function useListProjectsQuery(filters?: ProjectFilters) {
  return useQuery({
    queryKey: [...queryKeys.projects.all, filters],
    queryFn: () => listProjectsUseCase.execute(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

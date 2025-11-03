import { useQuery } from "@tanstack/react-query";
import type { ProjectFilters } from "~/domains/project/domain/repositories/ProjectRepository";
import { ListProjectsUseCase } from "../use-cases/ListProjects";
import { ApiProjectRepository } from "~/domains/project/infrastructure/repositories/ApiProjectRepository";

const repository = new ApiProjectRepository();
const listProjectsUseCase = new ListProjectsUseCase(repository);

export function useListProjectsQuery(filters?: ProjectFilters) {
  return useQuery({
    queryKey: ["projects", filters],
    queryFn: () => listProjectsUseCase.execute(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

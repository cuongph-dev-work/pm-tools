import { useQuery } from "@tanstack/react-query";
import type { ProjectId } from "~/domains/project/domain/entities/Project";
import { GetProjectByIdUseCase } from "../use-cases/GetProjectById";
import { ApiProjectRepository } from "~/domains/project/infrastructure/repositories/ApiProjectRepository";

const repository = new ApiProjectRepository();
const getProjectByIdUseCase = new GetProjectByIdUseCase(repository);

export function useProjectByIdQuery(id: ProjectId) {
  return useQuery({
    queryKey: ["projects", id],
    queryFn: () => getProjectByIdUseCase.execute(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateProjectData } from "~/domains/project/domain/repositories/ProjectRepository";
import { ApiProjectRepository } from "~/domains/project/infrastructure/repositories/ApiProjectRepository";
import { queryKeys } from "~/shared/constants/queryKeys";
import { CreateProjectUseCase } from "../../use-cases/CreateProject";

const repository = new ApiProjectRepository();
const createProjectUseCase = new CreateProjectUseCase(repository);

export function useCreateProjectMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProjectData) => createProjectUseCase.execute(data),
    onSuccess: () => {
      // Invalidate projects list cache
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.all });
    },
  });
}

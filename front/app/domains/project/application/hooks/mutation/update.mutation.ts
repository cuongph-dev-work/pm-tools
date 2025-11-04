import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ProjectId } from "~/domains/project/domain/entities/Project";
import type { UpdateProjectData } from "~/domains/project/domain/repositories/ProjectRepository";
import { ApiProjectRepository } from "~/domains/project/infrastructure/repositories/ApiProjectRepository";
import { queryKeys } from "~/shared/constants/queryKeys";
import { UpdateProjectUseCase } from "../../use-cases/UpdateProject";

const repository = new ApiProjectRepository();
const updateProjectUseCase = new UpdateProjectUseCase(repository);

export interface UpdateProjectParams {
  id: ProjectId;
  data: UpdateProjectData;
}

export function useUpdateProjectMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: UpdateProjectParams) =>
      updateProjectUseCase.execute(id, data),
    onSuccess: (_, variables) => {
      // Invalidate specific project and list cache
      queryClient.invalidateQueries({
        queryKey: queryKeys.projects.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.all });
    },
  });
}

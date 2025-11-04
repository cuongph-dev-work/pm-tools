import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ProjectId } from "~/domains/project/domain/entities/Project";
import { ApiProjectRepository } from "~/domains/project/infrastructure/repositories/ApiProjectRepository";
import { queryKeys } from "~/shared/constants/queryKeys";
import { DeleteProjectUseCase } from "../../use-cases/DeleteProject";

const repository = new ApiProjectRepository();
const deleteProjectUseCase = new DeleteProjectUseCase(repository);

export function useDeleteProjectMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: ProjectId) => deleteProjectUseCase.execute(id),
    onSuccess: (_, id) => {
      // Invalidate specific project and list cache
      queryClient.invalidateQueries({
        queryKey: queryKeys.projects.detail(id),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.all });
    },
  });
}

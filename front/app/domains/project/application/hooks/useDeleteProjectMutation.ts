import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ProjectId } from "~/domains/project/domain/entities/Project";
import { DeleteProjectUseCase } from "../use-cases/DeleteProject";
import { ApiProjectRepository } from "~/domains/project/infrastructure/repositories/ApiProjectRepository";

const repository = new ApiProjectRepository();
const deleteProjectUseCase = new DeleteProjectUseCase(repository);

export function useDeleteProjectMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: ProjectId) => deleteProjectUseCase.execute(id),
    onSuccess: (_, id) => {
      // Invalidate specific project and list cache
      queryClient.invalidateQueries({ queryKey: ["projects", id] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
}

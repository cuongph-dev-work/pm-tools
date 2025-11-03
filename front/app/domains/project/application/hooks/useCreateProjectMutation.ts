import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateProjectData } from "~/domains/project/domain/repositories/ProjectRepository";
import { CreateProjectUseCase } from "../use-cases/CreateProject";
import { ApiProjectRepository } from "~/domains/project/infrastructure/repositories/ApiProjectRepository";

const repository = new ApiProjectRepository();
const createProjectUseCase = new CreateProjectUseCase(repository);

export function useCreateProjectMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProjectData) => createProjectUseCase.execute(data),
    onSuccess: () => {
      // Invalidate projects list cache
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
}

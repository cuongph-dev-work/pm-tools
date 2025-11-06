import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "~/shared/constants/queryKeys";
import { ApiTaskRepository } from "../../../infrastructure/repositories/ApiTaskRepository";
import type { CreateTaskDTO } from "../../dto/TaskDto";
import { CreateTaskUseCase } from "../../use-cases/CreateTask";

const repository = new ApiTaskRepository();
const createTaskUseCase = new CreateTaskUseCase(repository);

export function useCreateTaskMutation(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTaskDTO) =>
      createTaskUseCase.execute(projectId, data),
    onSuccess: () => {
      // Invalidate tasks list to refetch
      queryClient.invalidateQueries({
        queryKey: queryKeys.tasks.list(projectId),
      });
    },
  });
}

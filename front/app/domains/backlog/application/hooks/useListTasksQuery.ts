import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "~/shared/constants/queryKeys";
import { FakeTaskRepository } from "../../infrastructure/repositories/FakeTaskRepository";
import type { TaskDTO } from "../dto/TaskDTO";
import { ListTasksUseCase } from "../use-cases/ListTasks";

export function useListTasksQuery() {
  return useQuery<TaskDTO[]>({
    queryKey: queryKeys.tasks.list(),
    queryFn: async () => {
      const repo = new FakeTaskRepository();
      const usecase = new ListTasksUseCase(repo);
      return usecase.execute();
    },
  });
}

import { useEffect, useState } from "react";
import { FakeTaskRepository } from "../../infrastructure/repositories/FakeTaskRepository";
import type { TaskDTO } from "../dto/TaskDTO";
import { ListTasksUseCase } from "../use-cases/ListTasks";

export function useListTasks() {
  const [tasks, setTasks] = useState<TaskDTO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const repo = new FakeTaskRepository();
    const usecase = new ListTasksUseCase(repo);
    usecase.execute().then(data => {
      setTasks(data);
      setLoading(false);
    });
  }, []);

  return {
    tasks,
    loading,
  } as const;
}

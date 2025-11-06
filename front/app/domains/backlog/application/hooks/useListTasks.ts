import { useEffect, useState } from "react";
import type { SearchTasksParams } from "../../infrastructure/repositories/ApiTaskRepository";
import { ApiTaskRepository } from "../../infrastructure/repositories/ApiTaskRepository";
import type { TaskDTO } from "../dto/TaskDto";

export function useListTasks(params?: SearchTasksParams) {
  const [tasks, setTasks] = useState<TaskDTO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const repo = new ApiTaskRepository();
    // This hook is deprecated, use useSearchTasks instead
    // Keeping for backward compatibility
    repo
      .search("", params || {})
      .then(data => {
        setTasks(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [params]);

  return {
    tasks,
    loading,
  } as const;
}

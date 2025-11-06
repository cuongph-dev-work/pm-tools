import { useMemo, useState } from "react";
import type { TaskDTO } from "../dto/TaskDto";

export interface TaskFilters {
  keyword: string;
  status: string | null;
  priority: string | null;
  sprint: string | null;
}

export function useFilterTasks(tasks: TaskDTO[]) {
  const [filters, setFilters] = useState<TaskFilters>({
    keyword: "",
    status: null,
    priority: null,
    sprint: null,
  });

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      // Keyword filter (search in title and description)
      if (filters.keyword) {
        const keyword = filters.keyword.toLowerCase();
        const matchesKeyword =
          task.title.toLowerCase().includes(keyword) ||
          task.description?.toLowerCase().includes(keyword);
        if (!matchesKeyword) return false;
      }

      // Status filter
      if (filters.status && task.status !== filters.status) {
        return false;
      }

      // Priority filter
      if (filters.priority && task.priority !== filters.priority) {
        return false;
      }

      // Sprint filter
      if (filters.sprint && task.sprint !== filters.sprint) {
        return false;
      }

      return true;
    });
  }, [tasks, filters]);

  const updateFilter = (key: keyof TaskFilters, value: string | null) => {
    setFilters(prev => ({
      ...prev,
      [key]: value === "" ? null : value,
    }));
  };

  const resetFilters = () => {
    setFilters({
      keyword: "",
      status: null,
      priority: null,
      sprint: null,
    });
  };

  return {
    filters,
    filteredTasks,
    updateFilter,
    resetFilters,
  };
}

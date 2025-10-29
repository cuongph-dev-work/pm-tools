// Re-export types and store for convenience
export * from "~/shared/stores/taskStore";

import { useTaskStore } from "~/shared/stores/taskStore";

export function useTasks() {
  const tasks = useTaskStore(state => state.tasks);
  const setTasks = useTaskStore(state => state.setTasks);
  const addTask = useTaskStore(state => state.addTask);
  const updateTask = useTaskStore(state => state.updateTask);
  const deleteTask = useTaskStore(state => state.deleteTask);

  return {
    tasks,
    setTasks,
    addTask,
    updateTask,
    deleteTask,
  };
}

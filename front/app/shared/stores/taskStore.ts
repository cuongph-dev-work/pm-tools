import { create } from "zustand";

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: "todo" | "in-progress" | "done";
  priority?: "high" | "medium" | "low";
  sprint?: string;
  assignee?: string;
  updatedDate?: string;
}

interface TaskState {
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
  addTask: (task: Task) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
}

export const useTaskStore = create<TaskState>(set => ({
  tasks: [],
  setTasks: tasks => set({ tasks }),
  addTask: task =>
    set(state => ({
      tasks: [...state.tasks, task],
    })),
  updateTask: (id, updates) =>
    set(state => ({
      tasks: state.tasks.map(task =>
        task.id === id ? { ...task, ...updates } : task
      ),
    })),
  deleteTask: id =>
    set(state => ({
      tasks: state.tasks.filter(task => task.id !== id),
    })),
}));

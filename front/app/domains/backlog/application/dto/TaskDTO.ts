export interface TaskDTO {
  id: string;
  title: string;
  description?: string;
  status: "todo" | "in-progress" | "done";
  priority?: "high" | "medium" | "low";
  sprint?: string;
  assignee?: string;
  updatedDate?: string;
}

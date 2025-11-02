export type TaskId = string;

export interface TaskProps {
  id: TaskId;
  title: string;
  description?: string;
  status: "todo" | "in-progress" | "done";
  priority?: "high" | "medium" | "low";
  sprint?: string;
  assignee?: string;
  updatedDate?: string;
}

export class TaskEntity {
  readonly id: TaskId;
  readonly title: string;
  readonly description?: string;
  readonly status: "todo" | "in-progress" | "done";
  readonly priority?: "high" | "medium" | "low";
  readonly sprint?: string;
  readonly assignee?: string;
  readonly updatedDate?: string;

  constructor(props: TaskProps) {
    this.id = props.id;
    this.title = props.title;
    this.description = props.description;
    this.status = props.status;
    this.priority = props.priority;
    this.sprint = props.sprint;
    this.assignee = props.assignee;
    this.updatedDate = props.updatedDate;
  }
}

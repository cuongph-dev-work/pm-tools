import { TaskEntity } from "../../domain/entities/Task";
import type { TaskRepository } from "../../domain/repositories/TaskRepository";

export class FakeTaskRepository implements TaskRepository {
  private readonly tasks: TaskEntity[];

  constructor() {
    this.tasks = [
      new TaskEntity({
        id: "1",
        title: "Thiết kế giao diện đăng nhập",
        description:
          "Tạo wireframe và mockup cho trang đăng nhập với các yêu cầu UX/UI hiện đại",
        status: "todo",
        priority: "high",
        sprint: "sprint-1",
        assignee: "Nguyễn Văn A",
        updatedDate: "01/01/2024",
      }),
      new TaskEntity({
        id: "2",
        title: "Tạo wireframe",
        description: "Thiết kế wireframe cơ bản cho layout đăng nhập",
        status: "done",
        priority: "high",
        sprint: "sprint-1",
        assignee: "Nguyễn Văn A",
        updatedDate: "02/01/2024",
      }),
      new TaskEntity({
        id: "3",
        title: "Implement authentication API",
        description:
          "Xây dựng API endpoints cho đăng nhập, đăng ký và quản lý session",
        status: "in-progress",
        priority: "high",
        sprint: "sprint-1",
        assignee: "Trần Thị B",
        updatedDate: "03/01/2024",
      }),
      new TaskEntity({
        id: "4",
        title: "Thiết kế database schema",
        description:
          "Thiết kế schema cho user, project, task và các bảng liên quan",
        status: "todo",
        priority: "medium",
        sprint: "sprint-1",
        assignee: "Lê Văn C",
        updatedDate: "01/01/2024",
      }),
      new TaskEntity({
        id: "5",
        title: "Tạo component Button",
        description: "Xây dựng reusable Button component với các variants",
        status: "done",
        priority: "low",
        sprint: "sprint-2",
        assignee: "Phạm Thị D",
        updatedDate: "05/01/2024",
      }),
      new TaskEntity({
        id: "6",
        title: "Implement task filter",
        description:
          "Xây dựng chức năng filter task theo status, priority và sprint",
        status: "in-progress",
        priority: "medium",
        sprint: "sprint-2",
        assignee: "Hoàng Văn E",
        updatedDate: "04/01/2024",
      }),
      new TaskEntity({
        id: "7",
        title: "Viết unit tests cho TaskRepository",
        description: "Viết test cases cho các methods trong TaskRepository",
        status: "todo",
        priority: "low",
        sprint: "sprint-2",
        assignee: "Nguyễn Thị F",
        updatedDate: "06/01/2024",
      }),
      new TaskEntity({
        id: "8",
        title: "Setup CI/CD pipeline",
        description:
          "Cấu hình GitHub Actions để tự động build và deploy ứng dụng",
        status: "todo",
        priority: "medium",
        assignee: "Trần Văn G",
        updatedDate: "07/01/2024",
      }),
    ];
  }

  async list(): Promise<TaskEntity[]> {
    return this.tasks;
  }

  async getById(id: string): Promise<TaskEntity | null> {
    return this.tasks.find(t => t.id === id) ?? null;
  }
}

import { ProjectEntity } from "../../domain/entities/Project";
import type { ProjectRepository } from "../../domain/repositories/ProjectRepository";

export class FakeProjectRepository implements ProjectRepository {
  private readonly projects: ProjectEntity[];

  constructor() {
    this.projects = [
      new ProjectEntity({
        id: "1",
        name: "E-commerce Platform",
        description: "Xây dựng nền tảng thương mại điện tử với...",
        tags: [
          { label: "React", color: "blue" },
          { label: "E-commerce", color: "red" },
          { label: "Frontend", color: "green" },
        ],
        memberCount: 2,
        startDate: "1/1/2024",
        endDate: "30/6/2024",
        members: [
          {
            id: "u1",
            name: "Admin User",
            email: "admin@pmtools.com",
            role: "Chủ sở hữu",
            isOwner: true,
            joinedAt: "1/1/2024",
          },
          {
            id: "u2",
            name: "Developer",
            email: "dev@pmtools.com",
            role: "Thành viên",
            joinedAt: "2/1/2024",
          },
        ],
      }),
      new ProjectEntity({
        id: "2",
        name: "Mobile App",
        description: "Ứng dụng mobile React Native cho iOS và...",
        tags: [
          { label: "React Native", color: "yellow" },
          { label: "Mobile", color: "purple" },
        ],
        memberCount: 1,
        startDate: "10/1/2024",
        members: [
          {
            id: "u1",
            name: "Developer",
            email: "dev@pmtools.com",
            role: "Thành viên",
            joinedAt: "10/1/2024",
          },
        ],
      }),
    ];
  }

  async list(): Promise<ProjectEntity[]> {
    return this.projects;
  }

  async getById(id: string): Promise<ProjectEntity | null> {
    return this.projects.find(p => p.id === id) ?? null;
  }
}

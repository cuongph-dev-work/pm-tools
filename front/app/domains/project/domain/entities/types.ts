export type ProjectId = string;

export type ProjectStatus = "ACTIVE" | "INACTIVE" | "COMPLETED" | "CANCELLED";

export interface ProjectOwner {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
}

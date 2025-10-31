export interface ProjectDTO {
  id: string;
  name: string;
  description?: string;
  tags: Array<{ label: string; color?: string }>;
  memberCount: number;
  startDate?: string;
  endDate?: string;
}

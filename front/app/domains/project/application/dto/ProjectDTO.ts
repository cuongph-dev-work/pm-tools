// API Response types match API spec
export interface ProjectOwnerDTO {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  fullName: string;
}

export interface ProjectDTO {
  id: string;
  name: string;
  description?: string;
  tags?: string[];
  status: "ACTIVE" | "INACTIVE" | "COMPLETED" | "CANCELLED";
  start_date?: string;
  end_date?: string;
  owner: ProjectOwnerDTO;
  created_at: string;
  updated_at: string;
  member_count?: number;
  invite_count?: number;
}

// API Request types
export interface CreateProjectRequestDTO {
  name: string;
  description?: string;
  tags?: string;
  start_date?: string;
  end_date?: string;
}

export interface UpdateProjectRequestDTO {
  name?: string;
  description?: string;
  tags?: string;
  status?: "ACTIVE" | "INACTIVE" | "COMPLETED" | "CANCELLED";
  start_date?: string;
  end_date?: string;
}

// Paginated response
export interface PaginatedProjectsDTO {
  data: ProjectDTO[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

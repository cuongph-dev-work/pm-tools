// Sprint Status enum
export enum SPRINT_STATUS {
  OPEN = "OPEN",
  CLOSED = "CLOSED",
}

// Sprint List Response DTO - matches API response format
export interface SprintListDTO {
  id: string;
  name: string;
  description?: string | null;
  start_date?: string | null; // ISO date format (YYYY-MM-DD)
  end_date?: string | null; // ISO date format (YYYY-MM-DD)
  status?: SPRINT_STATUS | string | null;
}

// Sprint Response DTO - for detail view
export interface SprintDTO extends SprintListDTO {
  task_count?: number | null;
}

// List Sprints Response DTO - matches API response format
export interface ListSprintsResponseDTO {
  data: SprintListDTO[];
  total: number;
}

import { apiRequest } from "~/shared/utils/api";
import type {
  ListSprintsResponseDTO,
  SprintListDTO,
} from "../../application/dto/SprintDto";
import { SPRINT_ENDPOINTS } from "../endpoints";

export interface ListSprintsParams {
  keywords?: string;
}

export class ApiSprintRepository {
  async list(
    projectId: string,
    params: ListSprintsParams = {}
  ): Promise<SprintListDTO[]> {
    const queryParams = new URLSearchParams();
    if (params.keywords) {
      queryParams.append("keywords", params.keywords);
    }

    const url = `${SPRINT_ENDPOINTS.list(projectId)}${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
    const response = await apiRequest<ListSprintsResponseDTO>(url, {
      method: "GET",
    });
    // API trả về format { data: [], total: 0 }
    return response.data || [];
  }
}

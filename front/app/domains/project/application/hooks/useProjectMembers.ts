import type { ProjectId } from "../../domain/entities/Project";
import { useListProjectMembersQuery } from "./query/members.query";

export function useProjectMembers(
  projectId: ProjectId | null | undefined,
  enabled: boolean = true
) {
  const {
    data: members = [],
    isLoading,
    error,
  } = useListProjectMembersQuery(projectId, enabled);

  return { members, isLoading, error } as const;
}

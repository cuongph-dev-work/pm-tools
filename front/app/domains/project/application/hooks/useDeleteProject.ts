import { useCallback } from "react";
import type { ProjectId } from "~/domains/project/domain/entities/types";
import { useDeleteProjectMutation } from "./mutation/delete.mutation";

export function useDeleteProject() {
  const deleteMutation = useDeleteProjectMutation();

  const deleteProject = useCallback(
    async (id: ProjectId) => {
      await deleteMutation.mutateAsync(id);
    },
    [deleteMutation]
  );

  return {
    deleteProject,
    isDeleting: deleteMutation.isPending,
    deleteError: deleteMutation.error,
  } as const;
}

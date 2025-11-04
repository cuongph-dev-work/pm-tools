import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { ProjectListItemEntity } from "~/domains/project/domain/entities/ProjectListItem";
import { ApiProjectRepository } from "~/domains/project/infrastructure/repositories/ApiProjectRepository";
import { queryKeys } from "~/shared/constants/queryKeys";
import { ListProjectsUseCase } from "../use-cases/ListProjects";

const repository = new ApiProjectRepository();
const listProjectsUseCase = new ListProjectsUseCase(repository);

export function useListProjects() {
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    null
  );

  // Fetch all projects with page=1 and limit=999 to get all without pagination
  const { data: paginatedProjects, isLoading } = useQuery({
    queryKey: [...queryKeys.projects.all, { page: 1, limit: 999 }],
    queryFn: () => listProjectsUseCase.execute({ page: 1, limit: 999 }),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const projects = useMemo(
    () => paginatedProjects?.data ?? [],
    [paginatedProjects?.data]
  );

  // Auto-select first project if no selection and projects available
  useEffect(() => {
    if (!selectedProjectId && projects.length > 0) {
      setSelectedProjectId(projects[0].id);
    }
  }, [projects, selectedProjectId]);

  const currentProject = useMemo(() => {
    const id = selectedProjectId ?? projects[0]?.id;
    return (
      (projects.find(p => p.id === id) as ProjectListItemEntity | undefined) ??
      null
    );
  }, [projects, selectedProjectId]);

  return {
    projects,
    currentProject,
    selectedProjectId,
    setSelectedProjectId,
    isLoading,
  } as const;
}

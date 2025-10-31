import { useEffect, useMemo, useState } from "react";
import { FakeProjectRepository } from "../../infrastructure/repositories/FakeProjectRepository";
import type { ProjectDTO } from "../dto/ProjectDTO";
import { ListProjectsUseCase } from "../use-cases/ListProjects";

export function useListProjects() {
  const [projects, setProjects] = useState<ProjectDTO[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    null
  );

  useEffect(() => {
    const repo = new FakeProjectRepository();
    const usecase = new ListProjectsUseCase(repo);
    usecase.execute().then(data => {
      setProjects(data);
      if (data.length > 0) {
        setSelectedProjectId(data[0].id);
      }
    });
  }, []);

  const currentProject = useMemo(() => {
    const id = selectedProjectId ?? projects[0]?.id;
    return projects.find(p => p.id === id) ?? null;
  }, [projects, selectedProjectId]);

  return {
    projects,
    currentProject,
    selectedProjectId,
    setSelectedProjectId,
  } as const;
}

import React from "react";
import { ProjectInfoCard } from "~/shared/components/molecules/ProjectInfoCard";

type Project = {
  id: string;
  name: string;
  description: string;
  tags: Array<{ label: string; color?: any }>;
  memberCount: number;
  startDate: string;
  endDate?: string;
};

interface ProjectListProps {
  projects: Project[];
  currentProjectId: string | null;
  onSelect: (id: string) => void;
}

export function ProjectList({
  projects,
  currentProjectId,
  onSelect,
}: ProjectListProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-stretch">
      {projects.map(p => (
        <div
          key={p.id}
          className={`rounded-lg h-full ${currentProjectId === p.id ? "ring-2 ring-blue-500" : ""}`}
          onClick={() => onSelect(p.id)}
        >
          <ProjectInfoCard
            name={p.name}
            description={p.description}
            tags={p.tags}
            memberCount={p.memberCount}
            startDate={p.startDate}
            endDate={p.endDate}
            className="h-full"
          />
        </div>
      ))}
    </div>
  );
}

export default ProjectList;

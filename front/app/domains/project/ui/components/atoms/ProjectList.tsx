import type { ProjectDTO } from "~/domains/project/application/dto/ProjectDTO";
import { ProjectInfoCard } from "~/domains/project/ui/components/molecules/ProjectInfoCard";

interface ProjectListProps {
  projects: ProjectDTO[];
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

import { Box, Grid } from "@radix-ui/themes";
import type { ProjectDTO } from "~/domains/project/application/dto/ProjectDTO";
import { ProjectInfoCard } from "~/domains/project/ui/components/molecules/ProjectInfoCard";

interface ProjectListProps {
  projects: ProjectDTO[];
  currentProjectId: string | null;
  onSelect: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export function ProjectList({
  projects,
  currentProjectId,
  onSelect,
  onEdit,
  onDelete,
}: ProjectListProps) {
  return (
    <Grid columns={{ initial: "1", sm: "2" }} gap="4" className="items-stretch">
      {projects.map(p => (
        <Box
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
            onEdit={() => onEdit(p.id)}
            onDelete={() => onDelete(p.id)}
          />
        </Box>
      ))}
    </Grid>
  );
}

export default ProjectList;

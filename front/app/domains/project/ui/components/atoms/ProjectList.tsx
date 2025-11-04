import { Box, Grid } from "@radix-ui/themes";
import { ProjectListItemEntity } from "~/domains/project/domain/entities/ProjectListItem";
import { ProjectInfoCard } from "~/domains/project/ui/components/molecules/ProjectInfoCard";

interface ProjectListProps {
  projects: ProjectListItemEntity[];
  currentProjectId: string | null;
  onSelect: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete?: (id: string) => void;
}

const TAG_COLORS = [
  "blue",
  "red",
  "green",
  "yellow",
  "purple",
  "orange",
] as const;

const transformTags = (tags: string[]) =>
  tags.map((tag, index) => ({
    label: tag,
    color: TAG_COLORS[index % TAG_COLORS.length],
  }));

export function ProjectList({
  projects,
  currentProjectId,
  onSelect,
  onEdit,
  onDelete,
}: ProjectListProps) {
  return (
    <Grid columns={{ initial: "1", sm: "2" }} gap="4" className="items-stretch">
      {projects.map(project => {
        const isSelected = currentProjectId === project.id;
        return (
          <Box
            key={project.id}
            className={`rounded-lg h-full ${isSelected ? "ring-2 ring-blue-500" : ""}`}
            onClick={() => onSelect(project.id)}
          >
            <ProjectInfoCard
              name={project.name}
              description={project.description}
              tags={transformTags(project.tags)}
              memberCount={project.memberCount}
              startDate={project.startDate ?? undefined}
              endDate={project.endDate ?? undefined}
              className="h-full"
              onEdit={() => onEdit(project.id)}
              onDelete={onDelete ? () => onDelete(project.id) : undefined}
            />
          </Box>
        );
      })}
    </Grid>
  );
}

export default ProjectList;

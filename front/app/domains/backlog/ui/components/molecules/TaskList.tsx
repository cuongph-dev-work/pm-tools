import { Box, Text } from "@radix-ui/themes";
import { useTranslation } from "react-i18next";
import type { TaskDTO } from "../../../application/dto/TaskDTO";
import { TaskCard } from "../atoms/TaskCard";

interface TaskListProps {
  tasks: TaskDTO[];
  loading: boolean;
  statusOptions: Array<{ value: string; label: string }>;
  priorityOptions: Array<{ value: string; label: string }>;
  sprintOptions: Array<{ value: string; label: string }>;
  className?: string;
}

export function TaskList({
  tasks,
  loading,
  statusOptions,
  priorityOptions,
  sprintOptions,
  className = "",
}: TaskListProps) {
  const { t } = useTranslation();

  if (loading) {
    return (
      <Box className={`text-center py-12 ${className}`}>
        <Text as="p" size="3" className="text-gray-500">
          {t("common.loading")}
        </Text>
      </Box>
    );
  }

  if (tasks.length === 0) {
    return (
      <Box className={`text-center py-12 ${className}`}>
        <Text as="p" size="3" className="text-gray-500">
          {t("backlog.noTasks")}
        </Text>
      </Box>
    );
  }

  return (
    <Box className={`space-y-4 ${className}`}>
      {tasks.map(task => (
        <TaskCard
          key={task.id}
          task={task}
          statusOptions={statusOptions}
          priorityOptions={priorityOptions}
          sprintOptions={sprintOptions}
        />
      ))}
    </Box>
  );
}

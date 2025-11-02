import { Box, Flex } from "@radix-ui/themes";
import { useTranslation } from "react-i18next";
import type { TaskDTO } from "../../../application/dto/TaskDTO";

interface TaskCardProps {
  task: TaskDTO;
  statusOptions: Array<{ value: string; label: string }>;
  priorityOptions: Array<{ value: string; label: string }>;
  sprintOptions: Array<{ value: string; label: string }>;
  className?: string;
}

export function TaskCard({
  task,
  statusOptions,
  priorityOptions,
  sprintOptions,
  className = "",
}: TaskCardProps) {
  const { t } = useTranslation();

  const getStatusClass = (status: string) => {
    switch (status) {
      case "todo":
        return "bg-gray-100 text-gray-800";
      case "in-progress":
        return "bg-blue-100 text-blue-800";
      case "done":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityClass = (priority?: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Box
      className={`bg-white rounded-lg border border-gray-200 p-4 shadow-sm ${className}`}
    >
      <Flex direction="row" align="start" justify="between" gap="4">
        <Box className="flex-1">
          <h3 className="text-base font-semibold text-gray-900 mb-1">
            {task.title}
          </h3>
          {task.description && (
            <p className="text-sm text-gray-600 mb-3">{task.description}</p>
          )}
          <Flex direction="row" align="center" gap="2" wrap="wrap">
            {/* Status tag */}
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusClass(
                task.status
              )}`}
            >
              {statusOptions.find(opt => opt.value === task.status)?.label ||
                task.status}
            </span>
            {/* Priority tag */}
            {task.priority && (
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityClass(
                  task.priority
                )}`}
              >
                {priorityOptions.find(opt => opt.value === task.priority)
                  ?.label || task.priority}
              </span>
            )}
            {/* Sprint tag */}
            {task.sprint && (
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-500 text-white">
                {sprintOptions.find(opt => opt.value === task.sprint)?.label ||
                  task.sprint}
              </span>
            )}
          </Flex>
          {task.assignee && (
            <p className="text-sm text-gray-600 mt-2">
              {t("backlog.assignee")}: {task.assignee}
            </p>
          )}
        </Box>
        {task.updatedDate && (
          <Box className="text-sm text-gray-500">
            {t("backlog.updatedDate")}: {task.updatedDate}
          </Box>
        )}
      </Flex>
    </Box>
  );
}

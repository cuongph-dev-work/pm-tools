import { Box, Flex, Text } from "@radix-ui/themes";
import { useTranslation } from "react-i18next";
import type { TaskDTO } from "../../../application/dto/TaskDTO";

interface TaskCardProps {
  task: TaskDTO;
  statusOptions: Array<{ value: string; label: string }>;
  priorityOptions: Array<{ value: string; label: string }>;
  className?: string;
}

export function TaskCard({
  task,
  statusOptions,
  priorityOptions,
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
            <Box mb="3">
              <Text as="p" size="2" className="text-sm text-gray-600">
                {task.description}
              </Text>
            </Box>
          )}
          <Flex direction="row" align="center" gap="2" wrap="wrap">
            {/* Status tag */}
            <Text
              as="span"
              className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusClass(
                task.status
              )}`}
            >
              {statusOptions.find(opt => opt.value === task.status)?.label ||
                task.status}
            </Text>
            {/* Priority tag */}
            {task.priority && (
              <Text
                as="span"
                className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityClass(
                  task.priority
                )}`}
              >
                {priorityOptions.find(opt => opt.value === task.priority)
                  ?.label || task.priority}
              </Text>
            )}
            {/* Sprint tag */}
            {task.sprints && task.sprints.length > 0 && (
              <Text
                as="span"
                className="px-2 py-1 rounded-full text-xs font-medium bg-blue-500 text-white"
              >
                {task.sprints[0].name}
              </Text>
            )}
          </Flex>
          {task.assignee && (
            <Box mt="2">
              <Text as="p" size="2" className="text-sm text-gray-600">
                {t("backlog.assignee")}: {task.assignee.fullName}
              </Text>
            </Box>
          )}
        </Box>
        {task.updated_at && (
          <Box className="text-sm text-gray-500">
            {t("backlog.updatedDate")}:{" "}
            {new Date(task.updated_at).toLocaleDateString()}
          </Box>
        )}
      </Flex>
    </Box>
  );
}

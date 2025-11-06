import { Box, Flex, IconButton, Text } from "@radix-ui/themes";
import { Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Select } from "~/shared/components/atoms/Select";
import type { TaskDTO } from "../../../application/dto/TaskDto";

interface TaskCardProps {
  task: TaskDTO;
  statusOptions: Array<{ value: string; label: string }>;
  priorityOptions: Array<{ value: string; label: string }>;
  sprintOptions?: Array<{ value: string; label: string }>;
  onDelete?: (taskId: string) => void;
  onStatusChange?: (taskId: string, status: string) => void;
  className?: string;
}

export function TaskCard({
  task,
  statusOptions,
  priorityOptions,
  onDelete,
  onStatusChange,
  className = "",
}: TaskCardProps) {
  const { t, i18n } = useTranslation();

  // Map API status (uppercase) to UI status (lowercase/kebab-case)
  const mapStatusToUI = (status: string): string => {
    const upperStatus = status.toUpperCase();
    const statusMap: Record<string, string> = {
      OPEN: "open",
      REOPEN: "reopen",
      IN_PROGRESS: "in-progress",
      "IN-PROGRESS": "in-progress",
      IN_REVIEW: "in-review",
      "IN-REVIEW": "in-review",
      RESOLVED: "resolved",
      DONE: "done",
      PENDING: "pending",
      CANCELLED: "cancelled",
      // Legacy statuses
      TODO: "open", // Map TODO to OPEN
      BLOCKED: "pending", // Map BLOCKED to PENDING
    };
    return statusMap[upperStatus] || status.toLowerCase();
  };

  // Map API priority (uppercase) to UI priority (lowercase)
  const mapPriorityToUI = (priority?: string | null): string | undefined => {
    if (!priority) return undefined;
    return priority.toLowerCase();
  };

  const uiStatus = mapStatusToUI(task.status);
  const uiPriority = mapPriorityToUI(task.priority);

  // Get status label from options or fallback to i18n translation
  const statusLabel =
    statusOptions.find(opt => opt.value === uiStatus)?.label ||
    statusOptions.find(opt => opt.value === task.status.toLowerCase())?.label ||
    t(`backlog.status.${uiStatus}`, { defaultValue: task.status });

  // Get priority label from options or fallback to i18n translation
  const priorityLabel =
    priorityOptions.find(opt => opt.value === uiPriority)?.label ||
    priorityOptions.find(opt => opt.value === task.priority?.toLowerCase())
      ?.label ||
    (task.priority
      ? t(`backlog.priority.${uiPriority}`, { defaultValue: task.priority })
      : undefined);

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString(i18n.language === "vi" ? "vi-VN" : "en-US", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <Box
      className={`bg-white rounded-lg border border-gray-200 p-4 shadow-sm ${className}`}
    >
      {/* Header: Title + Delete icon */}
      <Flex direction="row" align="start" justify="between" mb="2">
        <Box className="flex-1 pr-4">
          <h3 className="text-lg font-bold text-gray-900 mb-1">{task.title}</h3>
          {task.description && (
            <Text as="p" size="2" className="text-sm text-gray-600">
              {task.description}
            </Text>
          )}
        </Box>
        {onDelete && (
          <IconButton
            variant="ghost"
            color="red"
            size="1"
            onClick={() => onDelete(task.id)}
            className="flex-shrink-0"
          >
            <Trash2 className="w-4 h-4 text-red-600" />
          </IconButton>
        )}
      </Flex>

      {/* Tags: Status, Priority, Sprint */}
      <Flex direction="row" align="center" gap="2" wrap="wrap" mb="3">
        {/* Status tag - grey */}
        <Text
          as="span"
          className="px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800"
        >
          {statusLabel}
        </Text>
        {/* Priority tag - red */}
        {task.priority && (
          <Text
            as="span"
            className="px-2 py-1 rounded text-xs font-medium bg-red-50 text-red-600"
          >
            {priorityLabel}
          </Text>
        )}
        {/* Sprint tag - blue */}
        {task.sprints && task.sprints.length > 0 && (
          <Text
            as="span"
            className="px-2 py-1 rounded text-xs font-medium bg-blue-50 text-blue-600"
          >
            {task.sprints[0].name}
          </Text>
        )}
      </Flex>

      {/* Bottom section: Left (Assignee + Status dropdown) and Right (Updated date) */}
      <Flex direction="row" align="start" justify="between" gap="4">
        {/* Left side: Assignee + Status dropdown */}
        <Box className="flex-1">
          <Text as="p" size="2" className="text-sm text-gray-600" mb="2">
            {t("backlog.assignee")}:{" "}
            {task.assignee?.fullName || t("backlog.unassignee")}
          </Text>
          {/* Status dropdown */}
          {onStatusChange && (
            <Box className="max-w-[200px]">
              <Select
                value={uiStatus}
                options={statusOptions}
                onChange={value => onStatusChange(task.id, value)}
                placeholder={t("backlog.status.select")}
              />
            </Box>
          )}
        </Box>

        {/* Right side: Updated date */}
        {task.updated_at && (
          <Box className="flex-shrink-0">
            <Text as="p" size="2" className="text-sm text-gray-600">
              {t("backlog.updatedDate")}: {formatDate(task.updated_at)}
            </Text>
          </Box>
        )}
      </Flex>
    </Box>
  );
}

import type { TFunction } from "i18next";
import {
  TASK_PRIORITY,
  TASK_STATUS,
  TASK_TYPE,
} from "~/domains/backlog/application/dto/TaskDto";

export interface SelectOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

export interface TaskTypeOptionWithIcon extends SelectOption {
  icon: React.ReactNode;
}

/**
 * Get task status options for filters/selects
 */
export function getTaskStatusOptions(t: TFunction): SelectOption[] {
  return [
    {
      value: TASK_STATUS.OPEN.toLowerCase(),
      label: t("backlog.status.open"),
    },
    {
      value: TASK_STATUS.REOPEN.toLowerCase(),
      label: t("backlog.status.reopen"),
    },
    {
      value: TASK_STATUS.IN_PROGRESS.toLowerCase().replace("_", "-"),
      label: t("backlog.status.inProgress"),
    },
    {
      value: TASK_STATUS.IN_REVIEW.toLowerCase().replace("_", "-"),
      label: t("backlog.status.inReview"),
    },
    {
      value: TASK_STATUS.RESOLVED.toLowerCase(),
      label: t("backlog.status.resolved"),
    },
    {
      value: TASK_STATUS.DONE.toLowerCase(),
      label: t("backlog.status.done"),
    },
    {
      value: TASK_STATUS.PENDING.toLowerCase(),
      label: t("backlog.status.pending"),
    },
    {
      value: TASK_STATUS.CANCELLED.toLowerCase(),
      label: t("backlog.status.cancelled"),
    },
  ];
}

/**
 * Get task priority options for filters/selects
 */
export function getTaskPriorityOptions(t: TFunction): SelectOption[] {
  return [
    {
      value: TASK_PRIORITY.HIGH.toLowerCase(),
      label: t("backlog.priority.high"),
    },
    {
      value: TASK_PRIORITY.MEDIUM.toLowerCase(),
      label: t("backlog.priority.medium"),
    },
    {
      value: TASK_PRIORITY.LOW.toLowerCase(),
      label: t("backlog.priority.low"),
    },
  ];
}

/**
 * Get task type options for selects (without icons)
 */
export function getTaskTypeOptions(t: TFunction): Omit<SelectOption, "icon">[] {
  return [
    {
      value: TASK_TYPE.TASK,
      label: t("backlog.taskTypes.task"),
    },
    {
      value: TASK_TYPE.CHANGE_REQUEST,
      label: t("backlog.taskTypes.changeRequest"),
    },
    {
      value: TASK_TYPE.FEEDBACK,
      label: t("backlog.taskTypes.feedback"),
    },
    {
      value: TASK_TYPE.NEW_FEATURE,
      label: t("backlog.taskTypes.newFeature"),
    },
    {
      value: TASK_TYPE.SUB_TASK,
      label: t("backlog.taskTypes.subTask"),
    },
    {
      value: TASK_TYPE.IMPROVEMENT,
      label: t("backlog.taskTypes.improvement"),
    },
    {
      value: TASK_TYPE.BUG,
      label: t("backlog.taskTypes.bug"),
    },
    {
      value: TASK_TYPE.BUG_CUSTOMER,
      label: t("backlog.taskTypes.bugCustomer"),
    },
    {
      value: TASK_TYPE.LEAKAGE,
      label: t("backlog.taskTypes.leakage"),
    },
  ];
}

/**
 * Get task type options with icons for CreateTaskForm
 * Icons are defined here as they require React components
 */
export function getTaskTypeOptionsWithIcons(
  t: TFunction,
  icons: Record<TASK_TYPE, React.ReactNode>
): TaskTypeOptionWithIcon[] {
  const baseOptions = getTaskTypeOptions(t);
  return baseOptions.map(option => ({
    ...option,
    icon: icons[option.value as TASK_TYPE],
  })) as TaskTypeOptionWithIcon[];
}

/**
 * Map status from UI format (lowercase/kebab-case) to API format (uppercase)
 */
export function mapStatusToApi(status: string): string {
  const statusMap: Record<string, string> = {
    open: TASK_STATUS.OPEN,
    reopen: TASK_STATUS.REOPEN,
    "in-progress": TASK_STATUS.IN_PROGRESS,
    in_progress: TASK_STATUS.IN_PROGRESS,
    "in-review": TASK_STATUS.IN_REVIEW,
    in_review: TASK_STATUS.IN_REVIEW,
    resolved: TASK_STATUS.RESOLVED,
    done: TASK_STATUS.DONE,
    pending: TASK_STATUS.PENDING,
    cancelled: TASK_STATUS.CANCELLED,
  };

  const normalizedStatus = status.toLowerCase();
  return statusMap[normalizedStatus] || status.toUpperCase();
}

/**
 * Map priority from UI format (lowercase) to API format (uppercase)
 */
export function mapPriorityToApi(priority: string): string {
  const priorityMap: Record<string, string> = {
    high: TASK_PRIORITY.HIGH,
    medium: TASK_PRIORITY.MEDIUM,
    low: TASK_PRIORITY.LOW,
  };

  const normalizedPriority = priority.toLowerCase();
  return priorityMap[normalizedPriority] || priority.toUpperCase();
}

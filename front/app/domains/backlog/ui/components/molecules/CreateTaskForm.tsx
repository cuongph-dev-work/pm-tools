import { Box, Flex } from "@radix-ui/themes";
import {
  IconAlertTriangle,
  IconBug,
  IconBulb,
  IconChecklist,
  IconMessageCircle,
  IconSparkles,
  IconTrendingUp,
  IconUsers,
} from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import {
  TASK_PRIORITY,
  TASK_TYPE,
} from "~/domains/backlog/application/dto/TaskDTO";
import {
  FormFieldAssigneeSearch,
  FormFieldDatePicker,
  FormFieldInput,
  FormFieldSelect,
  FormFieldTagInput,
  FormFieldTextarea,
} from "~/shared/components/molecules/form-field";
import type { SelectOption } from "~/shared/components/molecules/form-field/FormFieldSelect";
import type { AnyFormApi } from "~/shared/components/molecules/form-field/types";

interface CreateTaskFormProps {
  form: AnyFormApi;
}

export function CreateTaskForm({ form }: CreateTaskFormProps) {
  const { t } = useTranslation();

  const taskTypeOptions: SelectOption[] = [
    {
      value: TASK_TYPE.TASK,
      label: t("backlog.taskTypes.task"),
      icon: <IconChecklist className="w-4 h-4 text-blue-600" stroke={2} />,
    },
    {
      value: TASK_TYPE.CHANGE_REQUEST,
      label: t("backlog.taskTypes.changeRequest"),
      icon: <IconTrendingUp className="w-4 h-4 text-orange-600" stroke={2} />,
    },
    {
      value: TASK_TYPE.FEEDBACK,
      label: t("backlog.taskTypes.feedback"),
      icon: (
        <IconMessageCircle className="w-4 h-4 text-purple-600" stroke={2} />
      ),
    },
    {
      value: TASK_TYPE.NEW_FEATURE,
      label: t("backlog.taskTypes.newFeature"),
      icon: <IconSparkles className="w-4 h-4 text-green-600" stroke={2} />,
    },
    {
      value: TASK_TYPE.SUB_TASK,
      label: t("backlog.taskTypes.subTask"),
      icon: <IconChecklist className="w-4 h-4 text-cyan-600" stroke={2} />,
    },
    {
      value: TASK_TYPE.IMPROVEMENT,
      label: t("backlog.taskTypes.improvement"),
      icon: <IconBulb className="w-4 h-4 text-yellow-600" stroke={2} />,
    },
    {
      value: TASK_TYPE.BUG,
      label: t("backlog.taskTypes.bug"),
      icon: <IconBug className="w-4 h-4 text-red-600" stroke={2} />,
    },
    {
      value: TASK_TYPE.BUG_CUSTOMER,
      label: t("backlog.taskTypes.bugCustomer"),
      icon: <IconUsers className="w-4 h-4 text-pink-600" stroke={2} />,
    },
    {
      value: TASK_TYPE.LEAKAGE,
      label: t("backlog.taskTypes.leakage"),
      icon: <IconAlertTriangle className="w-4 h-4 text-rose-600" stroke={2} />,
    },
  ];

  const priorityOptions: SelectOption[] = [
    { value: TASK_PRIORITY.LOW, label: t("backlog.priority.low") },
    { value: TASK_PRIORITY.MEDIUM, label: t("backlog.priority.medium") },
    { value: TASK_PRIORITY.HIGH, label: t("backlog.priority.high") },
  ];

  return (
    <Box className="space-y-4 mt-2">
      <FormFieldSelect
        name="type"
        form={form}
        label={t("backlog.form.type")}
        options={taskTypeOptions}
        placeholder={t("backlog.taskTypes.task")}
        leftIcon={
          <IconChecklist className="w-4 h-4 text-blue-600" stroke={2} />
        }
        isRequired
      />

      <FormFieldInput
        name="title"
        form={form}
        label={t("backlog.form.title")}
        placeholder={t("backlog.form.titlePlaceholder")}
        isRequired
      />

      <FormFieldTextarea
        name="description"
        form={form}
        label={t("backlog.form.description")}
        placeholder={t("backlog.form.descriptionPlaceholder")}
        rows={3}
      />

      <Flex gap="2">
        <Box className="w-[200px]">
          <FormFieldSelect
            name="priority"
            form={form}
            label={t("backlog.form.priority")}
            options={priorityOptions}
            placeholder={t("backlog.priority.medium")}
          />
        </Box>
        <Box className="w-[200px]">
          <FormFieldInput
            name="estimateHours"
            form={form}
            type="text"
            label={t("backlog.form.estimate")}
            placeholder="3.5h, 2d 1h, 3w 2d 1h"
            description={t("backlog.form.estimateHint", {
              defaultValue: "Ví dụ: 3.5, 3.5h, 2d 1h, 3w 2d 1h",
            })}
          />
        </Box>
      </Flex>

      <FormFieldAssigneeSearch
        name="assignee"
        form={form}
        label={t("backlog.form.assignee")}
        placeholder={t("backlog.form.assigneePlaceholder")}
        isRequired
      />

      <FormFieldDatePicker
        name="dueDate"
        form={form}
        label={t("backlog.form.dueDate")}
        isRequired
      />

      <FormFieldTagInput
        name="tags"
        form={form}
        label={t("backlog.form.tags")}
        placeholder={t("backlog.form.tagsPlaceholder")}
        description={t("backlog.form.tagsHint")}
      />
    </Box>
  );
}

export default CreateTaskForm;

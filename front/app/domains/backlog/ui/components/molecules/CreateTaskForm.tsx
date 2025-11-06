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
import { useField } from "@tanstack/react-form";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { TASK_TYPE } from "~/domains/backlog/application/dto/TaskDto";
import {
  FormFieldAssigneeSearch,
  FormFieldDatePicker,
  FormFieldInput,
  FormFieldSelect,
  FormFieldTagInput,
  FormFieldTaskSearch,
  FormFieldTextarea,
} from "~/shared/components/molecules/form-field";
import type { AnyFormApi } from "~/shared/components/molecules/form-field/types";
import {
  getTaskPriorityOptions,
  getTaskTypeOptionsWithIcons,
} from "~/shared/constants/taskOptions";
import { useProjects } from "~/shared/hooks/useProjects";

interface CreateTaskFormProps {
  form: AnyFormApi;
  projectId?: string;
}

export function CreateTaskForm({
  form,
  projectId: propProjectId,
}: CreateTaskFormProps) {
  const { t } = useTranslation();
  const { currentProject } = useProjects();
  const projectId = propProjectId || currentProject?.id || "";
  const typeField = useField({ name: "type", form });
  const taskType = typeField.state.value;
  const isSubTask = taskType === TASK_TYPE.SUB_TASK;

  // Task type icons mapping
  const taskTypeIcons = useMemo(
    () => ({
      [TASK_TYPE.TASK]: (
        <IconChecklist className="w-4 h-4 text-blue-600" stroke={2} />
      ),
      [TASK_TYPE.CHANGE_REQUEST]: (
        <IconTrendingUp className="w-4 h-4 text-orange-600" stroke={2} />
      ),
      [TASK_TYPE.FEEDBACK]: (
        <IconMessageCircle className="w-4 h-4 text-purple-600" stroke={2} />
      ),
      [TASK_TYPE.NEW_FEATURE]: (
        <IconSparkles className="w-4 h-4 text-green-600" stroke={2} />
      ),
      [TASK_TYPE.SUB_TASK]: (
        <IconChecklist className="w-4 h-4 text-cyan-600" stroke={2} />
      ),
      [TASK_TYPE.IMPROVEMENT]: (
        <IconBulb className="w-4 h-4 text-yellow-600" stroke={2} />
      ),
      [TASK_TYPE.BUG]: <IconBug className="w-4 h-4 text-red-600" stroke={2} />,
      [TASK_TYPE.BUG_CUSTOMER]: (
        <IconUsers className="w-4 h-4 text-pink-600" stroke={2} />
      ),
      [TASK_TYPE.LEAKAGE]: (
        <IconAlertTriangle className="w-4 h-4 text-rose-600" stroke={2} />
      ),
    }),
    []
  );

  // Task type options - using constants with icons
  const taskTypeOptions = useMemo(
    () => getTaskTypeOptionsWithIcons(t, taskTypeIcons),
    [t, taskTypeIcons]
  );

  // Priority options - using constants
  const priorityOptions = useMemo(() => getTaskPriorityOptions(t), [t]);

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

      {isSubTask && (
        <FormFieldTaskSearch
          name="parentTaskId"
          form={form}
          projectId={projectId}
          label={t("backlog.form.parentTask", {
            defaultValue: "Task cha",
          })}
          placeholder={t("backlog.form.parentTaskPlaceholder", {
            defaultValue: "Chọn task cha",
          })}
          isRequired
        />
      )}

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

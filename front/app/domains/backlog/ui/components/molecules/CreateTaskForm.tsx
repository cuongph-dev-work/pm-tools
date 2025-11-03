import { Box, Flex } from "@radix-ui/themes";
import { FileText } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  FormFieldDatePicker,
  FormFieldInput,
  FormFieldSelect,
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
      value: "task",
      label: t("backlog.taskTypes.task"),
      icon: <FileText className="w-4 h-4" />,
    },
    {
      value: "changeRequest",
      label: t("backlog.taskTypes.changeRequest"),
      icon: <FileText className="w-4 h-4" />,
    },
    {
      value: "feedback",
      label: t("backlog.taskTypes.feedback"),
      icon: <FileText className="w-4 h-4" />,
    },
    {
      value: "newFeature",
      label: t("backlog.taskTypes.newFeature"),
      icon: <FileText className="w-4 h-4" />,
    },
    {
      value: "subTask",
      label: t("backlog.taskTypes.subTask"),
      icon: <FileText className="w-4 h-4" />,
    },
    {
      value: "improvement",
      label: t("backlog.taskTypes.improvement"),
      icon: <FileText className="w-4 h-4" />,
    },
    {
      value: "bug",
      label: t("backlog.taskTypes.bug"),
      icon: <FileText className="w-4 h-4" />,
    },
    {
      value: "bugCustomer",
      label: t("backlog.taskTypes.bugCustomer"),
      icon: <FileText className="w-4 h-4" />,
    },
    {
      value: "leakage",
      label: t("backlog.taskTypes.leakage"),
      icon: <FileText className="w-4 h-4" />,
    },
  ];

  const priorityOptions: SelectOption[] = [
    { value: "low", label: t("backlog.priority.low") },
    { value: "medium", label: t("backlog.priority.medium") },
    { value: "high", label: t("backlog.priority.high") },
  ];

  return (
    <Box className="space-y-4 mt-2">
      <FormFieldSelect
        name="type"
        form={form}
        label={t("backlog.form.type")}
        options={taskTypeOptions}
        placeholder={t("backlog.taskTypes.task")}
        leftIcon={<FileText className="w-4 h-4" />}
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
        <FormFieldSelect
          name="priority"
          form={form}
          label={t("backlog.form.priority")}
          options={priorityOptions}
          placeholder={t("backlog.priority.medium")}
        />
        <FormFieldInput
          name="estimateHours"
          form={form}
          type="number"
          label={t("backlog.form.estimate")}
          placeholder="0"
        />
      </Flex>

      <FormFieldInput
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
      />

      <FormFieldInput
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

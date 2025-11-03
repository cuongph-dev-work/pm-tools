import { useForm } from "@tanstack/react-form";
import { useTranslation } from "react-i18next";
import type { AnyFormApi } from "~/shared/components/molecules/form-field/types";
import { createTaskSchema } from "../../domain/validation/task.schema";

export interface CreateTaskFormData {
  type: string;
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  estimateHours: number;
  assignee: string;
  dueDate?: string;
  tags?: string;
}

export interface UseCreateTaskFormOptions {
  onSuccess?: () => void;
}

export function useCreateTaskForm({
  onSuccess,
}: UseCreateTaskFormOptions = {}) {
  const { t } = useTranslation();

  const form = useForm({
    defaultValues: {
      type: "task",
      title: "",
      description: "",
      priority: "medium" as const,
      estimateHours: 0,
      assignee: "",
      dueDate: "",
      tags: "",
    } as CreateTaskFormData,
    validators: {
      onSubmit: createTaskSchema(t),
    },
  });

  return { form: form as unknown as AnyFormApi };
}

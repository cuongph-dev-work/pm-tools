import { useForm } from "@tanstack/react-form";
import { useTranslation } from "react-i18next";
import type { AnyFormApi } from "~/shared/components/molecules/form-field/types";
import {
  createTaskFormSchema,
  type CreateTaskFormData,
} from "../../domain/validation/task.schema";
import { TASK_PRIORITY, TASK_TYPE } from "../dto/TaskDTO";
import { TaskMapper } from "../mappers/TaskMapper";
import { useCreateTaskMutation } from "./useCreateTaskMutation";

export interface UseCreateTaskFormOptions {
  projectId: string;
  onSuccess?: () => void;
}

export function useCreateTaskForm({
  projectId,
  onSuccess,
}: UseCreateTaskFormOptions) {
  const { t } = useTranslation();
  const createMutation = useCreateTaskMutation(projectId);

  const form = useForm({
    defaultValues: {
      type: TASK_TYPE.TASK,
      title: "",
      description: "",
      priority: TASK_PRIORITY.LOW,
      estimateHours: "" as string | number | undefined,
      assignee: "",
      dueDate: "",
      tags: [],
    } as CreateTaskFormData,
    validators: {
      onSubmit: createTaskFormSchema(t),
      onSubmitAsync: async ({ value }) => {
        const taskData = TaskMapper.toCreateRequestDTO(value);
        await createMutation.mutateAsync(taskData);
        form.reset();
        onSuccess?.();
      },
    },
  });

  return {
    form: form as unknown as AnyFormApi,
    isSubmitting: createMutation.isPending,
    error: createMutation.error,
  };
}

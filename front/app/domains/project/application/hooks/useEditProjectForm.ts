import { useForm } from "@tanstack/react-form";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { ProjectMapper } from "../mappers/ProjectMapper";
import type { ProjectId } from "~/domains/project/domain/entities/Project";
import {
  updateProjectSchema,
  type UpdateProjectFormData,
} from "~/domains/project/domain/validation/project.schema";
import type { AnyFormApi } from "~/shared/components/molecules/form-field/types";
import { parseToNativeDate } from "~/shared/utils/date";
import { useUpdateProjectMutation } from "./mutation/update.mutation";

export interface UseEditProjectFormOptions {
  projectId: ProjectId;
  initialValues: Partial<UpdateProjectFormData>;
  onSuccess?: () => void;
}

export function useEditProjectForm({
  projectId,
  initialValues,
  onSuccess,
}: UseEditProjectFormOptions) {
  const { t } = useTranslation();
  const updateMutation = useUpdateProjectMutation();

  const form = useForm({
    defaultValues: {
      name: initialValues.name || "",
      description: initialValues.description || "",
      tags: initialValues.tags || [],
      status: initialValues.status || "ACTIVE",
      startDate: initialValues.startDate || "",
      endDate: initialValues.endDate || "",
    } as UpdateProjectFormData,
    validators: {
      onSubmit: updateProjectSchema(t),
      onSubmitAsync: async ({ value }) => {
        const projectData = ProjectMapper.toUpdateRequestDTO(value);
        await updateMutation.mutateAsync({
          id: projectId,
          data: projectData,
        });
        onSuccess?.();
      },
    },
  });

  const startDateParsed = useMemo(
    () => parseToNativeDate(form.state.values.startDate),
    [form.state.values.startDate]
  );

  const endDateParsed = useMemo(
    () => parseToNativeDate(form.state.values.endDate),
    [form.state.values.endDate]
  );

  return {
    form: form as unknown as AnyFormApi,
    isSubmitting: updateMutation.isPending,
    error: updateMutation.error,
    startDateParsed,
    endDateParsed,
  };
}

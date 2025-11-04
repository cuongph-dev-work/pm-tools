import { useForm } from "@tanstack/react-form";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { ProjectMapper } from "../mappers/ProjectMapper";
import {
  createProjectSchema,
  type CreateProjectFormData,
} from "~/domains/project/domain/validation/project.schema";
import type { AnyFormApi } from "~/shared/components/molecules/form-field/types";
import { parseToNativeDate } from "~/shared/utils/date";
import { useCreateProjectMutation } from "./mutation/create.mutation";

export interface UseCreateProjectFormOptions {
  onSuccess?: () => void;
}

export function useCreateProjectForm({
  onSuccess,
}: UseCreateProjectFormOptions = {}) {
  const { t } = useTranslation();
  const createMutation = useCreateProjectMutation();

  const form = useForm({
    defaultValues: {
      name: "",
      description: "",
      tags: [],
      startDate: "",
      endDate: "",
    } as CreateProjectFormData,
    validators: {
      onSubmit: createProjectSchema(t),
      onSubmitAsync: async ({ value }) => {
        const projectData = ProjectMapper.toCreateRequestDTO(value);
        await createMutation.mutateAsync(projectData);
        form.reset();
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
    isSubmitting: createMutation.isPending,
    error: createMutation.error,
    startDateParsed,
    endDateParsed,
  };
}

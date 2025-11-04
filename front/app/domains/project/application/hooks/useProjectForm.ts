import { useField, useForm } from "@tanstack/react-form";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import type { AnyFormApi } from "~/shared/components/molecules/form-field/types";
import { parseToNativeDate } from "~/shared/utils/date";
import {
  createProjectSchema,
  type ProjectFormData,
} from "../../domain/validation/project.schema";

export interface ProjectFormSubmitData {
  name: string;
  description?: string;
  startDate: string;
  endDate?: string;
  tags?: string;
}

export interface UseProjectFormOptions {
  initialValues?: Partial<ProjectFormData>;
  onSubmit?: (data: ProjectFormSubmitData) => void | Promise<void>;
  onSuccess?: () => void;
}

export function useProjectForm({
  initialValues,
  onSubmit,
  onSuccess,
}: UseProjectFormOptions = {}) {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const asyncSubmitHandler = async ({ value }: { value: ProjectFormData }) => {
    setIsSubmitting(true);
    try {
      await onSubmit?.({
        name: value.name,
        description: value.description || undefined,
        startDate: value.startDate,
        endDate: value.endDate || undefined,
        tags: value.tags || undefined,
      });
      onSuccess?.();
    } finally {
      setIsSubmitting(false);
    }
  };

  const form = useForm({
    defaultValues: {
      name: initialValues?.name || "",
      description: initialValues?.description || "",
      startDate: initialValues?.startDate || "",
      endDate: initialValues?.endDate || "",
      tags: initialValues?.tags || "",
    } as ProjectFormData,
    validators: {
      onSubmit: createProjectSchema(t),
      onSubmitAsync: asyncSubmitHandler,
    },
  });

  const handleCancel = () => {
    form.reset();
  };

  // Cast form to AnyFormApi for useField
  const formApi = form as unknown as AnyFormApi;

  // Get startDate and endDate values from form for minDate/maxDate constraints
  const startDateField = useField({
    name: "startDate",
    form: formApi,
  });
  const endDateField = useField({
    name: "endDate",
    form: formApi,
  });

  const startDateValue = startDateField.state.value as string | undefined;
  const endDateValue = endDateField.state.value as string | undefined;

  // Parse dates for minDate/maxDate props
  const startDateParsed = useMemo(
    () => parseToNativeDate(startDateValue),
    [startDateValue]
  );

  const endDateParsed = useMemo(
    () => parseToNativeDate(endDateValue),
    [endDateValue]
  );

  return {
    form: form as unknown as AnyFormApi,
    isSubmitting,
    handleCancel,
    startDateParsed,
    endDateParsed,
  };
}

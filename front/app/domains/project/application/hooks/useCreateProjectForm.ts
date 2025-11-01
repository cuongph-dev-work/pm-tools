import { useField, useForm } from "@tanstack/react-form";
import dayjs from "dayjs";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import type { AnyFormApi } from "~/shared/components/molecules/form-field/types";
import {
  createProjectSchema,
  type ProjectFormData,
} from "../../domain/validation/project.schema";

export interface UseCreateProjectFormOptions {
  onSubmit?: (data: {
    name: string;
    description?: string;
    startDate: string;
    endDate?: string;
    tags?: string;
  }) => void | Promise<void>;
  onSuccess?: () => void;
}

export function useCreateProjectForm({
  onSubmit,
  onSuccess,
}: UseCreateProjectFormOptions = {}) {
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
      name: "",
      description: "",
      startDate: "",
      endDate: "",
      tags: "",
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
  const startDateParsed = useMemo(() => {
    if (!startDateValue) return undefined;
    const date = dayjs(startDateValue);
    return date.isValid() ? date.toDate() : undefined;
  }, [startDateValue]);

  const endDateParsed = useMemo(() => {
    if (!endDateValue) return undefined;
    const date = dayjs(endDateValue);
    return date.isValid() ? date.toDate() : undefined;
  }, [endDateValue]);

  return {
    form: form as unknown as AnyFormApi,
    isSubmitting,
    handleCancel,
    startDateParsed,
    endDateParsed,
  };
}

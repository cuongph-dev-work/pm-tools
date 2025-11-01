import { useForm } from "@tanstack/react-form";
import { useState } from "react";
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
    startDate?: string;
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
        // startDate: value.startDate || undefined,
        // endDate: value.endDate || undefined,
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
      // startDate: "",
      // endDate: "",
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

  return {
    form: form as unknown as AnyFormApi,
    isSubmitting,
    handleCancel,
  };
}

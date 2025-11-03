import { useForm } from "@tanstack/react-form";
import { valibotValidator } from "@tanstack/valibot-form-adapter";
import { useTranslation } from "react-i18next";
import { createProjectSchema, type CreateProjectFormData } from "~/domains/project/domain/validation/project.schema";
import { useCreateProjectMutation } from "./useCreateProjectMutation";
import { ProjectMapper } from "../mappers/ProjectMapper";

export interface UseCreateProjectFormOptions {
  onSuccess?: () => void;
}

export function useCreateProjectForm({ onSuccess }: UseCreateProjectFormOptions = {}) {
  const { t } = useTranslation();
  const createMutation = useCreateProjectMutation();

  const form = useForm({
    defaultValues: {
      name: "",
      description: "",
      tags: "",
      startDate: "",
      endDate: "",
    } as CreateProjectFormData,
    validatorAdapter: valibotValidator(),
    validators: {
      onSubmit: createProjectSchema(t),
    },
    onSubmit: async ({ value }) => {
      try {
        const requestData = ProjectMapper.toCreateRequestDTO(value);
        await createMutation.mutateAsync(requestData);
        onSuccess?.();
      } catch (error) {
        console.error("Failed to create project:", error);
        throw error;
      }
    },
  });

  return {
    form,
    isSubmitting: createMutation.isPending,
    error: createMutation.error,
  };
}

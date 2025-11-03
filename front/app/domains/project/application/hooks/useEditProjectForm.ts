import { useForm } from "@tanstack/react-form";
import { valibotValidator } from "@tanstack/valibot-form-adapter";
import { useTranslation } from "react-i18next";
import type { ProjectId } from "~/domains/project/domain/entities/Project";
import { updateProjectSchema, type UpdateProjectFormData } from "~/domains/project/domain/validation/project.schema";
import { useUpdateProjectMutation } from "./useUpdateProjectMutation";
import { ProjectMapper } from "../mappers/ProjectMapper";

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
      tags: initialValues.tags || "",
      status: initialValues.status || "ACTIVE",
      startDate: initialValues.startDate || "",
      endDate: initialValues.endDate || "",
    } as UpdateProjectFormData,
    validatorAdapter: valibotValidator(),
    validators: {
      onSubmit: updateProjectSchema(t),
    },
    onSubmit: async ({ value }) => {
      try {
        const requestData = ProjectMapper.toUpdateRequestDTO(value);
        await updateMutation.mutateAsync({ id: projectId, data: requestData });
        onSuccess?.();
      } catch (error) {
        console.error("Failed to update project:", error);
        throw error;
      }
    },
  });

  return {
    form,
    isSubmitting: updateMutation.isPending,
    error: updateMutation.error,
  };
}

import type { ProjectFormData } from "../../domain/validation/project.schema";
import { useProjectForm, type ProjectFormSubmitData } from "./useProjectForm";

export interface UseEditProjectFormOptions {
  initialValues: Partial<ProjectFormData>;
  onSubmit?: (data: ProjectFormSubmitData) => void | Promise<void>;
  onSuccess?: () => void;
}

export function useEditProjectForm({
  initialValues,
  onSubmit,
  onSuccess,
}: UseEditProjectFormOptions) {
  return useProjectForm({
    initialValues,
    onSubmit,
    onSuccess,
  });
}

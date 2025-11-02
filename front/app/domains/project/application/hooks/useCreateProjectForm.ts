import { useProjectForm, type ProjectFormSubmitData } from "./useProjectForm";

export interface UseCreateProjectFormOptions {
  onSubmit?: (data: ProjectFormSubmitData) => void | Promise<void>;
  onSuccess?: () => void;
}

export function useCreateProjectForm({
  onSubmit,
  onSuccess,
}: UseCreateProjectFormOptions = {}) {
  return useProjectForm({
    initialValues: undefined,
    onSubmit,
    onSuccess,
  });
}

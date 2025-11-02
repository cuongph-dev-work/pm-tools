import { useForm } from "@tanstack/react-form";
import { useTranslation } from "react-i18next";
import type { AnyFormApi } from "~/shared/components/molecules/form-field/types";
import type { SignInDto } from "../dto/SignInDto";

export interface LoginFormData {
  email: string;
  password: string;
}

export interface UseLoginFormOptions {
  initialValues?: Partial<LoginFormData>;
  onSubmit?: (data: SignInDto) => void | Promise<void>;
  onSuccess?: () => void;
  externalLoading?: boolean;
  externalError?: string | null;
}

export function useLoginForm({
  initialValues,
  onSubmit,
  onSuccess,
  externalLoading = false,
  externalError = null,
}: UseLoginFormOptions = {}) {
  const { t } = useTranslation();

  const asyncSubmitHandler = async ({ value }: { value: LoginFormData }) => {
    await onSubmit?.({
      email: value.email,
      password: value.password,
    });
    onSuccess?.();
  };

  const form = useForm({
    defaultValues: {
      email: initialValues?.email || "admin@example.com",
      password: initialValues?.password || "password",
    } as LoginFormData,
    validators: {
      onSubmit: ({ value }) => {
        const errors: Record<string, string | undefined> = {};

        if (!value.email || value.email.trim() === "") {
          errors.email = t("validation.email.required");
        } else if (!/\S+@\S+\.\S+/.test(value.email)) {
          errors.email = t("validation.email.invalid");
        }

        if (!value.password || value.password.trim() === "") {
          errors.password = t("validation.password.required");
        }

        if (Object.keys(errors).length > 0) {
          return errors;
        }
        return undefined;
      },
      onSubmitAsync: asyncSubmitHandler,
    },
  });

  // Cast form to AnyFormApi for useField
  const formApi = form as unknown as AnyFormApi;

  return {
    form: formApi,
    isSubmitting: externalLoading,
    submitError: externalError,
  };
}

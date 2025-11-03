import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import type { AnyFormApi } from "~/shared/components/molecules/form-field/types";
import { queryKeys } from "~/shared/constants/queryKeys";
import { useAuth } from "~/shared/hooks/useAuth";
import { createLoginSchema } from "../../domain/validation/auth.schema";
import { ApiAuthRepository } from "../../infrastructure/repositories/ApiAuthRepository";
import type { SignInDto } from "../dto/SignInDto";
import { SignInUseCase } from "../use-cases/SignInUseCase";

export interface LoginFormData {
  email: string;
  password: string;
}

export function useLoginForm() {
  const { t } = useTranslation();
  const { setUser, setTokens } = useAuth();
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationKey: queryKeys.auth.signIn(),
    mutationFn: async (credentials: SignInDto) => {
      const repository = new ApiAuthRepository();
      const useCase = new SignInUseCase(repository);
      return useCase.execute(credentials);
    },
  });

  const asyncSubmitHandler = async ({ value }: { value: LoginFormData }) => {
    const response = await mutation.mutateAsync({
      email: value.email,
      password: value.password,
    });

    setTokens(response.access_token, response.refresh_token);
    setUser({ id: String(response.sub), name: "User", email: value.email });
    navigate("/");
  };

  const form = useForm({
    defaultValues: {
      email: "admin@example.com",
      password: "Password@123",
    } as LoginFormData,
    validators: {
      onSubmit: createLoginSchema(t),
      onSubmitAsync: asyncSubmitHandler,
    },
  });

  // Cast form to AnyFormApi for useField
  const formApi = form as unknown as AnyFormApi;

  return {
    form: formApi,
    isSubmitting: mutation.isPending,
    submitError: mutation.error
      ? mutation.error instanceof Error
        ? mutation.error.message
        : "An error occurred"
      : null,
  };
}

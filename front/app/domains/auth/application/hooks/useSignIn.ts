import { useMutation } from "@tanstack/react-query";
import { queryKeys } from "~/shared/constants/queryKeys";
import { ApiAuthRepository } from "../../infrastructure/repositories/ApiAuthRepository";
import type { SignInDto } from "../dto/SignInDto";
import { SignInUseCase } from "../use-cases/SignInUseCase";

export function useSignIn() {
  const mutation = useMutation({
    mutationKey: queryKeys.auth.signIn(),
    mutationFn: async (credentials: SignInDto) => {
      const repository = new ApiAuthRepository();
      const useCase = new SignInUseCase(repository);
      return useCase.execute(credentials);
    },
  });

  return {
    signIn: mutation.mutateAsync,
    loading: mutation.isPending,
    error: mutation.error
      ? mutation.error instanceof Error
        ? mutation.error.message
        : "An error occurred"
      : null,
    reset: mutation.reset,
  } as const;
}

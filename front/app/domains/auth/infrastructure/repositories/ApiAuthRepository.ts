import { apiPost } from "~/shared/utils/api";
import type { SignInDto } from "../../application/dto/SignInDto";
import type { SignInResponse } from "../../application/dto/SignInResponse";
import type { AuthRepository } from "../../domain/repositories/AuthRepository";

export class ApiAuthRepository implements AuthRepository {
  async signIn(credentials: SignInDto): Promise<SignInResponse> {
    return apiPost<SignInResponse>("/auth/sign-in", credentials);
  }
}

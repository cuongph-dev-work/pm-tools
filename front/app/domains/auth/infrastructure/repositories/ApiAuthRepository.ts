import { apiRequest } from "../../../../shared/utils/api";
import type { SignInDto } from "../../application/dto/SignInDto";
import type { SignInResponse } from "../../application/dto/SignInResponse";
import type { AuthRepository } from "../../domain/repositories/AuthRepository";
import { AUTH_ENDPOINTS } from "../endpoints";

export class ApiAuthRepository implements AuthRepository {
  async signIn(credentials: SignInDto): Promise<SignInResponse> {
    return apiRequest<SignInResponse>(AUTH_ENDPOINTS.signIn, {
      method: "POST",
      data: credentials,
    });
  }
}

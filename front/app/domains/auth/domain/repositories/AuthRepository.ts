import type { SignInDto } from "../../application/dto/SignInDto";
import type { SignInResponse } from "../../application/dto/SignInResponse";

export interface AuthRepository {
  signIn(credentials: SignInDto): Promise<SignInResponse>;
}

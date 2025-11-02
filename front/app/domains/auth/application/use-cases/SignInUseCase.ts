import type { SignInDto } from "../dto/SignInDto";
import type { SignInResponse } from "../dto/SignInResponse";
import type { AuthRepository } from "../../domain/repositories/AuthRepository";

export class SignInUseCase {
  private readonly repository: AuthRepository;

  constructor(repository: AuthRepository) {
    this.repository = repository;
  }

  async execute(credentials: SignInDto): Promise<SignInResponse> {
    return this.repository.signIn(credentials);
  }
}


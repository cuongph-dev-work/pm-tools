import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateAdministratorDto {
  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  @MinLength(6)
  password?: string;

  @IsString()
  @IsOptional()
  fullName?: string;

  @IsOptional()
  isActive?: boolean;
}

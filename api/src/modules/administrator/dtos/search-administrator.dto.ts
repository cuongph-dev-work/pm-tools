import { PaginationDto } from '@dtos/pagination.dto';
import { IsOptional, IsString } from 'class-validator';

export class SearchAdministratorDto extends PaginationDto {
  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  fullName?: string;
}

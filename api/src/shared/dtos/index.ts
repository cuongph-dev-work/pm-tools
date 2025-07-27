import { NumberField } from '@decorators/validation/number.decorator';

export class PaginationDto {
  @NumberField({ isOptional: true })
  page?: number;

  @NumberField({ isOptional: true })
  limit?: number;
}

import { StringField } from '@decorators/validation/string.decorator';
import { PaginationParams } from '@utils/pagination';
import { EnumField } from '@decorators/validation/enum.decorator';
import { SORT_ORDER } from '@configs/enum/app';

export class SearchUserDto implements PaginationParams {
  @StringField({
    isOptional: true,
    isNumberString: true,
    toInt: true,
  })
  page?: number;

  @StringField({
    isOptional: true,
    isNumberString: true,
    toInt: true,
  })
  limit?: number;

  @StringField({
    isOptional: true,
  })
  sortBy?: string;

  @EnumField(() => SORT_ORDER, {
    isOptional: true,
  })
  sortOrder?: SORT_ORDER;

  @StringField({
    isOptional: true,
  })
  email?: string;

  @StringField({
    isOptional: true,
  })
  phone?: string;
}

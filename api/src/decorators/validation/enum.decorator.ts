import { ToArray } from '@decorators/transform.decorator';
import { applyDecorators } from '@nestjs/common';
import { transformValidationErrors } from '@utils/helper';
import { IsEnum, IsOptional, ValidateIf } from 'class-validator';
import { isEmpty, isNil } from 'lodash';

interface IEnumValidationOption {
  each?: boolean;
  isOptional?: boolean;
}

export const EnumField = <TEnum>(
  getEnum: () => TEnum,
  options: Partial<IEnumValidationOption> = {},
): PropertyDecorator => {
  const enumValue = getEnum() as unknown;
  const decorators = [
    ...(options.isOptional
      ? [
          IsOptional(),
          ValidateIf((_, value) => {
            return !isNil(value) && !isEmpty(value);
          }),
        ]
      : []),
    IsEnum(enumValue as object, {
      each: options?.each,
      message: transformValidationErrors('IsEnum', {
        enum: Object.values(enumValue as object),
      }),
    }),
  ];

  if (options.each) {
    decorators.push(ToArray());
  }

  return applyDecorators(...decorators);
};

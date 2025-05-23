import { IsEnum, IsOptional } from 'class-validator';
import { applyDecorators } from '@nestjs/common';
import { ToArray } from '@decorators/transform.decorator';
import { transformValidationErrors } from '@utils/helper';

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
    ...(options.isOptional ? [IsOptional()] : []),
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

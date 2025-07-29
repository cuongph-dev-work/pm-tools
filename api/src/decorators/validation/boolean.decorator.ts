import { applyDecorators } from '@nestjs/common';
import { transformValidationErrors } from '@utils/helper';
import { IsBoolean, IsOptional } from 'class-validator';

interface IBooleanValidationOption {
  isOptional?: boolean;
  prefix?: string;
}

export const BooleanField = (
  options: Partial<IBooleanValidationOption> = {},
): PropertyDecorator => {
  const { prefix } = options;
  const decorators = [
    ...(options.isOptional ? [IsOptional()] : []),
    IsBoolean({
      message: transformValidationErrors('IsBoolean', {}, prefix),
    }),
  ];
  return applyDecorators(...decorators);
};

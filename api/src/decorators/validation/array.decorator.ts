import { applyDecorators } from '@nestjs/common';
import { Transform, Type } from 'class-transformer';
import { IsArray, IsOptional, ValidateNested } from 'class-validator';

interface IArrayValidationOption {
  isOptional?: boolean;
  each?: boolean;
}

export const ArrayField = <T>(
  type: new () => T,
  options: Partial<IArrayValidationOption> = {},
): PropertyDecorator => {
  return applyDecorators(
    ...(options.isOptional ? [IsOptional()] : []),
    IsArray(),
    ValidateNested({ each: options.each }),
    Type(() => type),
    Transform(({ value }) => {
      if (typeof value === 'string') {
        return value.split(',').map((tag: string) => tag.trim());
      }
      return value;
    }),
  );
};

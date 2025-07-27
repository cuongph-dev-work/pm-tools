import { applyDecorators } from '@nestjs/common';
import { transformValidationErrors } from '@utils/helper';
import { IsDecimal, IsInt, IsNumber, IsOptional, IsPositive, Max, Min } from 'class-validator';

interface INumberValidationOption {
  isOptional?: boolean;
  min?: number;
  max?: number;
  isInt?: boolean;
  isPositive?: boolean;
  isDecimal?: boolean;
  isPercent?: boolean;
  prefix?: string;
}

export const NumberField = (options: Partial<INumberValidationOption> = {}): PropertyDecorator => {
  const { prefix } = options;
  const decorators = [
    ...(options.isOptional ? [IsOptional()] : []),

    IsNumber(
      {},
      {
        message: transformValidationErrors('IsNumber', {}, prefix),
      },
    ),

    ...(options.isInt
      ? [
          IsInt({
            message: transformValidationErrors('IsInt', {}, prefix),
          }),
        ]
      : []),

    ...(options.isDecimal
      ? [
          IsDecimal(
            {},
            {
              message: transformValidationErrors('IsDecimal', {}, prefix),
            },
          ),
        ]
      : []),

    ...(typeof options.min === 'number'
      ? [
          Min(options.min, {
            message: transformValidationErrors('Min', { min: options.min }, prefix),
          }),
        ]
      : []),

    ...(typeof options.max === 'number'
      ? [
          Max(options.max, {
            message: transformValidationErrors('Max', { max: options.max }, prefix),
          }),
        ]
      : []),

    ...(options.isPercent
      ? [
          Min(0, {
            message: transformValidationErrors('MinPercent', { min: 0 }, prefix),
          }),
          Max(100, {
            message: transformValidationErrors('MaxPercent', { max: 100 }, prefix),
          }),
        ]
      : []),

    ...(options.isPositive
      ? [
          IsPositive({
            message: transformValidationErrors('IsPositive', {}, prefix),
          }),
        ]
      : []),
  ];

  return applyDecorators(...decorators);
};

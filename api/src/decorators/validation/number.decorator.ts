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
}

export const NumberField = (options: Partial<INumberValidationOption> = {}): PropertyDecorator => {
  const decorators = [
    ...(options.isOptional ? [IsOptional()] : []),

    IsNumber(
      {},
      {
        message: transformValidationErrors('IsNumber', {}),
      },
    ),

    ...(options.isInt
      ? [
          IsInt({
            message: transformValidationErrors('IsInt', {}),
          }),
        ]
      : []),

    ...(options.isDecimal
      ? [
          IsDecimal(
            {},
            {
              message: transformValidationErrors('IsDecimal', {}),
            },
          ),
        ]
      : []),

    ...(typeof options.min === 'number'
      ? [
          Min(options.min, {
            message: transformValidationErrors('Min', { min: options.min }),
          }),
        ]
      : []),

    ...(typeof options.max === 'number'
      ? [
          Max(options.max, {
            message: transformValidationErrors('Max', { max: options.max }),
          }),
        ]
      : []),

    ...(options.isPercent
      ? [
          Min(0, {
            message: transformValidationErrors('MinPercent', { min: 0 }),
          }),
          Max(100, {
            message: transformValidationErrors('MaxPercent', { max: 100 }),
          }),
        ]
      : []),

    ...(options.isPositive
      ? [
          IsPositive({
            message: transformValidationErrors('IsPositive', {}),
          }),
        ]
      : []),
  ];

  return applyDecorators(...decorators);
};

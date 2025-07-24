import { applyDecorators } from '@nestjs/common';
import { transformValidationErrors } from '@utils/helper';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  ArrayNotEmpty,
  IsArray,
  IsOptional,
  ValidateNested,
  ValidationOptions,
} from 'class-validator';

interface IArrayValidationOption {
  isOptional?: boolean;
  prefix?: string;
  min?: number;
  max?: number;
  isNotEmpty?: boolean;
}

type Constructor<T = any> = new (...args: any[]) => T;

type DecoratorFactory = (options?: ValidationOptions) => PropertyDecorator;

function isDecoratorFactory(input: any): input is DecoratorFactory {
  return typeof input === 'function' && input.length <= 1;
}

export const ArrayField = <T = any>(
  typeOrDecorator: Constructor<T> | DecoratorFactory,
  options: Partial<IArrayValidationOption> = {},
): PropertyDecorator => {
  const { prefix, min, max, isNotEmpty } = options;
  const decorators: PropertyDecorator[] = [];

  decorators.push(
    IsArray({
      message: transformValidationErrors('IsArray', {}, prefix),
    }),
  );

  if (options.isOptional) {
    decorators.push(IsOptional());
  }

  if (isNotEmpty) {
    decorators.push(
      ArrayNotEmpty({
        message: transformValidationErrors('ArrayNotEmpty', {}, prefix),
      }),
    );
  }

  if (min) {
    decorators.push(
      ArrayMinSize(min, {
        message: transformValidationErrors('ArrayMinSize', { min }, prefix),
      }),
    );
  }

  if (max) {
    decorators.push(
      ArrayMaxSize(max, {
        message: transformValidationErrors('ArrayMaxSize', { max }, prefix),
      }),
    );
  }

  // Handle element validation
  if (isDecoratorFactory(typeOrDecorator)) {
    // If a decorator factory is passed, apply it with { each: true }
    decorators.push(typeOrDecorator({ each: true }));
  } else if (typeof typeOrDecorator === 'function') {
    // If a class is passed, use ValidateNested and Type
    decorators.push(ValidateNested({ each: true }));
    decorators.push(Type(() => typeOrDecorator));
  }

  return applyDecorators(...decorators);
};

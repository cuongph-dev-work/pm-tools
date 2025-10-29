import { applyDecorators } from '@nestjs/common';
import { transformValidationErrors } from '@utils/helper';
import { Type } from 'class-transformer';
import { ArrayMaxSize, ArrayMinSize, ArrayNotEmpty, IsArray, IsOptional, ValidateNested, ValidationOptions } from 'class-validator';

interface IArrayValidationOption {
  isOptional?: boolean;
  prefix?: string;
  min?: number;
  max?: number;
  isNotEmpty?: boolean;
}

type Constructor<T = any> = new (...args: any[]) => T;

type DecoratorFactory = (options?: ValidationOptions) => PropertyDecorator;

function isClass(input: any): input is Constructor {
  return typeof input === 'function' && input.prototype instanceof Object;
}

export const ArrayField = <T = any>(typeOrDecorator: Constructor<T> | DecoratorFactory, options: Partial<IArrayValidationOption> = {}): PropertyDecorator => {
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

  if (isClass(typeOrDecorator)) {
    decorators.push(ValidateNested({ each: true }));
    decorators.push(Type(() => typeOrDecorator));
  } else {
    decorators.push(typeOrDecorator({ each: true }));
  }

  return applyDecorators(...decorators);
};

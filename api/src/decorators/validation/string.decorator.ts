import { ToFormatDate, ToInt, Trim } from '@decorators/transform.decorator';
import { applyDecorators } from '@nestjs/common';
import { transformValidationErrors } from '@utils/helper';
import {
  IsEmail,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
  ValidateBy,
  ValidateIf,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';
import { isEmpty, isNil } from 'lodash';
import { DateTime } from 'luxon';
import { IsEmailOptions, IsNumericOptions, IsURLOptions } from 'validator';

// const configService = new ConfigService(configs());

interface IsDateStringOptions {
  min?: string | Date;
  max?: string | Date;
}

/**
 * Interface defining all possible string validation options
 */
export interface IStringValidationOption {
  prefix?: string;
  min?: number; // Minimum length
  max?: number; // Maximum length
  trim?: boolean; // Whether to trim whitespace
  isOptional?: boolean; // Whether field is optional
  allowEmpty?: boolean; // Whether empty values are allowed
  isEmail?: boolean; // Validate as email
  isPhone?: boolean; // Validate as phone number
  isUrl?: boolean; // Validate as URL
  isDateString?: boolean; // Validate as ISO date string
  isPassword?: boolean; // Validate as password
  isNumberString?: boolean; // Validate as numeric string
  isSame?: string; // Must match another field
  emailOptions?: IsEmailOptions; // Email validation options
  urlOptions?: IsURLOptions; // URL validation options
  numericOptions?: IsNumericOptions; // Numeric validation options
  dateStringOptions?: IsDateStringOptions; // Date string validation options
  toInt?: boolean; // Transform to integer
  toFormatDate?: 'yyyy-MM-dd' | 'yyyy-MM-dd HH:mm:ss'; // Format date with specified format
  isOnlyString?: boolean; // Validate as only string
  each?: boolean; // Validate each element of the array
}

/**
 * Creates a property decorator that applies string validation rules
 * based on the provided options
 *
 * @param options - Validation options
 * @param validationOptions - Additional class-validator options
 * @returns PropertyDecorator with all validation rules applied
 */
export const StringField = (options: Partial<IStringValidationOption> = {}, validationOptions?: ValidationOptions): PropertyDecorator => {
  const {
    prefix,
    min,
    max,
    trim,
    isOptional,
    allowEmpty,
    isEmail,
    isPhone,
    isUrl,
    isPassword,
    isNumberString,
    isSame,
    isDateString,
    emailOptions,
    urlOptions,
    numericOptions,
    dateStringOptions,
    toInt,
    toFormatDate,
    isOnlyString,
    each = false,
  } = options || {};

  // Group decorators by type
  const validationDecorators = [
    ...(isOptional
      ? [
          IsOptional(),
          ValidateIf((_, value) => {
            return !isNil(value) && !isEmpty(value);
          }),
        ]
      : []),
    IsString({
      message: transformValidationErrors('IsString', {}, prefix),
      ...validationOptions,
      each,
    }),
  ];

  // Apply trim transformation if requested
  if (trim) {
    validationDecorators.push(Trim());
  }

  // Validate non-empty if required
  if (!allowEmpty) {
    validationDecorators.push(
      IsNotEmpty({
        message: transformValidationErrors('IsNotEmpty', {}, prefix),
      }),
    );
  }

  // Apply minimum length constraint if specified
  if (min) {
    validationDecorators.push(
      MinLength(min, {
        message: transformValidationErrors(
          'MinLength',
          {
            min,
          },
          prefix,
        ),
        each,
      }),
    );
  }

  // Apply maximum length constraint if specified
  if (max) {
    validationDecorators.push(
      MaxLength(max, {
        message: transformValidationErrors(
          'MaxLength',
          {
            max,
          },
          prefix,
        ),
        each,
      }),
    );
  }

  // Apply format-specific validations
  if (isEmail) {
    validationDecorators.push(
      IsEmail(emailOptions, {
        message: transformValidationErrors('IsEmail', {}, prefix),
        each,
      }),
    );
  }

  // Apply URL validation if requested
  if (isUrl) {
    validationDecorators.push(
      IsUrl(urlOptions, {
        message: transformValidationErrors('IsUrl', {}, prefix),
      }),
    );
  }

  // Apply phone number validation if requested
  if (isPhone) {
    validationDecorators.push(IsPhoneNumber(undefined, prefix));
  }

  // Apply password validation if requested
  if (isPassword) {
    validationDecorators.push(
      IsPassword({
        message: transformValidationErrors('IsPassword', {}, prefix),
      }),
    );
  }

  // Apply numeric string validation if requested
  if (isNumberString) {
    validationDecorators.push(
      IsNumberString(numericOptions, {
        message: transformValidationErrors('IsNumber', {}, prefix),
        each,
      }),
    );
  }

  // Apply same value validation if requested
  if (isSame) {
    validationDecorators.push(
      IsSameAs(isSame, {
        message: transformValidationErrors(
          'IsSameAs',
          {
            properties: [isSame],
          },
          prefix,
        ),
        each,
      }),
    );
  }

  // Apply date string validation if requested
  if (isDateString) {
    validationDecorators.push(IsDateString(dateStringOptions, undefined, prefix));
  }

  if (isOnlyString) {
    validationDecorators.push(
      IsOnlyString({
        message: transformValidationErrors('IsOnlyString', {}, prefix),
        each,
      }),
    );
  }

  // Group transformation decorators
  const transformationDecorators: PropertyDecorator[] = [];

  // Apply transformations
  if (toInt) {
    transformationDecorators.push(ToInt());
  }

  // Apply format-specific transformations
  if (toFormatDate) {
    transformationDecorators.push(ToFormatDate(toFormatDate));
  }

  // Apply decorators in the correct order: validations first, then transformations
  return applyDecorators(...validationDecorators, ...transformationDecorators);
};

/**
 * Custom validator for password strength
 * Requires at least one uppercase letter, one lowercase letter,
 * one number, one special character, and minimum length of 8
 *
 * @param validationOptions - Additional validation options
 * @returns PropertyDecorator for password validation
 */
const IsPassword = (validationOptions?: ValidationOptions): PropertyDecorator => {
  return ValidateBy(
    {
      name: 'IsPassword',
      constraints: ['^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$'],
      validator: {
        validate(value: string, args: ValidationArguments) {
          const passwordPattern = args.constraints[0];
          if (!passwordPattern) return true;

          if (passwordPattern instanceof RegExp) {
            return passwordPattern.test(value);
          }
          const regex = new RegExp(passwordPattern);
          return regex.test(value);
        },
      },
    },
    validationOptions,
  );
};

/**
 * Custom validator for Vietnamese phone numbers
 *
 * @param validationOptions - Additional validation options
 * @returns PropertyDecorator for phone number validation
 */
const IsPhoneNumber = (validationOptions?: ValidationOptions, prefix?: string): PropertyDecorator => {
  return ValidateBy(
    {
      name: 'IsPhoneNumber',
      validator: {
        validate(value: string) {
          // return ValidatorJS.isMobilePhone(value, 'vi-VN');
          return /^0\d{9,10}$/.test(value);
        },
        defaultMessage: () => {
          return transformValidationErrors('IsPhoneNumber', {}, prefix);
        },
      },
    },
    validationOptions,
  );
};

/**
 * Custom validator to check if a field has the same value as another field
 * Useful for password confirmation, email confirmation, etc.
 *
 * @param property - The name of the property to compare with
 * @param validationOptions - Additional validation options
 * @returns PropertyDecorator for equality validation
 */
const IsSameAs = (property: string, validationOptions?: ValidationOptions): PropertyDecorator => {
  return ValidateBy(
    {
      name: 'IsSameAs',
      validator: {
        validate(value: string, args: ValidationArguments) {
          const object = args.object as any;
          const relatedValue = object[property];
          return value === relatedValue;
        },
        defaultMessage() {
          return transformValidationErrors('IsSameAs', {
            properties: [property],
          });
        },
      },
    },
    validationOptions,
  );
};

/**
 * Custom validator to check if a field is a valid date string
 *
 * @param dateStringOptions - Additional validation options
 * @returns PropertyDecorator for date string validation
 */
const IsDateString = (dateStringOptions?: IsDateStringOptions, validationOptions?: ValidationOptions, prefix?: string): PropertyDecorator => {
  return ValidateBy(
    {
      name: 'IsDateString',
      validator: {
        validate(value: string) {
          if (!value) return false;

          // Try parsing with Luxon
          const date = DateTime.fromISO(value);

          // Check if the date is valid
          if (!date.isValid) return false;

          // Check if the date is in the past (optional, remove if not needed)
          // if (date < DateTime.now()) return false;

          return true;
        },
        defaultMessage() {
          return transformValidationErrors('IsDateString', {}, prefix);
        },
      },
    },
    validationOptions,
  );
};

/**
 * Custom validator for only string
 *
 * @param validationOptions - Additional validation options
 * @returns PropertyDecorator for phone number validation
 */
const IsOnlyString = (validationOptions?: ValidationOptions, prefix?: string): PropertyDecorator => {
  return ValidateBy(
    {
      name: 'IsOnlyString',
      validator: {
        validate(value: string) {
          return /^[A-Za-zÀ-Ỹà-ỹ\s]+$/.test(value);
        },
        defaultMessage: () => {
          return transformValidationErrors('IsOnlyString', {}, prefix);
        },
      },
    },
    validationOptions,
  );
};

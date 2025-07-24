import { HttpStatus, UnprocessableEntityException } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { randomBytes } from 'crypto';
import { mapKeys, snakeCase } from 'lodash';
import { nanoid } from 'nanoid';
import { I18nService } from 'nestjs-i18n';

/**
 * Generates a random token string of specified length
 * @param length The desired length of the token in characters (default: 32)
 * @returns A random hex string of the specified length
 */
export const generateToken = (length: number = 32): string => {
  return randomBytes(length / 2).toString('hex');
};

/**
 * Converts an object's keys from camelCase to snake_case
 * @param obj The object whose keys need to be converted
 * @returns A new object with all keys converted to snake_case
 */
export function camelToSnake(obj) {
  return mapKeys(obj, (_, key) => snakeCase(key));
}

/**
 * Generates a random ID of specified length
 * @param length The desired length of the ID in characters (default: 20)
 * @returns A random ID of the specified length
 */
export function generateRandomId(length = 20) {
  return nanoid(length);
}

/**
 * Transforms validation errors into a structured format
 * @param key The key of the validation error
 * @param params The constraints of the validation error
 * @returns An object with the key and constraints
 */
export function transformValidationErrors(
  key: string,
  params: Record<string, string | number | boolean | Array<string>> | Array<number>,
  customProperty?: string, // custom label name
): string {
  return JSON.stringify(
    {
      key,
      params,
      customProperty,
    },
    null,
    2,
  );
}

interface IError {
  property: string;
  key: string;
  params: any;
}
/**
 * Transforms a validation error into a structured format
 * @param property The property of the validation error
 * @param key The key of the validation error
 * @param params The constraints of the validation error
 * @returns An object with the key and constraints
 */
export function transformToValidationError(errors: IError[], i18n: I18nService) {
  const message: ValidationError[] = errors.map(error => {
    const newError = new ValidationError();
    newError.property = error.property;
    newError.constraints = {
      [error.key]: JSON.stringify({
        key: error.key,
        params: error.params,
      }),
    };
    return newError;
  });

  return new UnprocessableEntityException({
    error: i18n.t('app.http.unprocessableEntity'),
    statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
    message,
  });
}

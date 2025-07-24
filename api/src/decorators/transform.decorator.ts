import { formatDate, toISOString } from '@utils/date';
import { Transform } from 'class-transformer';
import { castArray, isArray, isNil, map, trim } from 'lodash';

/**
 * Trims whitespace from string values and replaces multiple spaces with a single space
 * @returns PropertyDecorator that transforms string values
 */
export function Trim(): PropertyDecorator {
  return Transform(params => {
    const value = params.value as string[] | string;

    if (isArray(value)) {
      return map(value, v => trim(v).replace(/\s\s+/g, ' '));
    }

    return trim(value).replace(/\s\s+/g, ' ');
  });
}

/**
 * Converts string 'true'/'false' values to boolean type
 * @returns PropertyDecorator that transforms string to boolean
 */
export function ToBoolean(): PropertyDecorator {
  return Transform(
    params => {
      switch (params.value) {
        case 'true':
          return true;
        case 'false':
          return false;
        default:
          return params.value;
      }
    },
    { toClassOnly: true },
  );
}

/**
 * Formats a date value to YYYY-MM-DD format
 * @returns PropertyDecorator that transforms date values
 */
export function ToDate(): PropertyDecorator {
  return Transform(
    params => {
      return formatDate(params.value, 'YYYY-MM-DD');
    },
    { toClassOnly: true },
  );
}

/**
 * Converts a date value to ISO string format
 * @returns PropertyDecorator that transforms date to ISO string
 */
export function ToDateISOString(): PropertyDecorator {
  return Transform(
    params => {
      return toISOString(params.value);
    },
    { toClassOnly: true },
  );
}

/**
 * Converts a string value to integer
 * @returns PropertyDecorator that transforms string to integer
 */
export function ToInt(): PropertyDecorator {
  return Transform(
    params => {
      if (isNil(params.value)) {
        return;
      }

      const value = params.value as string;
      return Number.parseInt(value, 10);
    },
    { toClassOnly: true },
  );
}

/**
 * Converts a string value to number
 * @returns PropertyDecorator that transforms string to number
 */
export function ToNumber(): PropertyDecorator {
  return Transform(
    params => {
      const value = params.value as string;

      return Number(value);
    },
    { toClassOnly: true },
  );
}

/**
 * Converts a string value to float
 * @returns PropertyDecorator that transforms string to float
 */
export function ToFloat(): PropertyDecorator {
  return Transform(
    params => {
      const value = params.value as string;
      return Number.parseFloat(value);
    },
    { toClassOnly: true },
  );
}

/**
 * Converts string values to lowercase
 * @returns PropertyDecorator that transforms strings to lowercase
 */
export function ToLowerCase(): PropertyDecorator {
  return Transform(
    params => {
      const value = params.value;

      if (!value) {
        return;
      }

      if (!Array.isArray(value)) {
        return value.toLowerCase();
      }

      return value.map(v => v.toLowerCase());
    },
    {
      toClassOnly: true,
    },
  );
}

/**
 * Converts string values to uppercase
 * @returns PropertyDecorator that transforms strings to uppercase
 */
export function ToUpperCase(): PropertyDecorator {
  return Transform(
    params => {
      const value = params.value;

      if (!value) {
        return;
      }

      if (!Array.isArray(value)) {
        return value.toUpperCase();
      }

      return value.map(v => v.toUpperCase());
    },
    {
      toClassOnly: true,
    },
  );
}

/**
 * Ensures a value is always an array
 * @returns PropertyDecorator that transforms values to arrays
 */
export function ToArray(): PropertyDecorator {
  return Transform(
    params => {
      const value = params.value;

      if (isNil(value)) {
        return [];
      }

      return castArray(value);
    },
    { toClassOnly: true },
  );
}

/**
 * Formats a date value using the specified format
 * @param format The date format string to use
 * @returns PropertyDecorator that transforms date to formatted string
 */
export function ToFormatDate(format: string): PropertyDecorator {
  return Transform(params => {
    if (isNil(params.value)) {
      return;
    }

    if (typeof params.value === 'string') {
      return formatDate(new Date(params.value), format);
    }

    if (params.value instanceof Date) {
      return formatDate(params.value, format);
    }

    return params.value;
  });
}

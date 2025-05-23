import {
  IsString,
  ValidationOptions,
  MinLength,
  MaxLength,
  IsEmail,
  IsUrl,
  IsNotEmpty,
  IsNumberString,
  ValidateBy,
  ValidationArguments,
  IsOptional,
  ValidateIf,
} from 'class-validator';
import { applyDecorators } from '@nestjs/common';
import * as ValidatorJS from 'validator';
import { ToInt, Trim } from '@decorators/transform.decorator';
import { ConfigService } from '@nestjs/config';
import configs from '@configs/app';
import { isEmpty, isNil } from 'lodash';
import { transformValidationErrors } from '@utils/helper';
import { IsURLOptions, IsEmailOptions, IsNumericOptions } from 'validator';

const configService = new ConfigService(configs());

interface IStringValidationOption {
  min?: number;
  max?: number;
  trim?: boolean;
  isOptional?: boolean;
  allowEmpty?: boolean;
  isEmail?: boolean;
  isPhone?: boolean;
  isUrl?: boolean;
  isPassword?: boolean;
  isNumberString?: boolean;
  isSame?: string;
  emailOptions?: IsEmailOptions;
  urlOptions?: IsURLOptions;
  numericOptions?: IsNumericOptions;
  toInt?: boolean;
}

export const StringField = (
  options: Partial<IStringValidationOption> = {},
  validationOptions?: ValidationOptions,
): PropertyDecorator => {
  const {
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
    emailOptions,
    urlOptions,
    numericOptions,
    toInt,
  } = options || {};

  const decorators = [
    ...(isOptional
      ? [
          IsOptional(),
          ValidateIf((_, value) => {
            return !isNil(value) && !isEmpty(value);
          }),
        ]
      : []),
    IsString({
      message:
        validationOptions?.message || transformValidationErrors('IsString', {}),
      ...validationOptions,
    }),
  ];

  if (trim) {
    decorators.push(Trim());
  }

  if (!allowEmpty) {
    decorators.push(
      IsNotEmpty({
        message: transformValidationErrors('IsNotEmpty', {}),
      }),
    );
  }

  if (min) {
    decorators.push(
      MinLength(min, {
        message: transformValidationErrors('MinLength', {
          min,
        }),
      }),
    );
  }

  if (max) {
    decorators.push(
      MaxLength(max, {
        message: transformValidationErrors('MaxLength', {
          max,
        }),
      }),
    );
  }

  if (isEmail) {
    decorators.push(
      IsEmail(emailOptions, {
        message: transformValidationErrors('IsEmail', {}),
      }),
    );
  }

  if (isUrl) {
    decorators.push(
      IsUrl(urlOptions, {
        message: transformValidationErrors('IsUrl', {}),
      }),
    );
  }

  if (isPhone) {
    decorators.push(IsPhoneNumber());
  }

  if (isPassword) {
    decorators.push(
      IsPassword({
        message: transformValidationErrors('IsPassword', {}),
      }),
    );
  }

  if (isNumberString) {
    decorators.push(
      IsNumberString(numericOptions, {
        message: transformValidationErrors('IsNumber', {}),
      }),
    );
  }

  if (isSame) {
    decorators.push(
      IsSameAs(isSame, {
        message: transformValidationErrors('IsSameAs', {
          properties: [isSame],
        }),
      }),
    );
  }

  if (toInt) {
    decorators.push(ToInt());
  }

  return applyDecorators(...decorators);
};

const IsPassword = (
  validationOptions?: ValidationOptions,
): PropertyDecorator => {
  return ValidateBy(
    {
      name: 'IsPassword',
      constraints: [
        '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$',
      ],
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

const IsPhoneNumber = (
  validationOptions?: ValidationOptions,
): PropertyDecorator => {
  return ValidateBy(
    {
      name: 'IsPhoneNumber',
      validator: {
        validate(value: string) {
          return ValidatorJS.isMobilePhone(value, 'vi-VN');
        },
        defaultMessage: () => {
          return transformValidationErrors('IsPhoneNumber', {});
        },
      },
    },
    validationOptions,
  );
};

const IsSameAs = (
  property: string,
  validationOptions?: ValidationOptions,
): PropertyDecorator => {
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

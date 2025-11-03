import * as v from "valibot";
import type { I18nT } from "~/shared/types/i18n";

// Common validation patterns
export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
export const PHONE_REGEX = /^(\+84|0)[0-9]{9,10}$/; // Vietnamese phone number format
export const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
export const ALPHANUMERIC_REGEX = /^[a-zA-Z0-9]+$/;

// Common validation messages
export const createValidationMessages = (t: TFunction) => ({
  required: (field: string) =>
    t("validation.required", {
      field: field,
    }),
  emailInvalid: () => t("validation.email.invalid"),
  phoneInvalid: () => t("validation.phone.invalid"),
  alphanumericInvalid: () => t("validation.alphanumeric.invalid"),
  minLength: (field: string, min: number) =>
    t("validation.minLength", { field, min }),
  maxLength: (field: string, max: number) =>
    t("validation.maxLength", { field, max }),
  pattern: (field: string) => t("validation.pattern", { field }),
});

// Factory function to create validation schemas with i18n
export const createValidationSchemas = (t: I18nT) => {
  const messages = createValidationMessages(t);

  return {
    // String validation
    requiredString: (fieldName: string) =>
      v.pipe(
        v.string(),
        v.trim(),
        v.minLength(1, messages.required(fieldName))
      ),

    optionalString: () => v.optional(v.string()),

    emailString: () =>
      v.pipe(
        v.string(),
        v.trim(),
        v.check(
          input => input.length === 0 || EMAIL_REGEX.test(input),
          messages.emailInvalid()
        )
      ),

    phoneString: (_fieldName: string) =>
      v.pipe(
        v.string(),
        v.trim(),
        v.check(
          input => input.length === 0 || PHONE_REGEX.test(input),
          messages.phoneInvalid()
        )
      ),

    alphanumericString: (_fieldName: string) =>
      v.pipe(
        v.string(),
        v.trim(),
        v.check(
          input => input.length === 0 || ALPHANUMERIC_REGEX.test(input),
          messages.alphanumericInvalid()
        )
      ),

    minLengthString: (fieldName: string, min: number) =>
      v.pipe(
        v.string(),
        v.trim(),
        v.check(
          input => input.length === 0 || input.length >= min,
          messages.minLength(fieldName, min)
        )
      ),

    maxLengthString: (fieldName: string, max: number) =>
      v.pipe(
        v.string(),
        v.trim(),
        v.check(
          input => input.length === 0 || input.length <= max,
          messages.maxLength(fieldName, max)
        )
      ),

    patternString: (fieldName: string, pattern: RegExp, message?: string) =>
      v.pipe(
        v.string(),
        v.trim(),
        v.check(
          input => input.length === 0 || pattern.test(input),
          message ?? messages.pattern(fieldName)
        )
      ),
  };
};

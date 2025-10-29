import { useTranslation } from "react-i18next";
import * as v from "valibot";

type TFunction = ReturnType<typeof useTranslation>["t"];

// Common validation patterns
export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
export const PHONE_REGEX = /^(\+84|0)[0-9]{9,10}$/; // Vietnamese phone number format
export const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;

// Common validation messages
export const createValidationMessages = (t: TFunction) => ({
  required: (field: string) =>
    t("validation.required", {
      field: field,
    }),
});

// Factory function to create validation schemas with i18n
export const createValidationSchemas = (t: TFunction) => {
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
  };
};

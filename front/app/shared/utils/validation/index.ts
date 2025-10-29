// Main exports for validation utilities
export * from "./common";

// Export all schemas
export * from "./schema";

// Re-export valibot for convenience
export * as v from "valibot";

// Types
import { useTranslation } from "react-i18next";
export type TFunction = ReturnType<typeof useTranslation>["t"];

// Validation error handling utilities
export interface ApiError {
  message: string;
  field?: string;
  code?: string;
}

export interface ValidationError {
  field: string;
  message: string;
}

// Helper function to convert API errors to form field errors
export const convertApiErrorsToFieldErrors = (
  apiErrors: ApiError[]
): Record<string, string> => {
  const fieldErrors: Record<string, string> = {};

  apiErrors.forEach(error => {
    if (error.field) {
      fieldErrors[error.field] = error.message;
    }
  });

  return fieldErrors;
};

// Helper function to format validation errors
export const formatValidationErrors = (
  errors: ValidationError[]
): Record<string, string> => {
  const fieldErrors: Record<string, string> = {};

  errors.forEach(error => {
    fieldErrors[error.field] = error.message;
  });

  return fieldErrors;
};

import { Box, Text } from "@radix-ui/themes";
import * as React from "react";

export interface BaseFormFieldProps {
  name: string;
  label?: string;
  description?: string;
  isRequired?: boolean;
  className?: string;
  labelClassName?: string;
  errorClassName?: string;
  children: React.ReactNode;
}

export function BaseFormField({
  name,
  label,
  description,
  isRequired,
  className = "",
  labelClassName = "",
  errorClassName = "text-sm text-red-600 mt-1",
  children,
}: BaseFormFieldProps) {
  const fieldId = React.useId();
  const labelId = `${fieldId}-${name}-label`;
  const descriptionId = `${fieldId}-${name}-desc`;
  const errorId = `${fieldId}-${name}-error`;

  return (
    <div className={className}>
      {label && (
        <label
          htmlFor={fieldId}
          id={labelId}
          className={`block text-sm font-medium text-gray-700 mb-1 ${labelClassName}`}
        >
          {label}
          {isRequired ? (
            <Box ml="1" display="inline-block" asChild>
              <Text as="span" size="1" className="text-red-600">
                *
              </Text>
            </Box>
          ) : null}
        </label>
      )}

      {children}

      {description && (
        <Box mt="1">
          <Text
            id={descriptionId}
            as="p"
            size="1"
            className="text-xs text-gray-500"
          >
            {description}
          </Text>
        </Box>
      )}

      <div id={errorId} className={errorClassName} aria-live="polite" />
    </div>
  );
}

export default BaseFormField;

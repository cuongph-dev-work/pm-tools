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
          {isRequired ? <span className="ml-0.5 text-red-600">*</span> : null}
        </label>
      )}

      <div
        id={fieldId}
        aria-labelledby={label ? labelId : undefined}
        aria-describedby={description ? descriptionId : undefined}
        aria-errormessage={errorId}
      >
        {children}
      </div>

      {description && (
        <p id={descriptionId} className="mt-1 text-xs text-gray-500">
          {description}
        </p>
      )}

      <div id={errorId} className={errorClassName} aria-live="polite" />
    </div>
  );
}

export default BaseFormField;

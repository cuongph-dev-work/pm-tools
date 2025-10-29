import * as React from "react";
import { useTranslation } from "react-i18next";

export interface BaseFormFieldProps {
  name: string;
  labelKey?: string;
  descriptionKey?: string;
  isRequired?: boolean;
  className?: string;
  labelClassName?: string;
  errorClassName?: string;
  children: React.ReactNode;
}

/**
 * BaseFormField chỉ chịu trách nhiệm layout: Label, Description, Control, Error block.
 * - Không hardcode text: nhận key i18n qua props và dùng react-i18next.
 * - Cho phép truyền className để tùy biến style theo guideline.
 */
export function BaseFormField({
  name,
  labelKey,
  descriptionKey,
  isRequired,
  className = "",
  labelClassName = "",
  errorClassName = "text-sm text-red-600 mt-1",
  children,
}: BaseFormFieldProps) {
  const { t } = useTranslation();

  const fieldId = React.useId();
  const labelId = `${fieldId}-${name}-label`;
  const descriptionId = `${fieldId}-${name}-desc`;
  const errorId = `${fieldId}-${name}-error`;

  return (
    <div className={className}>
      {labelKey && (
        <label htmlFor={fieldId} id={labelId} className={`block text-sm font-medium text-gray-700 mb-1 ${labelClassName}`}>
          {t(labelKey)}
          {isRequired ? <span className="ml-0.5 text-red-600">*</span> : null}
        </label>
      )}

      <div aria-labelledby={labelId} aria-describedby={`${descriptionKey ? descriptionId : ""}`.trim()}>
        {React.isValidElement(children)
          ? React.cloneElement(children as React.ReactElement, {
              id: fieldId,
              "aria-invalid": undefined, // để wrapper con set chính xác theo trạng thái
              "aria-errormessage": errorId,
            })
          : children}
      </div>

      {descriptionKey && (
        <p id={descriptionId} className="mt-1 text-xs text-gray-500">
          {t(descriptionKey)}
        </p>
      )}

      {/* Error block sẽ được render bởi FormErrorMessage và gắn id=errorId */}
      <div id={errorId} className={errorClassName} aria-live="polite" />
    </div>
  );
}

export default BaseFormField;



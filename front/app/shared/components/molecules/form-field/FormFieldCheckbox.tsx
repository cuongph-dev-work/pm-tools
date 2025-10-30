import * as React from "react";
import type { FormApi } from "@tanstack/react-form";

import BaseFormField from "./BaseFormField";
import { FormErrorMessage } from "./FormErrorMessage";
import { Checkbox } from "../../atoms/Checkbox";

export interface FormFieldCheckboxProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof Checkbox>,
    "checked" | "onChange" | "onBlur"
  > {
  name: string;
  form: FormApi<any>;
  labelKey?: string; // optional, label có thể truyền trực tiếp bằng prop label đã i18n trước
  descriptionKey?: string;
  isRequired?: boolean;
  className?: string;
  labelClassName?: string;
  errorClassName?: string;
}

export function FormFieldCheckbox({
  name,
  form,
  labelKey,
  descriptionKey,
  isRequired,
  className,
  labelClassName,
  errorClassName,
  label,
  ...props
}: FormFieldCheckboxProps) {
  const field = form.useField({ name });

  return (
    <BaseFormField
      name={name}
      labelKey={labelKey}
      descriptionKey={descriptionKey}
      isRequired={isRequired}
      className={className}
      labelClassName={labelClassName}
      errorClassName={errorClassName}
    >
      <Checkbox
        checked={Boolean(field.state.value)}
        onChange={(e: React.ChangeEvent) =>
          field.handleChange((e.target as any).checked)
        }
        onBlur={field.handleBlur}
        label={label}
        {...props}
      />
      <FormErrorMessage field={field} />
    </BaseFormField>
  );
}

export default FormFieldCheckbox;

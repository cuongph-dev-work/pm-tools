import * as React from "react";
import type { FormApi } from "@tanstack/react-form";
import { useTranslation } from "react-i18next";

import BaseFormField from "./BaseFormField";
import { FormErrorMessage } from "./FormErrorMessage";
import { DatePicker } from "../../atoms/DatePicker";

export interface FormFieldDatePickerProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof DatePicker>,
    "value" | "onChange" | "onBlur"
  > {
  name: string;
  form: FormApi<any>;
  labelKey?: string;
  descriptionKey?: string;
  placeholderKey?: string;
  isRequired?: boolean;
  className?: string;
  labelClassName?: string;
  errorClassName?: string;
}

export function FormFieldDatePicker({
  name,
  form,
  labelKey,
  descriptionKey,
  placeholderKey,
  isRequired,
  className,
  labelClassName,
  errorClassName,
  ...props
}: FormFieldDatePickerProps) {
  const { t } = useTranslation();
  const field = form.useField({ name });

  const handleChange = (value: string) => {
    field.handleChange(value);
  };

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
      <DatePicker
        value={field.state.value ?? ""}
        onChange={handleChange}
        placeholder={placeholderKey ? t(placeholderKey) : props.placeholder}
        {...props}
      />
      <FormErrorMessage field={field} />
    </BaseFormField>
  );
}

export default FormFieldDatePicker;

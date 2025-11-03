import { useField } from "@tanstack/react-form";
import * as React from "react";
import { Select, type SelectOption } from "~/shared/components/atoms/Select";
import BaseFormField from "./BaseFormField";
import { FormErrorMessage } from "./FormErrorMessage";
import type { AnyFormApi } from "./types";

export type { SelectOption };

export interface FormFieldSelectProps {
  name: string;
  form: AnyFormApi;
  label?: string;
  description?: string;
  isRequired?: boolean;
  className?: string;
  labelClassName?: string;
  errorClassName?: string;
  options: SelectOption[];
  placeholder?: string;
  leftIcon?: React.ReactNode;
}

export function FormFieldSelect({
  name,
  form,
  label,
  description,
  isRequired,
  className,
  labelClassName,
  errorClassName,
  options,
  placeholder,
  leftIcon,
}: FormFieldSelectProps) {
  const field = useField({ name, form });
  const errors = field.state.meta?.errors ?? [];
  const hasError = Array.isArray(errors) ? errors.length > 0 : Boolean(errors);
  const value = field.state.value as string | undefined;

  return (
    <BaseFormField
      name={name}
      label={label}
      description={description}
      isRequired={isRequired}
      className={className}
      labelClassName={labelClassName}
      errorClassName={errorClassName}
    >
      <Select
        value={value}
        options={options}
        placeholder={placeholder}
        leftIcon={leftIcon}
        onChange={field.handleChange}
        onBlur={field.handleBlur}
        aria-invalid={hasError}
      />
      <FormErrorMessage field={field} />
    </BaseFormField>
  );
}

export default FormFieldSelect;

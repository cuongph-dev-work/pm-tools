import { useField } from "@tanstack/react-form";
import * as React from "react";
import type { AnyFormApi } from "./types";

import { cn } from "../../../utils/cn";
import { Input } from "../../atoms/TеxtInput";
import BaseFormField from "./BaseFormField";
import { FormErrorMessage } from "./FormErrorMessage";

export interface FormFieldInputProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof Input>,
    "value" | "onChange" | "onBlur" | "form"
  > {
  name: string;
  form: AnyFormApi;
  label?: string;
  description?: string;
  isRequired?: boolean;
  className?: string;
  labelClassName?: string;
  errorClassName?: string;
}

export function FormFieldInput({
  name,
  form,
  label,
  description,
  isRequired,
  className,
  labelClassName,
  errorClassName,
  ...inputProps
}: FormFieldInputProps) {
  const field = useField({ name, form });
  const errors = field.state.meta?.errors ?? [];
  const hasError = Array.isArray(errors) ? errors.length > 0 : Boolean(errors);
  const { className: inputClassName, ...restInputProps } = inputProps as {
    className?: string;
    [key: string]: unknown;
  };

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
      <Input
        value={String(field.state.value ?? "")}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          field.handleChange(e.target.value)
        }
        onBlur={field.handleBlur}
        className={cn(
          inputClassName,
          hasError &&
            "border-1 border-red-500 focus:border-red-500 focus:ring-red-500"
        )}
        {...restInputProps}
      />
      <FormErrorMessage field={field} />
    </BaseFormField>
  );
}

export default FormFieldInput;

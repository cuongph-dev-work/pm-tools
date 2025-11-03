import { useField } from "@tanstack/react-form";
import { Eye, EyeOff } from "lucide-react";
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
  const {
    className: inputClassName,
    type,
    ...restInputProps
  } = inputProps as {
    className?: string;
    type?: string;
    [key: string]: unknown;
  };
  const isPassword = type === "password";
  const [showPassword, setShowPassword] = React.useState(false);

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
        type={
          isPassword
            ? showPassword
              ? "text"
              : "password"
            : (type as
                | "number"
                | "search"
                | "time"
                | "text"
                | "hidden"
                | "password"
                | "date"
                | "datetime-local"
                | "email"
                | "month"
                | "tel"
                | "url"
                | "week"
                | undefined)
        }
        className={cn(inputClassName, hasError && "is-invalid")}
        rightSlot={
          isPassword ? (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="flex items-center justify-center p-0 w-5 h-5 text-gray-500 hover:text-gray-700 focus:outline-none"
              aria-label={showPassword ? "Ẩn mật khẩu" : "Hiển thị mật khẩu"}
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          ) : undefined
        }
        {...restInputProps}
      />
      <FormErrorMessage field={field} />
    </BaseFormField>
  );
}

export default FormFieldInput;

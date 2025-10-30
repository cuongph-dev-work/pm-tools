import * as React from "react";
import type { FormApi } from "@tanstack/react-form";
import { useTranslation } from "react-i18next";

import BaseFormField from "./BaseFormField";
import { FormErrorMessage } from "./FormErrorMessage";
import { Input } from "../../atoms/TеxtInput";

export interface FormFieldInputProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof Input>,
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

export function FormFieldInput({
  name,
  form,
  labelKey,
  descriptionKey,
  placeholderKey,
  isRequired,
  className,
  labelClassName,
  errorClassName,
  ...inputProps
}: FormFieldInputProps) {
  const { t } = useTranslation();
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
      <Input
        value={field.state.value ?? ""}
        onChange={(e: React.ChangeEvent) =>
          field.handleChange((e.target as any).value)
        }
        onBlur={field.handleBlur}
        placeholder={
          placeholderKey ? t(placeholderKey) : inputProps.placeholder
        }
        {...inputProps}
      />
      <FormErrorMessage field={field} />
    </BaseFormField>
  );
}

export default FormFieldInput;

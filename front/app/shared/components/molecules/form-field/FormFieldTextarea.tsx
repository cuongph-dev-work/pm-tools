import * as React from "react";
import type { FormApi } from "@tanstack/react-form";
import { useTranslation } from "react-i18next";

import BaseFormField from "./BaseFormField";
import { FormErrorMessage } from "./FormErrorMessage";
import { Textarea } from "../../atoms/Textarea";

export interface FormFieldTextareaProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof Textarea>,
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

export function FormFieldTextarea({
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
}: FormFieldTextareaProps) {
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
      <Textarea
        value={field.state.value ?? ""}
        onChange={(e: React.ChangeEvent) =>
          field.handleChange((e.target as any).value)
        }
        onBlur={field.handleBlur}
        placeholder={placeholderKey ? t(placeholderKey) : props.placeholder}
        {...props}
      />
      <FormErrorMessage field={field} />
    </BaseFormField>
  );
}

export default FormFieldTextarea;

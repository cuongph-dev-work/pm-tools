import { useField } from "@tanstack/react-form";
import * as React from "react";
import {
  TagInput,
  type Tag,
  type TagSuggestion,
} from "~/shared/components/atoms/TagInput";
import BaseFormField from "./BaseFormField";
import { FormErrorMessage } from "./FormErrorMessage";
import type { AnyFormApi } from "./types";

export type { Tag, TagSuggestion };

export interface FormFieldTagInputProps {
  name: string;
  form: AnyFormApi;
  label?: string;
  description?: string;
  isRequired?: boolean;
  className?: string;
  labelClassName?: string;
  errorClassName?: string;
  placeholder?: string;
  suggestions?: TagSuggestion[];
}

export function FormFieldTagInput({
  name,
  form,
  label,
  description,
  isRequired,
  className,
  labelClassName,
  errorClassName,
  placeholder,
  suggestions = [],
}: FormFieldTagInputProps) {
  const field = useField({ name, form });
  const errors = field.state.meta?.errors ?? [];
  const hasError = Array.isArray(errors) ? errors.length > 0 : Boolean(errors);
  const value = (field.state.value as Tag[]) || [];

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
      <TagInput
        value={value}
        placeholder={placeholder}
        suggestions={suggestions}
        onChange={field.handleChange}
        onBlur={field.handleBlur}
        aria-invalid={hasError}
      />
      <FormErrorMessage field={field} />
    </BaseFormField>
  );
}

export default FormFieldTagInput;

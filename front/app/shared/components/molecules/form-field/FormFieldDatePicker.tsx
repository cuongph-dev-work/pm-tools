import { useField } from "@tanstack/react-form";
import type { AnyFormApi } from "./types";

import { cn } from "../../../utils/cn";
import DatePicker from "../../atoms/DatePicker";
import BaseFormField from "./BaseFormField";
import { FormErrorMessage } from "./FormErrorMessage";

export interface FormFieldDatePickerProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof DatePicker>,
    "value" | "onChange" | "onBlur"
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

export function FormFieldDatePicker({
  name,
  form,
  label,
  description,
  isRequired,
  className,
  labelClassName,
  errorClassName,
  ...props
}: FormFieldDatePickerProps) {
  const field = useField({ name, form });

  const handleChange = (value: string) => {
    field.handleChange(value);
  };

  const { className: datePickerClassName, ...restProps } = props as {
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
      <DatePicker
        value={String(field.state.value ?? "")}
        onChange={handleChange}
        className={cn("max-w-[150px]", datePickerClassName)}
        {...restProps}
      />
      <FormErrorMessage field={field} />
    </BaseFormField>
  );
}

export default FormFieldDatePicker;

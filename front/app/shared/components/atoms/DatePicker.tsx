import * as React from "react";
import {
  TextField,
  type TextFieldProps as RadixTextFieldProps,
} from "@radix-ui/themes";

export interface DatePickerProps
  extends Omit<RadixTextFieldProps, "size" | "variant">,
    Omit<
      React.ComponentPropsWithoutRef<"input">,
      "type" | "value" | "onChange"
    > {
  value?: string | Date;
  onChange?: (value: string) => void;
  className?: string;
  size?: "sm" | "md" | "lg" | "1" | "2" | "3" | "4";
  placeholderKey?: string;
}

/**
 * DatePicker atom component sử dụng HTML input[type="date"] với Radix UI Themes TextField wrapper.
 * Hỗ trợ className để tùy biến style theo guideline.
 * Không hardcode text: nhận placeholderKey để i18n ở layer molecule.
 */
export const DatePicker = React.forwardRef<
  React.ElementRef<"input">,
  DatePickerProps
>(
  (
    {
      value,
      onChange,
      className = "",
      size = "md",
      placeholderKey,
      placeholder,
      ...props
    },
    ref
  ) => {
    const sizeMap: Record<"sm" | "md" | "lg", RadixTextFieldProps["size"]> = {
      sm: "2",
      md: "3",
      lg: "4",
    };

    const radixSize =
      size in sizeMap
        ? sizeMap[size as "sm" | "md" | "lg"]
        : (size as RadixTextFieldProps["size"]);

    const rootClassName = ["w-full", className].filter(Boolean).join(" ");

    // Convert value to YYYY-MM-DD format for input[type="date"]
    const dateValue = React.useMemo(() => {
      if (!value) return "";
      if (value instanceof Date) {
        return value.toISOString().split("T")[0];
      }
      if (typeof value === "string") {
        // If already in YYYY-MM-DD format, return as is
        if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
          return value;
        }
        // Try parsing as date
        const date = new Date(value);
        if (!isNaN(date.getTime())) {
          return date.toISOString().split("T")[0];
        }
      }
      return "";
    }, [value]);

    const handleChange = (e: React.ChangeEvent<unknown>) => {
      onChange?.(e.target.value);
    };

    return (
      <TextField.Root size={radixSize} className={rootClassName}>
        <TextField.Input
          type="date"
          ref={ref}
          value={dateValue}
          onChange={handleChange}
          placeholder={placeholderKey || placeholder}
          {...props}
        />
      </TextField.Root>
    );
  }
);

DatePicker.displayName = "DatePicker";

export default DatePicker;

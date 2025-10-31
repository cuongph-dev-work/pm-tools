import { RadioGroup as ThemesRadioGroup } from "@radix-ui/themes";
import * as React from "react";

export interface RadioOption {
  value: string;
  label: string;
  labelKey?: string;
  disabled?: boolean;
}

export interface RadioGroupProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof ThemesRadioGroup.Root>,
    "onChange" | "children" | "value" | "defaultValue" | "name"
  > {
  name: string;
  value?: string;
  onChange?: (value: string) => void;
  options: RadioOption[];
  className?: string;
  optionClassName?: string;
}

/**
 * RadioGroup atom - sử dụng Radix UI RadioGroup
 * Không hardcode text: label/labelKey do caller quản lý i18n
 */
export const RadioGroup = React.forwardRef<
  React.ElementRef<typeof ThemesRadioGroup.Root>,
  RadioGroupProps
>(
  (
    {
      name,
      value,
      onChange,
      options,
      className = "",
      optionClassName = "",
      ...props
    },
    ref
  ) => {
    const groupClassName = ["space-y-2", className].filter(Boolean).join(" ");
    const radioItemClassName = [
      "h-4 w-4 rounded-full border border-gray-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
      "data-[state=checked]:border-blue-600 data-[state=checked]:bg-white",
      optionClassName,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <ThemesRadioGroup.Root
        ref={ref}
        name={name}
        value={value}
        onValueChange={onChange}
        className={groupClassName}
        {...props}
      >
        {options.map((option: RadioOption) => (
          <ThemesRadioGroup.Item
            key={option.value}
            value={option.value}
            disabled={option.disabled}
            className={radioItemClassName}
            id={`${name}-${option.value}`}
          >
            {option.label || option.labelKey}
          </ThemesRadioGroup.Item>
        ))}
      </ThemesRadioGroup.Root>
    );
  }
);

RadioGroup.displayName = "RadioGroup";

export default RadioGroup;

import { RadioGroup as ThemesRadioGroup } from "@radix-ui/themes";
import * as React from "react";

export interface RadioOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface RadioGroupProps
  extends React.ComponentPropsWithoutRef<typeof ThemesRadioGroup.Root> {
  className?: string;
  options: RadioOption[];
}

export const RadioGroup = React.forwardRef<
  React.ElementRef<typeof ThemesRadioGroup.Root>,
  RadioGroupProps
>(({ className = "", options, ...props }, ref) => {
  return (
    <ThemesRadioGroup.Root ref={ref} className={className} {...props}>
      {options.map((option: RadioOption) => (
        <ThemesRadioGroup.Item
          key={option.value}
          value={option.value}
          disabled={option.disabled}
        >
          {option.label}
        </ThemesRadioGroup.Item>
      ))}
    </ThemesRadioGroup.Root>
  );
});

RadioGroup.displayName = "RadioGroup";

export default RadioGroup;

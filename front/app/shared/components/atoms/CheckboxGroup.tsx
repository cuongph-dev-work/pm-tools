import { CheckboxGroup as ThemesCheckboxGroup } from "@radix-ui/themes";
import * as React from "react";

export interface CheckboxOption {
  value: string;
  label: string;
  disabled?: boolean;
}
export interface CheckboxGroupProps
  extends React.ComponentPropsWithoutRef<typeof ThemesCheckboxGroup.Root> {
  className?: string;
  options: CheckboxOption[];
}

export const CheckboxGroup = React.forwardRef<
  React.ElementRef<typeof ThemesCheckboxGroup.Root>,
  CheckboxGroupProps
>(({ className = "", options, ...props }, ref) => {
  return (
    <ThemesCheckboxGroup.Root ref={ref} className={className} {...props}>
      {options.map((option: CheckboxOption) => (
        <ThemesCheckboxGroup.Item
          key={option.value}
          value={option.value}
          disabled={option.disabled}
        >
          {option.label}
        </ThemesCheckboxGroup.Item>
      ))}
    </ThemesCheckboxGroup.Root>
  );
});

CheckboxGroup.displayName = "CheckboxGroup";

export default CheckboxGroup;

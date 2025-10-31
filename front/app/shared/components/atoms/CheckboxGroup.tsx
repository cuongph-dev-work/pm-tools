import { CheckboxGroup as ThemesCheckboxGroup } from "@radix-ui/themes";
import * as React from "react";

export interface CheckboxGroupProps
  extends React.ComponentPropsWithoutRef<typeof ThemesCheckboxGroup.Root> {
  className?: string;
}

export interface CheckboxProps
  extends React.ComponentPropsWithoutRef<typeof ThemesCheckboxGroup.Item> {
  className?: string;
  label?: React.ReactNode;
  children?: React.ReactNode;
}

export const CheckboxGroup = React.forwardRef<
  React.ElementRef<typeof ThemesCheckboxGroup.Root>,
  CheckboxGroupProps
>(({ className = "", children, ...props }, ref) => {
  return (
    <ThemesCheckboxGroup.Root ref={ref} className={className} {...props}>
      {children}
    </ThemesCheckboxGroup.Root>
  );
});

export const Checkbox = React.forwardRef<
  React.ElementRef<typeof ThemesCheckboxGroup.Item>,
  CheckboxProps
>(({ className = "", label, children, ...props }, ref) => {
  return (
    <ThemesCheckboxGroup.Item ref={ref} className={className} {...props}>
      {children ?? label}
    </ThemesCheckboxGroup.Item>
  );
});

CheckboxGroup.displayName = "CheckboxGroup";
Checkbox.displayName = "Checkbox";

export default Checkbox;

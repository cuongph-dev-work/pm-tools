import * as React from "react";
import {
  TextField,
  type TextFieldProps as RadixTextFieldProps,
} from "@radix-ui/themes";

export interface InputProps
  extends Omit<RadixTextFieldProps, "size" | "variant">,
    React.ComponentPropsWithoutRef<"input"> {
  className?: string;
  size?: "1" | "2" | "3" | "4";
}
/**
 * Input atom component sử dụng Radix UI Themes TextField.
 * Hỗ trợ className để tùy biến style theo guideline.
 */
export const Input = React.forwardRef<React.ElementRef<"input">, InputProps>(
  ({ className = "", size = "1", ...props }, ref) => {
    const rootClassName = ["w-full", className].filter(Boolean).join(" ");

    return (
      <TextField.Root size={size} className={rootClassName}>
        <TextField.Input ref={ref} {...props} />
      </TextField.Root>
    );
  }
);

Input.displayName = "Input";

export default Input;

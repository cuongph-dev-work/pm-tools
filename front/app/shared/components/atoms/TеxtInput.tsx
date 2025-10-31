import { TextField } from "@radix-ui/themes";
import * as React from "react";

type TextFieldRootProps = React.ComponentProps<typeof TextField.Root>;
type TextFieldSlotProps = React.ComponentProps<typeof TextField.Slot>;

export type InputProps = Omit<TextFieldRootProps, "className" | "children"> & {
  className?: string;
  leftSlot?: React.ReactNode;
  leftSlotProps?: Omit<TextFieldSlotProps, "children">;
  rightSlot?: React.ReactNode;
  rightSlotProps?: Omit<TextFieldSlotProps, "children">;
};

export const Input = React.forwardRef<
  React.ElementRef<typeof TextField.Root>,
  InputProps
>(
  (
    {
      className = "",
      leftSlot,
      leftSlotProps,
      rightSlot,
      rightSlotProps,
      ...props
    },
    ref
  ) => {
    const rootClassName = ["w-full", className].filter(Boolean).join(" ");
    return (
      <TextField.Root ref={ref} className={rootClassName} {...props}>
        {leftSlot ? (
          <TextField.Slot {...leftSlotProps}>{leftSlot}</TextField.Slot>
        ) : null}
        {rightSlot ? (
          <TextField.Slot {...rightSlotProps}>{rightSlot}</TextField.Slot>
        ) : null}
      </TextField.Root>
    );
  }
);

Input.displayName = "Input";

export default Input;

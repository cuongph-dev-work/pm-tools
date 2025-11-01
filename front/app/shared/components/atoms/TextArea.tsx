import {
  TextArea as RadixTextArea,
  type TextAreaProps as RadixTextAreaProps,
} from "@radix-ui/themes";
import * as React from "react";
import { cn } from "../../utils/cn";

export type TextareaProps = Omit<RadixTextAreaProps, "className"> & {
  className?: string;
};

export const Textarea = React.forwardRef<
  React.ElementRef<typeof RadixTextArea>,
  TextareaProps
>(({ className = "", ...props }, ref) => {
  return (
    <RadixTextArea
      ref={ref}
      radius="large"
      className={cn("w-full", className)}
      {...props}
    />
  );
});

Textarea.displayName = "Textarea";

export default Textarea;

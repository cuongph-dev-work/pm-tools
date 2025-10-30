import * as React from "react";
import {
  TextArea as RadixTextArea,
  type TextAreaProps as RadixTextAreaProps,
} from "@radix-ui/themes";

export interface TextareaProps
  extends Omit<RadixTextAreaProps, "size">,
    Omit<React.ComponentPropsWithoutRef<"textarea">, "size"> {
  className?: string;
}

export const Textarea = React.forwardRef<
  React.ElementRef<"textarea">,
  TextareaProps
>(({ className = "", ...props }, ref) => {
  return (
    <RadixTextArea
      ref={ref}
      className={["w-full", className].filter(Boolean).join(" ")}
      {...props}
    />
  );
});

Textarea.displayName = "Textarea";

export default Textarea;

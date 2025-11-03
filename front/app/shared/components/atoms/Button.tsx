import {
  Button as RadixButton,
  Text,
  type ButtonProps as RadixButtonProps,
} from "@radix-ui/themes";
import React from "react";
import { cn } from "../../utils/cn";

interface ButtonProps extends RadixButtonProps {
  label?: string;
  className?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export function Button({
  label,
  className = "",
  children,
  leftIcon,
  rightIcon,
  ...props
}: ButtonProps) {
  const composedClassName = cn("gap-2 font-medium", className);

  return (
    <RadixButton className={composedClassName} {...props}>
      {leftIcon && (
        <Text as="span" className="inline-flex items-center ml-1">
          {leftIcon}
        </Text>
      )}
      <Text as="span">{children || label}</Text>
      {rightIcon && (
        <Text as="span" className="inline-flex items-center mr-1">
          {rightIcon}
        </Text>
      )}
    </RadixButton>
  );
}

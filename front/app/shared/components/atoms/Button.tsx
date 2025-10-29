import {
  Button as RadixButton,
  type ButtonProps as RadixButtonProps,
} from "@radix-ui/themes";
import React from "react";

type ButtonProps = {
  label?: string;
  onClick?: () => void;
  variant?:
    | "primary"
    | "secondary"
    | "outline"
    | "ghost"
    | "soft"
    | "solid"
    | "surface"
    | "classic";
  size?: "sm" | "md" | "lg" | "1" | "2" | "3" | "4";
  className?: string;
  children?: React.ReactNode;
  asChild?: boolean;
  radius?: RadixButtonProps["radius"];
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
} & Omit<RadixButtonProps, "variant" | "size" | "color">;

// Map custom variants to Radix Themes variants
const variantMap: Record<
  "primary" | "secondary" | "outline" | "ghost",
  RadixButtonProps["variant"]
> = {
  primary: "solid",
  secondary: "soft",
  outline: "outline",
  ghost: "ghost",
};

// Map custom sizes to Radix Themes sizes
const sizeMap: Record<"sm" | "md" | "lg", RadixButtonProps["size"]> = {
  sm: "2",
  md: "3",
  lg: "4",
};

// Map variant to CSS variable name
const variantColorVarMap: Record<
  "primary" | "secondary" | "outline" | "ghost",
  string
> = {
  primary: "--button-primary-color",
  secondary: "--button-secondary-color",
  outline: "--button-outline-color",
  ghost: "--button-ghost-color",
};

// Get color from CSS variable or fallback
const getColorFromTheme = (
  variant: "primary" | "secondary" | "outline" | "ghost"
): RadixButtonProps["color"] => {
  if (typeof window === "undefined") {
    // SSR fallback
    const fallbackMap: Record<
      "primary" | "secondary" | "outline" | "ghost",
      RadixButtonProps["color"]
    > = {
      primary: "indigo",
      secondary: "gray",
      outline: "gray",
      ghost: "gray",
    };
    return fallbackMap[variant] || "indigo";
  }

  const cssVar = variantColorVarMap[variant];
  const colorValue =
    typeof window !== "undefined" && window.document
      ? window
          .getComputedStyle(window.document.documentElement)
          .getPropertyValue(cssVar)
          .trim()
      : "";

  // Validate color value matches Radix Themes color types
  const validColors: RadixButtonProps["color"][] = [
    "gray",
    "gold",
    "bronze",
    "brown",
    "yellow",
    "amber",
    "orange",
    "tomato",
    "red",
    "ruby",
    "pink",
    "plum",
    "purple",
    "violet",
    "iris",
    "indigo",
    "blue",
    "cyan",
    "teal",
    "jade",
    "green",
    "grass",
    "lime",
    "mint",
    "sky",
  ];

  if (
    colorValue &&
    validColors.includes(colorValue as RadixButtonProps["color"])
  ) {
    return colorValue as RadixButtonProps["color"];
  }

  // Fallback to default
  const fallbackMap: Record<
    "primary" | "secondary" | "outline" | "ghost",
    RadixButtonProps["color"]
  > = {
    primary: "indigo",
    secondary: "gray",
    outline: "gray",
    ghost: "gray",
  };
  return fallbackMap[variant || "primary"] || "indigo";
};

export function Button({
  label,
  onClick,
  variant = "primary",
  size = "md",
  className = "",
  children,
  asChild = false,
  radius,
  loading,
  leftIcon,
  rightIcon,
  ...props
}: ButtonProps) {
  // Map variant to Radix Themes variant
  const radixVariant =
    variant in variantMap
      ? variantMap[variant as "primary" | "secondary" | "outline"]
      : (variant as RadixButtonProps["variant"]);

  // Map size to Radix Themes size
  const radixSize =
    size in sizeMap
      ? sizeMap[size as "sm" | "md" | "lg"]
      : (size as RadixButtonProps["size"]);

  // Map variant to color from theme CSS variables
  const buttonColor =
    variant in variantColorVarMap
      ? getColorFromTheme(
          variant as "primary" | "secondary" | "outline" | "ghost"
        )
      : "gray";

  // Merge extra classes to better match mock
  const composedClassName = ["gap-2 font-medium", className]
    .filter(Boolean)
    .join(" ");

  return (
    <RadixButton
      variant={radixVariant}
      size={radixSize}
      color={buttonColor}
      radius={radius}
      loading={loading}
      asChild={asChild}
      onClick={onClick}
      className={composedClassName}
      {...props}
    >
      {leftIcon && (
        <span className="inline-flex items-center ml-1">{leftIcon}</span>
      )}
      <span>{children || label}</span>
      {rightIcon && (
        <span className="inline-flex items-center mr-1">{rightIcon}</span>
      )}
    </RadixButton>
  );
}

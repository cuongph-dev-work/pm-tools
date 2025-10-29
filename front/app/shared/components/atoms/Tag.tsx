import {
  Badge as RadixBadge,
  type BadgeProps as RadixBadgeProps,
} from "@radix-ui/themes";

interface TagProps {
  label: string;
  variant?:
    | "default"
    | "blue"
    | "red"
    | "green"
    | "yellow"
    | "purple"
    | "orange";
  className?: string;
  radius?: RadixBadgeProps["radius"];
}

const variantToColorMap: Record<
  NonNullable<TagProps["variant"]>,
  RadixBadgeProps["color"]
> = {
  default: "gray",
  blue: "blue",
  red: "red",
  green: "green",
  yellow: "yellow",
  purple: "purple",
  orange: "orange",
};

export function Tag({
  label,
  variant = "default",
  className = "",
  radius,
}: TagProps) {
  const color = variantToColorMap[variant] || "gray";
  return (
    <RadixBadge
      variant="soft"
      color={color}
      radius={radius}
      className={className}
    >
      {label}
    </RadixBadge>
  );
}

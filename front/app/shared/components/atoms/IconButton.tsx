import {
  IconButton as RadixIconButton,
  type IconButtonProps as RadixIconButtonProps,
} from "@radix-ui/themes";

type SizeAlias = "sm" | "md" | "lg";

type Props = Omit<RadixIconButtonProps, "size"> & {
  size?: RadixIconButtonProps["size"] | SizeAlias;
  className?: string;
};

const sizeMap: Record<SizeAlias, RadixIconButtonProps["size"]> = {
  sm: "2",
  md: "3",
  lg: "4",
};

export function IconButton({
  size = "3",
  className = "",
  children,
  ...rest
}: Props) {
  const mapSize = (s: Props["size"]): RadixIconButtonProps["size"] => {
    if (s === "sm" || s === "md" || s === "lg") {
      return sizeMap[s];
    }
    return (s ?? "3") as RadixIconButtonProps["size"];
  };

  const mappedSize = mapSize(size);
  return (
    <RadixIconButton
      size={mappedSize as RadixIconButtonProps["size"]}
      className={className}
      {...rest}
    >
      {children}
    </RadixIconButton>
  );
}

export type { RadixIconButtonProps as IconButtonProps };

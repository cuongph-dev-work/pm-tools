import { Avatar as RadixAvatar } from "@radix-ui/themes";

interface AvatarProps {
  name: string;
  src?: string;
  className?: string;
}

export function Avatar({ name, src, className = "" }: AvatarProps) {
  const initials = name
    .split(" ")
    .map(n => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <RadixAvatar
      src={src}
      radius="full"
      className={className}
      fallback={initials}
    />
  );
}

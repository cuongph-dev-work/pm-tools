import * as AvatarPrimitive from "@radix-ui/react-avatar";

interface AvatarProps {
  name: string;
  src?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses = {
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-12 h-12 text-base",
};

export function Avatar({
  name,
  src,
  size = "md",
  className = "",
}: AvatarProps) {
  const initials = name
    .split(" ")
    .map(n => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <AvatarPrimitive.Root
      className={`${sizeClasses[size]} rounded-full inline-flex items-center justify-center bg-gray-200 text-gray-700 font-medium ${className}`}
    >
      {src && (
        <AvatarPrimitive.Image
          src={src}
          alt={name}
          className="w-full h-full rounded-full object-cover"
        />
      )}
      <AvatarPrimitive.Fallback
        className="w-full h-full rounded-full flex items-center justify-center bg-gray-200 text-gray-700 font-medium"
        delayMs={0}
      >
        {initials}
      </AvatarPrimitive.Fallback>
    </AvatarPrimitive.Root>
  );
}

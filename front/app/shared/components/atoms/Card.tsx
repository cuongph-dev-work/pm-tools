import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "outlined" | "elevated";
  onClick?: () => void;
}

const variantClasses = {
  default: "bg-white",
  outlined: "bg-white border border-gray-200",
  elevated: "bg-white shadow-md",
};

export function Card({
  children,
  className = "",
  variant = "outlined",
  onClick,
}: CardProps) {
  const baseClasses =
    "rounded-lg p-4 transition-colors" +
    (onClick ? " cursor-pointer hover:bg-gray-50" : "");

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

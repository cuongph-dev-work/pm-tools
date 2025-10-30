import * as React from "react";

export interface CheckboxProps
  extends Omit<React.ComponentPropsWithoutRef<"input">, "type"> {
  className?: string;
  label?: string;
}

/**
 * Checkbox atom component - native HTML checkbox với Tailwind styling
 * Hỗ trợ className và label tùy biến theo guideline
 */
export const Checkbox = React.forwardRef<
  React.ElementRef<"input">,
  CheckboxProps
>(({ className = "", label, ...props }, ref) => {
  const checkbox = (
    <input
      ref={ref}
      type="checkbox"
      className={`h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    />
  );

  if (label) {
    return (
      <label className="flex items-center gap-2 cursor-pointer">
        {checkbox}
        <span className="text-sm text-gray-700">{label}</span>
      </label>
    );
  }

  return checkbox;
});

Checkbox.displayName = "Checkbox";

export default Checkbox;

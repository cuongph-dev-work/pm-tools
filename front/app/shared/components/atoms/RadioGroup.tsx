import * as React from "react";

export interface RadioOption {
  value: string;
  label: string;
  labelKey?: string;
  disabled?: boolean;
}

export interface RadioGroupProps
  extends Omit<React.ComponentPropsWithoutRef<"div">, "onChange"> {
  name: string;
  value?: string;
  onChange?: (value: string) => void;
  options: RadioOption[];
  className?: string;
  optionClassName?: string;
}

/**
 * RadioGroup atom sử dụng HTML native radio với Tailwind CSS.
 * Hỗ trợ className để tùy biến style theo guideline.
 * Không hardcode text: nhận labelKey trong options để i18n ở layer molecule.
 */
export const RadioGroup = React.forwardRef<
  React.ElementRef<"div">,
  RadioGroupProps
>(
  (
    {
      name,
      value,
      onChange,
      options,
      className = "",
      optionClassName = "",
      ...props
    },
    ref
  ) => {
    const handleChange = (e: React.ChangeEvent) => {
      onChange?.((e.target as any).value);
    };

    const groupClassName = ["space-y-2", className].filter(Boolean).join(" ");
    const radioOptionClassName = [
      "w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2",
      optionClassName,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div ref={ref} className={groupClassName} {...props}>
        {options.map(option => (
          <div key={option.value} className="flex items-center gap-2">
            <input
              type="radio"
              id={`${name}-${option.value}`}
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={handleChange}
              disabled={option.disabled}
              className={radioOptionClassName}
            />
            <label
              htmlFor={`${name}-${option.value}`}
              className={`text-sm text-gray-700 cursor-pointer ${
                option.disabled ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {option.label || option.labelKey}
            </label>
          </div>
        ))}
      </div>
    );
  }
);

RadioGroup.displayName = "RadioGroup";

export default RadioGroup;

/// <reference lib="dom" />
import * as Popover from "@radix-ui/react-popover";
import dayjs from "dayjs";
import { CalendarIcon } from "lucide-react";
import * as React from "react";
import { useTranslation } from "react-i18next";
import { cn } from "../../utils/cn";
import { Calendar } from "./Calendar";
import { Input } from "./TеxtInput";

export interface DatePickerProps {
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  className?: string;
  id?: string;
  "aria-invalid"?: boolean;
  "aria-errormessage"?: string;
  disabled?: boolean;
  minDate?: Date | string;
  maxDate?: Date | string;
}

// Constants
const DATE_FORMATS: Record<string, string> = {
  vi: "DD/MM/YYYY",
  ja: "YYYY年MM月DD日",
  en: "MM/DD/YYYY",
} as const;

const PARSE_FORMATS = [
  "DD/MM/YYYY",
  "MM/DD/YYYY",
  "YYYY-MM-DD",
  "YYYY年MM月DD日",
] as const;

const BLUR_DELAY_MS = 200;

export const DatePicker = React.forwardRef<
  React.ElementRef<typeof Input>,
  DatePickerProps
>(
  (
    {
      value = "",
      onChange,
      onBlur,
      placeholder,
      className = "",
      id,
      "aria-invalid": ariaInvalid,
      "aria-errormessage": ariaErrorMessage,
      disabled,
      minDate,
      maxDate,
      ...props
    },
    ref
  ) => {
    const { i18n } = useTranslation();
    const [open, setOpen] = React.useState(false);
    const [displayValue, setDisplayValue] = React.useState("");

    // Parse value to Date
    const selectedDate = React.useMemo(() => {
      if (!value) return undefined;
      const date = dayjs(value);
      return date.isValid() ? date.toDate() : undefined;
    }, [value]);

    // Parse minDate and maxDate to Date objects
    const parsedMinDate = React.useMemo(() => {
      if (!minDate) return undefined;
      if (minDate instanceof Date) return minDate;
      const date = dayjs(minDate);
      return date.isValid() ? date.toDate() : undefined;
    }, [minDate]);

    const parsedMaxDate = React.useMemo(() => {
      if (!maxDate) return undefined;
      if (maxDate instanceof Date) return maxDate;
      const date = dayjs(maxDate);
      return date.isValid() ? date.toDate() : undefined;
    }, [maxDate]);

    // Format date for display based on locale
    React.useEffect(() => {
      if (selectedDate) {
        const date = dayjs(selectedDate);
        const format = DATE_FORMATS[i18n.language] || DATE_FORMATS.en;
        setDisplayValue(date.format(format));
      } else {
        setDisplayValue("");
      }
    }, [selectedDate, i18n.language]);

    const handleSelect = (date: Date | undefined) => {
      if (date) {
        const formatted = dayjs(date).format("YYYY-MM-DD");
        onChange?.(formatted);
        setOpen(false);
      } else {
        onChange?.("");
      }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;
      setDisplayValue(inputValue);

      // Try to parse the input value
      const parsed = dayjs(inputValue, PARSE_FORMATS as unknown as string[]);
      if (parsed.isValid()) {
        onChange?.(parsed.format("YYYY-MM-DD"));
      }
    };

    const handleInputClick = (e: React.MouseEvent) => {
      e.preventDefault();
      setOpen(true);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      // Delay onBlur to allow calendar selection
      window.setTimeout(() => {
        const relatedTarget = e.relatedTarget as HTMLElement | null;
        // Don't blur if focus is moving to calendar popover
        if (
          !relatedTarget ||
          (!relatedTarget.closest("[data-radix-popper-content-wrapper]") &&
            !relatedTarget.closest('[role="grid"]'))
        ) {
          onBlur?.();
        }
      }, BLUR_DELAY_MS);
    };

    return (
      <Popover.Root open={open} onOpenChange={setOpen}>
        <Popover.Trigger asChild>
          <div className="relative inline-block">
            <Input
              ref={ref}
              id={id}
              type="text"
              value={displayValue}
              onChange={handleInputChange}
              onBlur={handleBlur}
              onClick={handleInputClick}
              onFocus={() => setOpen(true)}
              placeholder={placeholder}
              className={cn("pr-10 cursor-pointer", className)}
              leftSlot={<CalendarIcon className="w-4 h-4 text-gray-400" />}
              aria-invalid={ariaInvalid}
              aria-errormessage={ariaErrorMessage}
              disabled={disabled}
              readOnly
              {...props}
            />
          </div>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content
            className={cn(
              "z-[1010] w-auto p-0 bg-white rounded-md border border-gray-200 shadow-md",
              "data-[state=open]:animate-in data-[state=closed]:animate-out",
              "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
              "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
              "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2",
              "data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
            )}
            align="start"
            sideOffset={4}
            onInteractOutside={e => {
              // Prevent closing when clicking on the input
              const target = e.target as HTMLElement;
              if (
                target.closest('[role="textbox"]') ||
                target.closest("input")
              ) {
                e.preventDefault();
              }
            }}
          >
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleSelect}
              minDate={parsedMinDate}
              maxDate={parsedMaxDate}
            />
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    );
  }
);

DatePicker.displayName = "DatePicker";

export default DatePicker;

import { enUS, ja, type Locale } from "date-fns/locale";
import { ChevronDown } from "lucide-react";
import * as React from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { useTranslation } from "react-i18next";
import { cn } from "../../utils/cn";

export type CalendarProps = React.ComponentProps<typeof DayPicker> & {
  minDate?: Date;
  maxDate?: Date;
};

const MONTH_KEYS = [
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december",
] as const;

const RDP_LOCALE_MAP: Record<string, Locale> = {
  en: enUS,
  ja: ja,
  vi: enUS,
} as const;

// Helper to compare months (year + month only, ignore day)
function compareMonth(date1: Date, date2: Date): number {
  const year1 = date1.getFullYear();
  const month1 = date1.getMonth();
  const year2 = date2.getFullYear();
  const month2 = date2.getMonth();

  if (year1 !== year2) {
    return year1 - year2;
  }
  return month1 - month2;
}

function isMonthBefore(month: Date, compareTo: Date): boolean {
  return compareMonth(month, compareTo) < 0;
}

function isMonthAfter(month: Date, compareTo: Date): boolean {
  return compareMonth(month, compareTo) > 0;
}

interface CustomCaptionProps {
  displayMonth: Date;
  goToMonth: (date: Date) => void;
  previousMonth?: Date;
  nextMonth?: Date;
  maxDate?: Date;
  minDate?: Date;
}

const CustomCaption = React.memo(function CustomCaption({
  displayMonth,
  goToMonth,
  previousMonth,
  nextMonth,
  maxDate,
  minDate,
}: CustomCaptionProps) {
  const { t } = useTranslation();
  const [showMonthDropdown, setShowMonthDropdown] = React.useState(false);
  const [showYearDropdown, setShowYearDropdown] = React.useState(false);
  const monthDropdownRef = React.useRef<HTMLDivElement>(null);
  const yearDropdownRef = React.useRef<HTMLDivElement>(null);

  const currentMonth = displayMonth.getMonth();
  const currentYear = displayMonth.getFullYear();

  // Get month names from i18n
  const monthNames = React.useMemo(
    () =>
      MONTH_KEYS.map(key =>
        t(`common.months.${key}`, {
          defaultValue: key.charAt(0).toUpperCase() + key.slice(1),
        })
      ),
    [t]
  );

  const handleMonthChange = React.useCallback(
    (monthIndex: number) => {
      const newDate = new Date(currentYear, monthIndex, 1);
      // Check if month is within minDate/maxDate range
      if (minDate && isMonthBefore(newDate, minDate)) {
        return;
      }
      if (maxDate && isMonthAfter(newDate, maxDate)) {
        return;
      }
      goToMonth(newDate);
      setShowMonthDropdown(false);
    },
    [currentYear, goToMonth, minDate, maxDate]
  );

  const handleYearChange = React.useCallback(
    (year: number) => {
      const newDate = new Date(year, currentMonth, 1);
      // Check if year/month combination is within minDate/maxDate range
      if (minDate && isMonthBefore(newDate, minDate)) {
        return;
      }
      if (maxDate && isMonthAfter(newDate, maxDate)) {
        return;
      }
      goToMonth(newDate);
      setShowYearDropdown(false);
    },
    [currentMonth, goToMonth, minDate, maxDate]
  );

  // Generate years (±100 years from maxDate, minDate, or current year)
  // Filter years based on minDate/maxDate
  const years = React.useMemo(() => {
    let centerYear: number;
    let minYear: number | undefined;
    let maxYear: number | undefined;

    if (maxDate) {
      centerYear = maxDate.getFullYear();
      maxYear = maxDate.getFullYear();
    } else {
      centerYear = currentYear;
    }
    if (minDate) {
      minYear = minDate.getFullYear();
      if (!centerYear || centerYear < minYear) {
        centerYear = minYear;
      }
    }

    // Generate 201 years: from (centerYear - 100) to (centerYear + 100)
    const allYears = Array.from(
      { length: 201 },
      (_, i) => centerYear - 100 + i
    );

    // Filter based on minDate/maxDate
    return allYears.filter(year => {
      if (minYear !== undefined && year < minYear) return false;
      if (maxYear !== undefined && year > maxYear) return false;
      return true;
    });
  }, [currentYear, maxDate, minDate]);

  // Filter months based on minDate/maxDate for current year
  const availableMonths = React.useMemo(() => {
    return monthNames.map((month, index) => {
      const monthDate = new Date(currentYear, index, 1);
      const isDisabled =
        (minDate && isMonthBefore(monthDate, minDate)) ||
        (maxDate && isMonthAfter(monthDate, maxDate));

      return { month, index, isDisabled };
    });
  }, [monthNames, currentYear, minDate, maxDate]);

  // Scroll to selected month when dropdown opens
  React.useEffect(() => {
    if (showMonthDropdown && monthDropdownRef.current) {
      // Use requestAnimationFrame to ensure DOM is ready
      window.requestAnimationFrame(() => {
        if (monthDropdownRef.current) {
          // Find the button for current month
          const currentMonthButton = monthDropdownRef.current.querySelector(
            `[data-month="${currentMonth}"]`
          ) as HTMLElement | null;
          if (currentMonthButton) {
            // Scroll into view with smooth behavior
            currentMonthButton.scrollIntoView({
              behavior: "smooth",
              block: "center",
            });
          }
        }
      });
    }
  }, [showMonthDropdown, currentMonth]);

  // Scroll to selected year when dropdown opens
  React.useEffect(() => {
    if (showYearDropdown && yearDropdownRef.current) {
      // Use requestAnimationFrame to ensure DOM is ready
      window.requestAnimationFrame(() => {
        if (yearDropdownRef.current) {
          // Find the button for current year
          const currentYearButton = yearDropdownRef.current.querySelector(
            `[data-year="${currentYear}"]`
          ) as HTMLElement | null;
          if (currentYearButton) {
            // Scroll into view with smooth behavior
            currentYearButton.scrollIntoView({
              behavior: "smooth",
              block: "center",
            });
          }
        }
      });
    }
  }, [showYearDropdown, currentYear]);

  const handleClickOutside = () => {
    setShowMonthDropdown(false);
    setShowYearDropdown(false);
  };

  return (
    <div className="flex items-center justify-between px-4 pt-4 pb-3">
      <div className="flex items-center gap-3">
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowMonthDropdown(!showMonthDropdown)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--gray-a2)] hover:bg-[var(--gray-a3)] transition-colors text-sm font-medium text-[var(--gray-a12)]"
          >
            {monthNames[currentMonth]}
            <ChevronDown className="h-3 w-3" />
          </button>
          {showMonthDropdown && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={handleClickOutside}
              />
              <div
                ref={monthDropdownRef}
                className="absolute top-full left-0 mt-1 bg-[var(--gray-1)] rounded-lg border border-[var(--gray-a6)] shadow-lg py-1 z-20 max-h-60 overflow-y-auto min-w-[120px] scrollbar-hide"
              >
                {availableMonths
                  .filter(({ isDisabled }) => !isDisabled)
                  .map(({ month, index }) => (
                    <button
                      key={MONTH_KEYS[index]}
                      data-month={index}
                      type="button"
                      onClick={() => handleMonthChange(index)}
                      className={cn(
                        "w-full text-left px-3 py-1.5 text-sm transition-colors hover:bg-[var(--accent-a2)] text-[var(--gray-a12)]",
                        index === currentMonth &&
                          "bg-[var(--accent-a3)] text-[var(--accent-a11)]"
                      )}
                    >
                      {month}
                    </button>
                  ))}
              </div>
            </>
          )}
        </div>
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowYearDropdown(!showYearDropdown)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--gray-a2)] hover:bg-[var(--gray-a3)] transition-colors text-sm font-medium text-[var(--gray-a12)]"
          >
            {currentYear}
            <ChevronDown className="h-3 w-3" />
          </button>
          {showYearDropdown && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={handleClickOutside}
              />
              <div
                ref={yearDropdownRef}
                className="absolute top-full left-0 mt-1 bg-[var(--gray-1)] rounded-lg border border-[var(--gray-a6)] shadow-lg py-1 z-20 max-h-60 overflow-y-auto min-w-[80px] scrollbar-hide"
              >
                {years
                  .filter(year => {
                    // Check if year has any valid months by checking each month in the year
                    if (!minDate && !maxDate) {
                      return true;
                    }

                    for (let monthIndex = 0; monthIndex < 12; monthIndex++) {
                      const monthDate = new Date(year, monthIndex, 1);

                      const isBeforeMin =
                        minDate && isMonthBefore(monthDate, minDate);
                      const isAfterMax =
                        maxDate && isMonthAfter(monthDate, maxDate);

                      if (!isBeforeMin && !isAfterMax) {
                        return true; // Year has at least one valid month
                      }
                    }

                    return false; // Year has no valid months
                  })
                  .map(year => (
                    <button
                      key={year}
                      data-year={year}
                      type="button"
                      onClick={() => handleYearChange(year)}
                      className={cn(
                        "w-full text-left px-3 py-1.5 text-sm transition-colors hover:bg-[var(--accent-a2)] text-[var(--gray-a12)]",
                        year === currentYear &&
                          "bg-[var(--accent-a3)] text-[var(--accent-a11)]"
                      )}
                    >
                      {year}
                    </button>
                  ))}
              </div>
            </>
          )}
        </div>
      </div>
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => previousMonth && goToMonth(previousMonth)}
          disabled={!previousMonth}
          className="h-8 w-8 inline-flex items-center justify-center rounded-lg hover:bg-[var(--gray-a2)] transition-colors text-[var(--gray-a11)] hover:text-[var(--gray-a12)] disabled:opacity-30 disabled:cursor-not-allowed disabled:text-[var(--gray-a8)]"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => nextMonth && goToMonth(nextMonth)}
          disabled={!nextMonth}
          className="h-8 w-8 inline-flex items-center justify-center rounded-lg hover:bg-[var(--gray-a2)] transition-colors text-[var(--gray-a11)] hover:text-[var(--gray-a12)] disabled:opacity-30 disabled:cursor-not-allowed disabled:text-[var(--gray-a8)]"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
          >
            <path d="m9 18 6-6-6-6" />
          </svg>
        </button>
      </div>
    </div>
  );
});

export const Calendar = React.memo(function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  month: controlledMonth,
  defaultMonth,
  onMonthChange,
  minDate,
  maxDate,
  ...props
}: CalendarProps) {
  const { i18n } = useTranslation();

  // Extract selected from props (DayPicker can have different modes with different selected types)
  const selected = "selected" in props ? props.selected : undefined;

  // Map minDate/maxDate to disabled modifier for react-day-picker v9+
  // Build disabled array for react-day-picker v9+
  const disabledModifiers = React.useMemo(() => {
    const disabled: Array<{ before?: Date; after?: Date }> = [];
    if (minDate) {
      disabled.push({ before: minDate });
    }
    if (maxDate) {
      disabled.push({ after: maxDate });
    }
    return disabled.length > 0 ? disabled : undefined;
  }, [minDate, maxDate]);

  // Don't use startMonth/endMonth as they prevent rendering days outside the range
  // Instead, we'll only use disabled modifiers to show but disable days outside range

  // Determine initial month: use selected date's month if available, otherwise defaultMonth, otherwise today
  const getInitialMonth = React.useCallback(() => {
    if (selected && selected instanceof Date) {
      return new Date(selected.getFullYear(), selected.getMonth(), 1);
    }
    return defaultMonth || new Date();
  }, [selected, defaultMonth]);

  // Use controlled month if provided, otherwise use internal state
  const [internalMonth, setInternalMonth] =
    React.useState<Date>(getInitialMonth());

  // Update month when selected date changes (only when selected prop changes externally)
  React.useEffect(() => {
    if (selected && selected instanceof Date && !controlledMonth) {
      const selectedMonth = new Date(
        selected.getFullYear(),
        selected.getMonth(),
        1
      );
      setInternalMonth(prevMonth => {
        // Only update if different from current month
        if (
          prevMonth.getFullYear() !== selectedMonth.getFullYear() ||
          prevMonth.getMonth() !== selectedMonth.getMonth()
        ) {
          return selectedMonth;
        }
        return prevMonth;
      });
    }
  }, [selected, controlledMonth]); // Removed internalMonth from dependencies

  const month = controlledMonth ?? internalMonth;

  // Memoize locale calculations for react-day-picker
  const rdpLocale = React.useMemo(
    () => RDP_LOCALE_MAP[i18n.language] || enUS,
    [i18n.language]
  );

  // Calculate navigation months with minDate/maxDate constraints
  const previousMonth = React.useMemo(() => {
    const prev = new Date(month.getFullYear(), month.getMonth() - 1, 1);
    // Check if previous month is before minDate
    if (minDate && isMonthBefore(prev, minDate)) {
      return undefined;
    }
    return prev;
  }, [month, minDate]);

  const nextMonth = React.useMemo(() => {
    const next = new Date(month.getFullYear(), month.getMonth() + 1, 1);
    // Check if next month is after maxDate
    if (maxDate && isMonthAfter(next, maxDate)) {
      return undefined;
    }
    return next;
  }, [month, maxDate]);

  const goToMonth = React.useCallback(
    (date: Date) => {
      if (onMonthChange) {
        onMonthChange(date);
      } else {
        setInternalMonth(date);
      }
    },
    [onMonthChange]
  );

  // Memoize class names configuration
  const dayPickerClassNames = React.useMemo(
    () => ({
      months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
      month: "space-y-0",
      caption: "!hidden !m-0 !p-0 !h-0 !min-h-0 !overflow-hidden",
      caption_label: "!hidden",
      nav: "hidden",
      nav_button: "hidden",
      table: "w-full border-collapse",
      head_row: "flex mb-1",
      head_cell:
        "text-[var(--gray-a11)] rounded-md w-10 font-bold text-xs uppercase flex items-center justify-center px-1",
      row: "flex w-full mt-0.5",
      cell: "h-10 w-10 text-center text-sm p-0 relative focus-within:relative focus-within:z-20",
      day: cn(
        "h-10 w-10 p-0 font-medium",
        "rounded-lg transition-all duration-200",
        "hover:bg-[var(--accent-a2)] hover:text-[var(--accent-a11)]",
        "focus:outline-none focus:ring-2 focus:ring-[var(--accent-9)] focus:ring-offset-2",
        "active:scale-95"
      ),
      day_range_end: "day-range-end",
      day_selected:
        "!bg-[var(--accent-9)] !text-white !font-semibold !shadow-md",
      day_today:
        "!bg-transparent !text-[var(--accent-11)] !font-bold !ring-2 !ring-[var(--accent-9)] !ring-inset",
      day_outside:
        "text-[var(--gray-a9)] opacity-40 aria-selected:bg-[var(--accent-a2)] aria-selected:text-[var(--accent-a11)]",
      day_disabled:
        "text-[var(--gray-a8)] opacity-40 cursor-not-allowed hover:bg-transparent hover:text-[var(--gray-a8)]",
      day_range_middle:
        "aria-selected:bg-[var(--accent-a2)] aria-selected:text-[var(--gray-a12)] rounded-none",
      day_hidden: "",
      ...classNames,
    }),
    [classNames]
  );

  // Memoize modifiers
  const modifiers = React.useMemo(
    () => ({
      sunday: (date: Date) => date.getDay() === 0,
    }),
    []
  );

  // Combine disabled modifiers with existing disabled from props
  const allDisabled = React.useMemo(() => {
    const { disabled: propsDisabled } = props;

    if (!disabledModifiers || disabledModifiers.length === 0) {
      return propsDisabled;
    }

    // If there are date range restrictions, combine with existing disabled
    if (propsDisabled) {
      if (Array.isArray(propsDisabled)) {
        return [...propsDisabled, ...disabledModifiers];
      }
      return [propsDisabled, ...disabledModifiers];
    }

    return disabledModifiers.length === 1
      ? disabledModifiers[0]
      : disabledModifiers;
  }, [disabledModifiers, props]);

  // Memoize modifier class names
  const modifiersClassNames = React.useMemo(
    () => ({
      sunday: "!text-[var(--accent-9)] font-semibold",
      today:
        "!bg-transparent !text-[var(--accent-11)] !font-bold !ring-2 !ring-[var(--accent-9)] !ring-inset",
      selected: "!bg-[var(--accent-9)] !text-white !font-semibold !shadow-md",
    }),
    []
  );

  return (
    <div className={cn("bg-[var(--color-panel)] rounded-lg", className)}>
      {/* Custom Navigation */}
      <CustomCaption
        displayMonth={month}
        goToMonth={goToMonth}
        previousMonth={previousMonth}
        nextMonth={nextMonth}
        maxDate={maxDate}
        minDate={minDate}
      />

      <DayPicker
        showOutsideDays={showOutsideDays}
        className="p-0 px-4 pb-4"
        locale={rdpLocale}
        month={month}
        onMonthChange={goToMonth}
        classNames={dayPickerClassNames}
        modifiersClassNames={modifiersClassNames}
        modifiers={modifiers}
        {...(allDisabled !== undefined
          ? { disabled: allDisabled as never }
          : {})}
        {...props}
      />
    </div>
  );
});

Calendar.displayName = "Calendar";

export default Calendar;

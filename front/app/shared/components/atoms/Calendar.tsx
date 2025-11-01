import { enUS, ja, type Locale } from "date-fns/locale";
import dayjs from "dayjs";
import "dayjs/locale/en";
import "dayjs/locale/ja";
import "dayjs/locale/vi";
import { ChevronDown } from "lucide-react";
import * as React from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { useTranslation } from "react-i18next";
import { cn } from "../../utils/cn";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

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

const LOCALE_MAP: Record<string, string> = {
  en: "en",
  ja: "ja",
  vi: "vi",
} as const;

const RDP_LOCALE_MAP: Record<string, Locale> = {
  en: enUS,
  ja: ja,
  vi: enUS, // date-fns doesn't have Vietnamese, fallback to English
} as const;

interface CustomCaptionProps {
  displayMonth: Date;
  goToMonth: (date: Date) => void;
  previousMonth?: Date;
  nextMonth?: Date;
}

const CustomCaption = React.memo(function CustomCaption({
  displayMonth,
  goToMonth,
  previousMonth,
  nextMonth,
}: CustomCaptionProps) {
  const { t } = useTranslation();
  const [showMonthDropdown, setShowMonthDropdown] = React.useState(false);
  const [showYearDropdown, setShowYearDropdown] = React.useState(false);

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
      goToMonth(new Date(currentYear, monthIndex, 1));
      setShowMonthDropdown(false);
    },
    [currentYear, goToMonth]
  );

  const handleYearChange = React.useCallback(
    (year: number) => {
      goToMonth(new Date(year, currentMonth, 1));
      setShowYearDropdown(false);
    },
    [currentMonth, goToMonth]
  );

  // Generate years (current year ± 10)
  const years = React.useMemo(
    () => Array.from({ length: 21 }, (_, i) => currentYear - 10 + i),
    [currentYear]
  );

  const handleClickOutside = React.useCallback(() => {
    setShowMonthDropdown(false);
    setShowYearDropdown(false);
  }, []);

  return (
    <div className="flex items-center justify-between px-4 pt-4 pb-3">
      <div className="flex items-center gap-3">
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowMonthDropdown(!showMonthDropdown)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors text-sm font-medium text-gray-900"
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
              <div className="absolute top-full left-0 mt-1 bg-white rounded-lg border border-gray-200 shadow-lg py-1 z-20 max-h-60 overflow-y-auto min-w-[120px] custom-scrollbar">
                {monthNames.map((month, index) => (
                  <button
                    key={MONTH_KEYS[index]}
                    type="button"
                    onClick={() => handleMonthChange(index)}
                    className={cn(
                      "w-full text-left px-3 py-1.5 text-sm hover:bg-orange-50 transition-colors",
                      index === currentMonth && "bg-orange-100 text-orange-700"
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
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors text-sm font-medium text-gray-900"
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
              <div className="absolute top-full left-0 mt-1 bg-white rounded-lg border border-gray-200 shadow-lg py-1 z-20 max-h-60 overflow-y-auto min-w-[80px] custom-scrollbar">
                {years.map(year => (
                  <button
                    key={year}
                    type="button"
                    onClick={() => handleYearChange(year)}
                    className={cn(
                      "w-full text-left px-3 py-1.5 text-sm hover:bg-orange-50 transition-colors",
                      year === currentYear && "bg-orange-100 text-orange-700"
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
          className="h-8 w-8 inline-flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors text-gray-600 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed"
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
          className="h-8 w-8 inline-flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors text-gray-600 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed"
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
  ...props
}: CalendarProps) {
  const { i18n } = useTranslation();

  // Use controlled month if provided, otherwise use internal state
  const [internalMonth, setInternalMonth] = React.useState<Date>(
    defaultMonth || new Date()
  );
  const month = controlledMonth ?? internalMonth;

  // Memoize locale calculations
  const dayjsLocale = React.useMemo(
    () => LOCALE_MAP[i18n.language] || "en",
    [i18n.language]
  );

  const rdpLocale = React.useMemo(
    () => RDP_LOCALE_MAP[i18n.language] || enUS,
    [i18n.language]
  );

  // Update dayjs locale when language changes
  React.useEffect(() => {
    dayjs.locale(dayjsLocale);
  }, [dayjsLocale]);

  // Calculate navigation months
  const previousMonth = React.useMemo(
    () => new Date(month.getFullYear(), month.getMonth() - 1, 1),
    [month]
  );

  const nextMonth = React.useMemo(
    () => new Date(month.getFullYear(), month.getMonth() + 1, 1),
    [month]
  );

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
        "text-gray-600 rounded-md w-10 font-bold text-xs uppercase flex items-center justify-center px-1",
      row: "flex w-full mt-0.5",
      cell: "h-10 w-10 text-center text-sm p-0 relative focus-within:relative focus-within:z-20",
      day: cn(
        "h-10 w-10 p-0 font-medium",
        "rounded-lg transition-all duration-200",
        "hover:bg-orange-50 hover:text-orange-700",
        "focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2",
        "active:scale-95"
      ),
      day_range_end: "day-range-end",
      day_selected:
        "!bg-orange-100 !text-gray-900 !font-semibold !underline !decoration-2 !decoration-orange-500 !underline-offset-2",
      day_today:
        "!bg-orange-100 !text-gray-900 !font-semibold !border-2 !border-transparent",
      day_outside:
        "text-gray-400 opacity-40 aria-selected:bg-orange-50 aria-selected:text-orange-700",
      day_disabled:
        "text-gray-300 opacity-40 cursor-not-allowed hover:bg-transparent hover:text-gray-300",
      day_range_middle:
        "aria-selected:bg-orange-50 aria-selected:text-gray-900 rounded-none",
      day_hidden: "invisible",
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

  // Memoize modifier class names
  const modifiersClassNames = React.useMemo(
    () => ({
      sunday: "!text-orange-500 font-semibold",
      today:
        "!bg-orange-100 !text-gray-900 !font-semibold !border-2 !border-white",
      selected:
        "!bg-orange-100 !text-gray-900 !font-semibold !underline !decoration-2 !decoration-orange-500 !underline-offset-2 !border-2 !border-white",
    }),
    []
  );

  return (
    <div className={cn("bg-white rounded-lg", className)}>
      {/* Custom Navigation */}
      <CustomCaption
        displayMonth={month}
        goToMonth={goToMonth}
        previousMonth={previousMonth}
        nextMonth={nextMonth}
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
        {...props}
      />
    </div>
  );
});

Calendar.displayName = "Calendar";

export default Calendar;

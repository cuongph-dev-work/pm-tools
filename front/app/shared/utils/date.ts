import dayjs, { Dayjs } from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import duration from "dayjs/plugin/duration";
import isToday from "dayjs/plugin/isToday";
import isTomorrow from "dayjs/plugin/isTomorrow";
import isYesterday from "dayjs/plugin/isYesterday";
import relativeTime from "dayjs/plugin/relativeTime";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

// Extend dayjs with plugins
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(relativeTime);
dayjs.extend(duration);
dayjs.extend(isToday);
dayjs.extend(isYesterday);
dayjs.extend(isTomorrow);
dayjs.extend(advancedFormat);

// Common date formats
export const DATE_FORMATS = {
  ISO: "YYYY-MM-DD",
  ISO_DATETIME: "YYYY-MM-DDTHH:mm:ss",
  ISO_FULL: "YYYY-MM-DDTHH:mm:ss.SSSZ",
  DISPLAY_DATE: "MMM DD, YYYY",
  DISPLAY_DATETIME: "MMM DD, YYYY HH:mm",
  DISPLAY_TIME: "HH:mm",
  DISPLAY_TIME_12H: "hh:mm A",
  FULL_DATE: "dddd, MMMM DD, YYYY",
  FULL_DATETIME: "dddd, MMMM DD, YYYY HH:mm",
  SHORT_DATE: "MM/DD/YYYY",
  SHORT_DATETIME: "MM/DD/YYYY HH:mm",
  JAPANESE_DATE: "YYYY年MM月DD日",
  JAPANESE_DATETIME: "YYYY年MM月DD日 HH:mm",
  JAPANESE_FULL_DATE: "YYYY年MM月DD日 dddd",
  JAPANESE_FULL_DATETIME: "YYYY年MM月DD日 dddd HH:mm",
} as const;

// Common timezones
export const TIMEZONES = {
  UTC: "UTC",
  ASIA_HO_CHI_MINH: "Asia/Ho_Chi_Minh",
  ASIA_TOKYO: "Asia/Tokyo",
  AMERICA_NEW_YORK: "America/New_York",
  AMERICA_LOS_ANGELES: "America/Los_Angeles",
  EUROPE_LONDON: "Europe/London",
} as const;

// Default timezone
export const DEFAULT_TIMEZONE = TIMEZONES.ASIA_TOKYO;

export type DateInput = string | number | Date | Dayjs;
export type DateFormat = keyof typeof DATE_FORMATS | string;
export type Timezone = keyof typeof TIMEZONES | string;

interface DateOptions {
  timezone?: Timezone;
  format?: DateFormat;
}

/**
 * Get current date/time
 */
export const now = (timezone: Timezone = DEFAULT_TIMEZONE): Dayjs => {
  const current = dayjs();
  return current.tz(getTimezoneValue(timezone));
};

/**
 * Create dayjs instance from input
 */
export const createDate = (input?: DateInput, options?: DateOptions): Dayjs => {
  let date = input ? dayjs(input) : dayjs();

  const timezone = options?.timezone || DEFAULT_TIMEZONE;
  date = date.tz(getTimezoneValue(timezone));

  return date;
};

/**
 * Format date to string
 */
export const formatDate = (
  date: DateInput,
  format: DateFormat = "DISPLAY_DATE",
  timezone: Timezone = DEFAULT_TIMEZONE
): string => {
  let dateObj = dayjs(date);

  dateObj = dateObj.tz(getTimezoneValue(timezone));

  const formatString = getFormatValue(format);
  return dateObj.format(formatString);
};

/**
 * Format date based on locale (YYYY-MM-DD for en, DD-MM-YYYY for vi)
 */
export const formatDateByLocale = (
  dateString: string | null | undefined,
  locale: string
): string | undefined => {
  if (!dateString) return undefined;
  const date = dayjs(dateString);
  if (!date.isValid()) return undefined;

  // Format: YYYY-MM-DD for en, DD-MM-YYYY for vi
  return locale === "vi"
    ? date.format("DD/MM/YYYY")
    : date.format("YYYY/MM/DD");
};

/**
 * Parse date string with timezone
 */
export const parseDate = (
  dateString: string,
  format?: string,
  timezone: Timezone = DEFAULT_TIMEZONE
): Dayjs => {
  let date = format ? dayjs(dateString, format) : dayjs(dateString);

  date = date.tz(getTimezoneValue(timezone));

  return date;
};

/**
 * Parse date string to native Date object or undefined if invalid
 */
export const parseToNativeDate = (
  dateValue?: string | Date | Dayjs
): Date | undefined => {
  if (!dateValue) return undefined;
  if (dateValue instanceof Date) return dateValue;
  const date = dayjs(dateValue);
  return date.isValid() ? date.toDate() : undefined;
};

/**
 * Convert date to different timezone
 */
export const convertTimezone = (
  date: DateInput,
  toTimezone: Timezone,
  fromTimezone?: Timezone
): Dayjs => {
  let dateObj = dayjs(date);

  if (fromTimezone) {
    dateObj = dateObj.tz(getTimezoneValue(fromTimezone));
  }

  return dateObj.tz(getTimezoneValue(toTimezone));
};

/**
 * Get relative time (e.g., "2 hours ago", "in 3 days")
 */
export const getRelativeTime = (
  date: DateInput,
  baseDate?: DateInput,
  timezone: Timezone = DEFAULT_TIMEZONE
): string => {
  let dateObj = dayjs(date);
  let base = baseDate ? dayjs(baseDate) : dayjs();

  const tz = getTimezoneValue(timezone);
  dateObj = dateObj.tz(tz);
  base = base.tz(tz);

  return dateObj.from(base);
};

/**
 * Get time until a specific date
 */
export const getTimeUntil = (
  date: DateInput,
  baseDate?: DateInput,
  timezone: Timezone = DEFAULT_TIMEZONE
): string => {
  let dateObj = dayjs(date);
  let base = baseDate ? dayjs(baseDate) : dayjs();

  const tz = getTimezoneValue(timezone);
  dateObj = dateObj.tz(tz);
  base = base.tz(tz);

  return dateObj.to(base);
};

/**
 * Check if date is today
 */
export const checkIsToday = (
  date: DateInput,
  timezone: Timezone = DEFAULT_TIMEZONE
): boolean => {
  let dateObj = dayjs(date);

  const tz = getTimezoneValue(timezone);
  dateObj = dateObj.tz(tz);

  return dateObj.isToday();
};

/**
 * Check if date is yesterday
 */
export const checkIsYesterday = (
  date: DateInput,
  timezone: Timezone = DEFAULT_TIMEZONE
): boolean => {
  let dateObj = dayjs(date);

  dateObj = dateObj.tz(getTimezoneValue(timezone));

  return dateObj.isYesterday();
};

/**
 * Check if date is tomorrow
 */
export const checkIsTomorrow = (
  date: DateInput,
  timezone: Timezone = DEFAULT_TIMEZONE
): boolean => {
  let dateObj = dayjs(date);

  dateObj = dateObj.tz(getTimezoneValue(timezone));

  return dateObj.isTomorrow();
};

/**
 * Check if date is in the past
 */
export const isPast = (
  date: DateInput,
  baseDate?: DateInput,
  timezone: Timezone = DEFAULT_TIMEZONE
): boolean => {
  let dateObj = dayjs(date);
  let base = baseDate ? dayjs(baseDate) : dayjs();

  const tz = getTimezoneValue(timezone);
  dateObj = dateObj.tz(tz);
  base = base.tz(tz);

  return dateObj.isBefore(base);
};

/**
 * Check if date is in the future
 */
export const isFuture = (
  date: DateInput,
  baseDate?: DateInput,
  timezone: Timezone = DEFAULT_TIMEZONE
): boolean => {
  let dateObj = dayjs(date);
  let base = baseDate ? dayjs(baseDate) : dayjs();

  const tz = getTimezoneValue(timezone);
  dateObj = dateObj.tz(tz);
  base = base.tz(tz);

  return dateObj.isAfter(base);
};

/**
 * Check if two dates are the same day
 */
export const isSameDay = (
  date1: DateInput,
  date2: DateInput,
  timezone: Timezone = DEFAULT_TIMEZONE
): boolean => {
  let d1 = dayjs(date1);
  let d2 = dayjs(date2);

  const tz = getTimezoneValue(timezone);
  d1 = d1.tz(tz);
  d2 = d2.tz(tz);

  return d1.isSame(d2, "day");
};

/**
 * Get start of day/week/month/year
 */
export const startOf = (
  date: DateInput,
  unit: "day" | "week" | "month" | "year" = "day",
  timezone: Timezone = DEFAULT_TIMEZONE
): Dayjs => {
  let dateObj = dayjs(date);

  dateObj = dateObj.tz(getTimezoneValue(timezone));

  return dateObj.startOf(unit);
};

/**
 * Get end of day/week/month/year
 */
export const endOf = (
  date: DateInput,
  unit: "day" | "week" | "month" | "year" = "day",
  timezone: Timezone = DEFAULT_TIMEZONE
): Dayjs => {
  let dateObj = dayjs(date);

  dateObj = dateObj.tz(getTimezoneValue(timezone));

  return dateObj.endOf(unit);
};

/**
 * Add time to date
 */
export const addTime = (
  date: DateInput,
  amount: number,
  unit: dayjs.ManipulateType,
  timezone: Timezone = DEFAULT_TIMEZONE
): Dayjs => {
  let dateObj = dayjs(date);

  dateObj = dateObj.tz(getTimezoneValue(timezone));

  return dateObj.add(amount, unit);
};

/**
 * Subtract time from date
 */
export const subtractTime = (
  date: DateInput,
  amount: number,
  unit: dayjs.ManipulateType,
  timezone: Timezone = DEFAULT_TIMEZONE
): Dayjs => {
  let dateObj = dayjs(date);

  dateObj = dateObj.tz(getTimezoneValue(timezone));

  return dateObj.subtract(amount, unit);
};

/**
 * Get difference between two dates
 */
export const getDifference = (
  date1: DateInput,
  date2: DateInput,
  unit: dayjs.QUnitType = "millisecond",
  precise = false
): number => {
  return dayjs(date1).diff(dayjs(date2), unit, precise);
};

/**
 * Create duration from amount and unit
 */
export const createDuration = (
  amount: number,
  unit: duration.DurationUnitType
) => {
  return dayjs.duration(amount, unit);
};

/**
 * Format duration to human readable string
 */
export const formatDuration = (
  amount: number,
  unit: duration.DurationUnitType,
  format?: string
): string => {
  const duration = dayjs.duration(amount, unit);
  return format ? duration.format(format) : duration.humanize();
};

/**
 * Get age from birthdate
 */
export const getAge = (
  birthdate: DateInput,
  referenceDate?: DateInput,
  timezone: Timezone = DEFAULT_TIMEZONE
): number => {
  let birth = dayjs(birthdate);
  let reference = referenceDate ? dayjs(referenceDate) : dayjs();

  const tz = getTimezoneValue(timezone);
  birth = birth.tz(tz);
  reference = reference.tz(tz);

  return reference.diff(birth, "year");
};

/**
 * Get business days between two dates (excluding weekends)
 */
export const getBusinessDays = (
  startDate: DateInput,
  endDate: DateInput,
  timezone: Timezone = DEFAULT_TIMEZONE
): number => {
  let start = dayjs(startDate);
  let end = dayjs(endDate);

  const tz = getTimezoneValue(timezone);
  start = start.tz(tz);
  end = end.tz(tz);

  let days = 0;
  let current = start;

  while (current.isBefore(end) || current.isSame(end, "day")) {
    if (current.day() !== 0 && current.day() !== 6) {
      // Not Sunday (0) or Saturday (6)
      days++;
    }
    current = current.add(1, "day");
  }

  return days;
};

/**
 * Check if date is weekend
 */
export const isWeekend = (
  date: DateInput,
  timezone: Timezone = DEFAULT_TIMEZONE
): boolean => {
  let dateObj = dayjs(date);

  dateObj = dateObj.tz(getTimezoneValue(timezone));

  const day = dateObj.day();
  return day === 0 || day === 6; // Sunday or Saturday
};

/**
 * Check if date is weekday
 */
export const isWeekday = (
  date: DateInput,
  timezone: Timezone = DEFAULT_TIMEZONE
): boolean => {
  return !isWeekend(date, timezone);
};

/**
 * Get timezone offset in minutes
 */
export const getTimezoneOffset = (
  date: DateInput,
  timezone: Timezone
): number => {
  const dateObj = dayjs(date).tz(getTimezoneValue(timezone));
  return dateObj.utcOffset();
};

/**
 * Get timezone abbreviation
 */
export const getTimezoneAbbr = (
  date: DateInput,
  timezone: Timezone
): string => {
  const dateObj = dayjs(date).tz(getTimezoneValue(timezone));
  return dateObj.format("z");
};

// Helper functions
function getTimezoneValue(timezone: Timezone): string {
  return timezone in TIMEZONES
    ? TIMEZONES[timezone as keyof typeof TIMEZONES]
    : timezone;
}

function getFormatValue(format: DateFormat): string {
  return format in DATE_FORMATS
    ? DATE_FORMATS[format as keyof typeof DATE_FORMATS]
    : format;
}

// Export dayjs instance for advanced usage
export { dayjs };
export default dayjs;

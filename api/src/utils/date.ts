import { DateTime } from 'luxon';

/**
 * Format date to ISO string
 * @param date Date to format
 * @returns ISO string
 */
export const toISOString = (date: Date | DateTime): string => {
  const luxonDate = DateTime.isDateTime(date)
    ? date
    : DateTime.fromJSDate(date);
  return luxonDate.toISO() || '';
};

/**
 * Format date to custom format string
 * @param date Date to format
 * @param format Format string (e.g. 'yyyy-MM-dd HH:mm:ss')
 * @returns Formatted string
 */
export const formatDate = (date: Date | DateTime, format: string): string => {
  const luxonDate = DateTime.isDateTime(date)
    ? date
    : DateTime.fromJSDate(date);
  return luxonDate.toFormat(format);
};

/**
 * Convert string to DateTime
 * @param dateString Date string to parse
 * @param format Format of the input string (e.g. 'yyyy-MM-dd HH:mm:ss')
 * @returns DateTime object
 */
export const parseDate = (dateString: string, format: string): DateTime => {
  return DateTime.fromFormat(dateString, format);
};

/**
 * Get current date in specific timezone
 * @param timezone Timezone (e.g. 'Asia/Ho_Chi_Minh')
 * @returns DateTime object
 */
export const getCurrentDate = (
  timezone: string = 'Asia/Ho_Chi_Minh',
): DateTime => {
  return DateTime.now().setZone(timezone);
};

/**
 * Add days to a date
 * @param date Date to add days to
 * @param days Number of days to add
 * @returns DateTime object
 */
export const addDays = (date: Date | DateTime, days: number): DateTime => {
  const luxonDate = DateTime.isDateTime(date)
    ? date
    : DateTime.fromJSDate(date);
  return luxonDate.plus({ days });
};

/**
 * Subtract days from a date
 * @param date Date to subtract days from
 * @param days Number of days to subtract
 * @returns DateTime object
 */
export const subtractDays = (date: Date | DateTime, days: number): DateTime => {
  const luxonDate = DateTime.isDateTime(date)
    ? date
    : DateTime.fromJSDate(date);
  return luxonDate.minus({ days });
};

/**
 * Get start of day
 * @param date Date to get start of day for
 * @returns DateTime object
 */
export const startOfDay = (date: Date | DateTime): DateTime => {
  const luxonDate = DateTime.isDateTime(date)
    ? date
    : DateTime.fromJSDate(date);
  return luxonDate.startOf('day');
};

/**
 * Get end of day
 * @param date Date to get end of day for
 * @returns DateTime object
 */
export const endOfDay = (date: Date | DateTime): DateTime => {
  const luxonDate = DateTime.isDateTime(date)
    ? date
    : DateTime.fromJSDate(date);
  return luxonDate.endOf('day');
};

/**
 * Check if date is today
 * @param date Date to check
 * @returns boolean
 */
export const isToday = (date: Date | DateTime): boolean => {
  const luxonDate = DateTime.isDateTime(date)
    ? date
    : DateTime.fromJSDate(date);
  return luxonDate.hasSame(DateTime.now(), 'day');
};

/**
 * Check if date is in the past
 * @param date Date to check
 * @returns boolean
 */
export const isPast = (date: Date | DateTime): boolean => {
  const luxonDate = DateTime.isDateTime(date)
    ? date
    : DateTime.fromJSDate(date);
  return luxonDate < DateTime.now();
};

/**
 * Check if date is in the future
 * @param date Date to check
 * @returns boolean
 */
export const isFuture = (date: Date | DateTime): boolean => {
  const luxonDate = DateTime.isDateTime(date)
    ? date
    : DateTime.fromJSDate(date);
  return luxonDate > DateTime.now();
};

/**
 * Get difference between two dates in days
 * @param date1 First date
 * @param date2 Second date
 * @returns number of days
 */
export const getDaysDifference = (
  date1: Date | DateTime,
  date2: Date | DateTime,
): number => {
  const luxonDate1 = DateTime.isDateTime(date1)
    ? date1
    : DateTime.fromJSDate(date1);
  const luxonDate2 = DateTime.isDateTime(date2)
    ? date2
    : DateTime.fromJSDate(date2);
  return luxonDate2.diff(luxonDate1, 'days').days;
};

/**
 * Convert date to Unix timestamp (seconds)
 * @param date Date to convert
 * @returns Unix timestamp
 */
export const toUnixTimestamp = (date: Date | DateTime): number => {
  const luxonDate = DateTime.isDateTime(date)
    ? date
    : DateTime.fromJSDate(date);
  return luxonDate.toUnixInteger();
};

/**
 * Convert Unix timestamp to DateTime
 * @param timestamp Unix timestamp in seconds
 * @returns DateTime object
 */
export const fromUnixTimestamp = (timestamp: number): DateTime => {
  return DateTime.fromSeconds(timestamp);
};

/**
 * Get human readable time difference (e.g. "2 hours ago")
 * @param date Date to get difference for
 * @returns Human readable string
 */
export const getHumanReadableTimeDifference = (
  date: Date | DateTime,
): string => {
  const luxonDate = DateTime.isDateTime(date)
    ? date
    : DateTime.fromJSDate(date);
  return luxonDate.toRelative() || '';
};

/**
 * Get current date
 * @returns DateTime object
 */
export const getNow = (): DateTime => {
  return DateTime.now();
};

/**
 * Get current date in UTC
 * @returns DateTime object
 */
export const getNowInUTC = (): DateTime => {
  return DateTime.now().setZone('UTC');
};

/**
 * Add minutes to a date
 * @param date Date to add minutes to
 * @param minutes Number of minutes to add
 * @returns DateTime object
 */
export const addMinutes = (
  date: Date | DateTime,
  minutes: number,
): DateTime => {
  const luxonDate = DateTime.isDateTime(date)
    ? date
    : DateTime.fromJSDate(date);
  return luxonDate.plus({ minutes });
};

/**
 * Add hours to a date
 * @param date Date to add hours to
 * @param hours Number of hours to add
 * @returns DateTime object
 */
export const addHours = (date: Date | DateTime, hours: number): DateTime => {
  const luxonDate = DateTime.isDateTime(date)
    ? date
    : DateTime.fromJSDate(date);
  return luxonDate.plus({ hours });
};

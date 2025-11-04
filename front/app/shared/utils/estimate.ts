/**
 * Parse estimate string to hours
 * Supports formats: 3.5, 3.5h, 2d 1h, 3w 2d 1h
 *
 * @param estimate - Estimate string (e.g., "3.5", "3.5h", "2d 1h", "3w 2d 1h")
 * @returns Number of hours or null if invalid
 */
export function parseEstimateToHours(
  estimate: string | number | undefined
): number | null {
  if (!estimate) return null;

  // If already a number, return it
  if (typeof estimate === "number") {
    return estimate >= 0 ? estimate : null;
  }

  const trimmed = estimate.trim();
  if (!trimmed) return null;

  // Try to parse as simple number first (e.g., "3.5")
  const simpleNumber = parseFloat(trimmed);
  if (!isNaN(simpleNumber) && trimmed === String(simpleNumber)) {
    return simpleNumber >= 0 ? simpleNumber : null;
  }

  // Parse with units: w (weeks), d (days), h (hours)
  // 1 week = 5 working days = 40 hours
  // 1 day = 8 working hours
  const weekPattern = /(\d+(?:\.\d+)?)\s*w/gi;
  const dayPattern = /(\d+(?:\.\d+)?)\s*d/gi;
  const hourPattern = /(\d+(?:\.\d+)?)\s*h/gi;
  const numberPattern = /(\d+(?:\.\d+)?)/g;

  let totalHours = 0;
  let hasUnit = false;

  // Extract weeks
  const weekMatches = trimmed.match(weekPattern);
  if (weekMatches) {
    hasUnit = true;
    weekMatches.forEach(match => {
      const value = parseFloat(match.replace(/w/gi, ""));
      if (!isNaN(value)) {
        totalHours += value * 40; // 1 week = 40 working hours
      }
    });
  }

  // Extract days
  const dayMatches = trimmed.match(dayPattern);
  if (dayMatches) {
    hasUnit = true;
    dayMatches.forEach(match => {
      const value = parseFloat(match.replace(/d/gi, ""));
      if (!isNaN(value)) {
        totalHours += value * 8; // 1 day = 8 working hours
      }
    });
  }

  // Extract hours
  const hourMatches = trimmed.match(hourPattern);
  if (hourMatches) {
    hasUnit = true;
    hourMatches.forEach(match => {
      const value = parseFloat(match.replace(/h/gi, ""));
      if (!isNaN(value)) {
        totalHours += value;
      }
    });
  }

  // If no units found but has numbers, treat as hours
  if (!hasUnit) {
    const numbers = trimmed.match(numberPattern);
    if (numbers && numbers.length === 1) {
      const value = parseFloat(numbers[0]);
      if (!isNaN(value)) {
        return value >= 0 ? value : null;
      }
    }
  }

  // If we have units but total is 0, invalid input
  if (hasUnit && totalHours === 0) {
    return null;
  }

  return totalHours >= 0 ? totalHours : null;
}

/**
 * Format hours to readable estimate string
 * @param hours - Number of hours
 * @returns Formatted string (e.g., "3w 2d 1h", "2d 1h", "3.5h")
 */
export function formatHoursToEstimate(hours: number): string {
  if (!hours || hours <= 0) return "";

  const weeks = Math.floor(hours / 40);
  const remainingAfterWeeks = hours % 40;
  const days = Math.floor(remainingAfterWeeks / 8);
  const remainingHours = remainingAfterWeeks % 8;

  const parts: string[] = [];
  if (weeks > 0) parts.push(`${weeks}w`);
  if (days > 0) parts.push(`${days}d`);
  if (remainingHours > 0) {
    // Show decimal if needed
    const hoursStr =
      remainingHours % 1 === 0
        ? String(remainingHours)
        : remainingHours.toFixed(1);
    parts.push(`${hoursStr}h`);
  }

  return parts.length > 0 ? parts.join(" ") : `${hours}h`;
}

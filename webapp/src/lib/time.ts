/**
 * Time utility functions for the marketplace
 * Provides helpers for time conversion, formatting, and calculations
 */

/**
 * Converts milliseconds to seconds (floor)
 * @param timeInMilliseconds - Time in milliseconds
 * @returns Time in seconds
 */
export function fromMillisecondsToSeconds(timeInMilliseconds: number): number {
  return Math.floor(timeInMilliseconds / 1000)
}

/**
 * Converts seconds to milliseconds
 * @param timeInSeconds - Time in seconds
 * @returns Time in milliseconds
 */
export function fromSecondsToMilliseconds(timeInSeconds: number): number {
  return timeInSeconds * 1000
}

/**
 * Checks if a timestamp (in milliseconds) has expired
 * @param expirationTime - Expiration timestamp in milliseconds
 * @param currentTime - Current timestamp (defaults to Date.now())
 * @returns True if expired
 */
export function isExpired(expirationTime: number, currentTime: number = Date.now()): boolean {
  return currentTime >= expirationTime
}

/**
 * Checks if a timestamp (in seconds) has expired
 * @param expirationTimeSeconds - Expiration timestamp in seconds
 * @param currentTime - Current timestamp in milliseconds (defaults to Date.now())
 * @returns True if expired
 */
export function isExpiredSeconds(expirationTimeSeconds: number, currentTime: number = Date.now()): boolean {
  return currentTime >= fromSecondsToMilliseconds(expirationTimeSeconds)
}

/**
 * Calculates the time remaining until expiration
 * @param expirationTime - Expiration timestamp in milliseconds
 * @param currentTime - Current timestamp (defaults to Date.now())
 * @returns Time remaining in milliseconds (0 if expired)
 */
export function getTimeRemaining(expirationTime: number, currentTime: number = Date.now()): number {
  const remaining = expirationTime - currentTime
  return remaining > 0 ? remaining : 0
}

/**
 * Formats time remaining as a human-readable string
 * @param milliseconds - Time in milliseconds
 * @returns Formatted string (e.g., "2d 5h", "3h 30m", "45m")
 */
export function formatTimeRemaining(milliseconds: number): string {
  if (milliseconds <= 0) {
    return 'Expired'
  }

  const seconds = Math.floor(milliseconds / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 0) {
    const remainingHours = hours % 24
    return remainingHours > 0 ? `${days}d ${remainingHours}h` : `${days}d`
  }

  if (hours > 0) {
    const remainingMinutes = minutes % 60
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`
  }

  if (minutes > 0) {
    return `${minutes}m`
  }

  return `${seconds}s`
}

/**
 * Time duration constants in milliseconds
 */
export const DURATION = {
  SECOND: 1000,
  MINUTE: 60 * 1000,
  HOUR: 60 * 60 * 1000,
  DAY: 24 * 60 * 60 * 1000,
  WEEK: 7 * 24 * 60 * 60 * 1000,
  MONTH: 30 * 24 * 60 * 60 * 1000, // Approximate
  YEAR: 365 * 24 * 60 * 60 * 1000 // Approximate
} as const

/**
 * Adds days to a timestamp
 * @param timestamp - Base timestamp in milliseconds
 * @param days - Number of days to add
 * @returns New timestamp in milliseconds
 */
export function addDaysToTimestamp(timestamp: number, days: number): number {
  return timestamp + days * DURATION.DAY
}

/**
 * Gets the start of the day for a given timestamp
 * @param timestamp - Timestamp in milliseconds
 * @returns Timestamp at start of day (00:00:00)
 */
export function getStartOfDay(timestamp: number = Date.now()): number {
  const date = new Date(timestamp)
  date.setHours(0, 0, 0, 0)
  return date.getTime()
}

/**
 * Gets the end of the day for a given timestamp
 * @param timestamp - Timestamp in milliseconds
 * @returns Timestamp at end of day (23:59:59.999)
 */
export function getEndOfDay(timestamp: number = Date.now()): number {
  const date = new Date(timestamp)
  date.setHours(23, 59, 59, 999)
  return date.getTime()
}

/**
 * Calculates the number of days between two timestamps
 * @param start - Start timestamp in milliseconds
 * @param end - End timestamp in milliseconds
 * @returns Number of days (can be fractional)
 */
export function daysBetween(start: number, end: number): number {
  return Math.abs(end - start) / DURATION.DAY
}

/**
 * Checks if a timestamp is within the last N days
 * @param timestamp - Timestamp to check in milliseconds
 * @param days - Number of days
 * @param now - Current timestamp (defaults to Date.now())
 * @returns True if within the last N days
 */
export function isWithinLastDays(timestamp: number, days: number, now: number = Date.now()): boolean {
  const cutoff = now - days * DURATION.DAY
  return timestamp >= cutoff
}

/**
 * Formats a timestamp as a relative time string
 * @param timestamp - Timestamp in milliseconds
 * @param now - Current timestamp (defaults to Date.now())
 * @returns Relative time string (e.g., "2 hours ago", "in 3 days")
 */
export function formatRelativeTime(timestamp: number, now: number = Date.now()): string {
  const diff = timestamp - now
  const absDiff = Math.abs(diff)
  const isPast = diff < 0

  const suffix = isPast ? 'ago' : ''
  const prefix = isPast ? '' : 'in '

  if (absDiff < DURATION.MINUTE) {
    return isPast ? 'just now' : 'in a moment'
  }

  if (absDiff < DURATION.HOUR) {
    const minutes = Math.floor(absDiff / DURATION.MINUTE)
    return `${prefix}${minutes} minute${minutes !== 1 ? 's' : ''} ${suffix}`.trim()
  }

  if (absDiff < DURATION.DAY) {
    const hours = Math.floor(absDiff / DURATION.HOUR)
    return `${prefix}${hours} hour${hours !== 1 ? 's' : ''} ${suffix}`.trim()
  }

  if (absDiff < DURATION.WEEK) {
    const days = Math.floor(absDiff / DURATION.DAY)
    return `${prefix}${days} day${days !== 1 ? 's' : ''} ${suffix}`.trim()
  }

  if (absDiff < DURATION.MONTH) {
    const weeks = Math.floor(absDiff / DURATION.WEEK)
    return `${prefix}${weeks} week${weeks !== 1 ? 's' : ''} ${suffix}`.trim()
  }

  const months = Math.floor(absDiff / DURATION.MONTH)
  return `${prefix}${months} month${months !== 1 ? 's' : ''} ${suffix}`.trim()
}

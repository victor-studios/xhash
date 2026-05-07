/**
 * Returns a human-readable "time ago" string from a date string.
 */
export function timeAgo(dateStr: string): string {
  const seconds = Math.floor((new Date().getTime() - new Date(dateStr).getTime()) / 1000);
  let interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + ' days ago';
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + ' hrs ago';
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + ' mins ago';
  return Math.floor(seconds) + ' secs ago';
}

/**
 * Formats a number as USD currency with 2 decimal places.
 */
export function formatUsd(amount: number): string {
  return `$${amount.toFixed(2)}`;
}

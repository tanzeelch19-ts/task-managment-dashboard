// Dates are stored as plain "YYYY-MM-DD" strings (what <input type="date"> uses).
// Working with strings avoids the classic "one day off" time-zone bugs that
// happen when a date-only value is parsed as UTC.

const pad = (n) => String(n).padStart(2, '0');

/** Convert a Date object to a local "YYYY-MM-DD" string. */
export function toISODate(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/** Today's date as "YYYY-MM-DD" (local time zone). */
export function todayISO() {
  return toISODate(new Date());
}

/** "YYYY-MM-DD" for a day `days` away from today (negative = past). */
export function daysFromNow(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return toISODate(d);
}

/** Full ISO timestamp for `days` days from now at a given hour (used for seed data). */
export function timestampFromNow(days, hour = 10) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  d.setHours(hour, 0, 0, 0);
  return d.toISOString();
}

/** True only for real calendar dates in "YYYY-MM-DD" format (rejects 2026-02-31). */
export function isValidISODate(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [y, m, d] = value.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  return date.getFullYear() === y && date.getMonth() === m - 1 && date.getDate() === d;
}

/** "2026-11-05" -> "5 Nov 2026". Returns "—" for empty/invalid values. */
export function formatDate(value) {
  if (!isValidISODate(value)) return '—';
  const [y, m, d] = value.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

/** Full timestamp -> "5 Nov 2026, 3:30 pm". */
export function formatDateTime(value) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

/** Whole days from today until the given date (negative when in the past). */
export function daysUntil(value) {
  if (!isValidISODate(value)) return null;
  const [y, m, d] = value.split('-').map(Number);
  const target = new Date(y, m - 1, d);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round((target - today) / 86400000);
}
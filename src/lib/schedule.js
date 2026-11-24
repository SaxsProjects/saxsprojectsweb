// Consultation slot helpers. South Africa (SAST) is UTC+2 all year with no
// daylight saving, so we shift "now" by two hours and read UTC fields; this
// gives SAST dates/times no matter where the visitor's device is.

const SAST_OFFSET_MS = 2 * 60 * 60 * 1000;
const MIN_NOTICE_MS = 2 * 60 * 60 * 1000; // need at least 2 hours' notice

export const CONSULT_SLOTS = ['09:30', '10:30', '11:30', '12:30', '13:30', '14:30', '15:30', '16:30'];

const pad = (n) => String(n).padStart(2, '0');

const sastNow = () => new Date(Date.now() + SAST_OFFSET_MS);

function slotInstant(isoDate, time) {
  return new Date(`${isoDate}T${time}:00+02:00`);
}

export function isSlotOpen(isoDate, time) {
  return slotInstant(isoDate, time).getTime() - Date.now() >= MIN_NOTICE_MS;
}

// Next `count` weekdays (Mon–Fri) that still have at least one open slot.
export function upcomingBusinessDays(count = 5) {
  const now = sastNow();
  const cursor = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const days = [];

  while (days.length < count) {
    const dow = cursor.getUTCDay();
    if (dow !== 0 && dow !== 6) {
      const iso = `${cursor.getUTCFullYear()}-${pad(cursor.getUTCMonth() + 1)}-${pad(cursor.getUTCDate())}`;
      if (CONSULT_SLOTS.some((t) => isSlotOpen(iso, t))) {
        days.push({
          iso,
          short: cursor.toLocaleDateString('en-ZA', { timeZone: 'UTC', weekday: 'short' }),
          dayMonth: cursor.toLocaleDateString('en-ZA', { timeZone: 'UTC', day: 'numeric', month: 'short' }),
          long: cursor.toLocaleDateString('en-ZA', { timeZone: 'UTC', weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }),
        });
      }
    }
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }
  return days;
}

// ISO 8601 with the SAST offset, e.g. 2026-11-25T10:30:00+02:00 (the backend parses this).
export const slotDateTimeString = (isoDate, time) => `${isoDate}T${time}:00+02:00`;

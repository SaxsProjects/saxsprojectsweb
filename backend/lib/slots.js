// Consultation slots, in South African Standard Time (UTC+2, no daylight saving).
export const CONSULT_SLOTS = ['09:30', '10:30', '11:30', '12:30', '13:30', '14:30', '15:30', '16:30'];
export const CONSULT_MINUTES = 15;
export const MIN_NOTICE_MS = 2 * 60 * 60 * 1000;
export const MAX_DAYS_AHEAD = 60;

const ISO_WITH_SAST = /^(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2})(?::00)?(?:\.000)?\+02:00$/;

// Accepts "2026-11-25T10:30:00+02:00" (what the website sends).
// Returns { date, time, startsAt, endsAt } or { error }.
export function parseSlot(value, now = new Date()) {
  const match = ISO_WITH_SAST.exec(String(value || '').trim());
  if (!match) return { error: 'Choose a day and time from the booking calendar.' };
  const [, date, time] = match;
  if (!CONSULT_SLOTS.includes(time)) return { error: 'That time is not one of our consultation slots.' };
  const startsAt = new Date(`${date}T${time}:00+02:00`);
  if (Number.isNaN(startsAt.getTime())) return { error: 'That date is not valid.' };
  const sastDay = new Date(startsAt.getTime() + 2 * 3600 * 1000).getUTCDay();
  if (sastDay === 0 || sastDay === 6) return { error: 'Consultations are Monday to Friday.' };
  if (startsAt.getTime() - now.getTime() < MIN_NOTICE_MS) return { error: 'Please choose a time at least 2 hours from now.' };
  if (startsAt.getTime() - now.getTime() > MAX_DAYS_AHEAD * 86400000) return { error: `Please choose a time within the next ${MAX_DAYS_AHEAD} days.` };
  return { date, time, startsAt, endsAt: new Date(startsAt.getTime() + CONSULT_MINUTES * 60000) };
}

export const isIsoDate = (value) => /^\d{4}-\d{2}-\d{2}$/.test(String(value || ''));

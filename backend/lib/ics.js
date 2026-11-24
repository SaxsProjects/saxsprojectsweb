// Minimal RFC 5545 calendar invite, so a booking lands in any calendar app
// (Google, Outlook, Apple) without needing Google Calendar API access.
const stamp = (d) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
const escape = (s) => String(s ?? '').replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n');

export function buildIcs({ uid, startsAt, endsAt, summary, description, organizerEmail, organizerName, attendeeEmail, location }) {
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//SaxsProjects//Consultations//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:REQUEST',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${stamp(new Date())}`,
    `DTSTART:${stamp(startsAt)}`,
    `DTEND:${stamp(endsAt)}`,
    `SUMMARY:${escape(summary)}`,
    `DESCRIPTION:${escape(description)}`,
    location ? `LOCATION:${escape(location)}` : null,
    organizerEmail ? `ORGANIZER;CN=${escape(organizerName || organizerEmail)}:mailto:${organizerEmail}` : null,
    attendeeEmail ? `ATTENDEE;RSVP=TRUE;ROLE=REQ-PARTICIPANT:mailto:${attendeeEmail}` : null,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR',
  ].filter(Boolean);
  return lines.join('\r\n') + '\r\n';
}

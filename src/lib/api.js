// Backend connection.
//
// Set VITE_API_URL (e.g. https://api.saxsprojects.co.za) in your hosting
// provider's environment variables to use the Node/Express backend in
// backend/. When it is not set, the site still works: forms hand the visitor
// over to WhatsApp or email instead, so no lead is ever lost.

const origin = (import.meta.env.VITE_API_URL || '').trim().replace(/\/+$/, '');

export const hasBackend = origin.length > 0;

// Base for the existing `${API_BASE_URL}/...` calls (routes live under /api).
export const API_BASE_URL = hasBackend ? `${origin}/api` : '';

export async function postJSON(path, body, { timeoutMs = 15000 } = {}) {
  if (!hasBackend) throw new Error('No backend configured');

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(`${API_BASE_URL}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    let data = null;
    try {
      data = await res.json();
    } catch {
      data = null;
    }
    if (!res.ok) {
      const err = new Error((data && data.error) || `Request failed (${res.status})`);
      err.status = res.status;
      err.data = data;
      throw err;
    }
    return data;
  } finally {
    clearTimeout(timer);
  }
}

// Enquiries go to the SaxsProjects Team Hub, where the founder follows them up. Set VITE_HUB_URL to change the
// address, or to an empty value to switch this off (the form then hands visitors over to WhatsApp or email).
const hubSetting = import.meta.env.VITE_HUB_URL;
const HUB_URL = (hubSetting === undefined ? 'https://api.saxsprojects.co.za' : hubSetting).trim().replace(/\/+$/, '');

const quoteLine = (q) => (q ? `Calculator estimate: ${q.pages} — ${q.price} (${q.timeline})` : '');

export const canSendEnquiry =hasBackend || HUB_URL.length > 0;

/** Send a contact-form enquiry. Sent as text/plain so the browser needs no CORS preflight and sends no cookies. */
export async function sendEnquiry(enquiry, { timeoutMs = 15000 } = {}) {
  if (hasBackend) return postJSON('/inquiries', enquiry);
  if (!HUB_URL) throw new Error('No enquiry inbox configured');
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(`${HUB_URL}/api/public/enquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      credentials: 'omit',
      body: JSON.stringify({
        name: enquiry.name,
        email: enquiry.email || null,
        phone: enquiry.phone || null,
        organisation: enquiry.bizName || null,
        service: enquiry.service || null,
        message: [quoteLine(enquiry.activeQuote), enquiry.details].filter(Boolean).join('\n\n'),
        website: enquiry.website || null,
      }),
      signal: controller.signal,
    });
    if (!res.ok) throw new Error(`Request failed (${res.status})`);
    return res.json().catch(() => ({}));
  } finally {
    clearTimeout(timer);
  }
}

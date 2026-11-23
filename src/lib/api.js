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

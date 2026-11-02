// Thin wrapper around fetch() used when a real REST backend is configured.
//
// Set VITE_API_BASE_URL in a .env file (see .env.example) to turn it on.
// When it is empty the app stores everything in localStorage instead.

const BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');

/** True when a backend URL is configured. */
export const USE_API = BASE_URL !== '';

/**
 * Send a JSON request and return the parsed response.
 * Throws an Error with a readable message when the request fails, so the UI
 * can show it in an error banner.
 */
export async function request(path, { method = 'GET', body } = {}) {
  let response;
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      method,
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error('Cannot reach the server. Check your connection and try again.');
  }

  if (!response.ok) {
    let detail = '';
    try {
      const data = await response.json();
      detail = data.detail || data.message || '';
    } catch {
      // response had no JSON body
    }
    throw new Error(detail || `Request failed (${response.status} ${response.statusText}).`);
  }

  // DELETE usually returns 204 No Content.
  if (response.status === 204) return null;
  return response.json();
}
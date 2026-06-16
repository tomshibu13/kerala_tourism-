// Kerala Tourism API client
const API_BASE = '/api';

async function fetchJSON(url, options = {}) {
  const token = localStorage.getItem('userToken');
  const headers = { 'Content-Type': 'application/json' };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${url}`, {
    headers,
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message || 'API request failed');
  }
  return res.json();
}

// ─── Auth ───────────────────────────────────────────────────────
export async function loginUser(data) {
  return fetchJSON('/auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function registerUser(data) {
  return fetchJSON('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function getProfile() {
  return fetchJSON('/auth/profile');
}

// ─── Destinations ───────────────────────────────────────────────
export async function getDestinations(category, search) {
  const params = new URLSearchParams();
  if (category && category !== 'all') params.set('category', category);
  if (search) params.set('search', search);
  const qs = params.toString();
  return fetchJSON(`/destinations${qs ? `?${qs}` : ''}`);
}

export async function getDestination(id) {
  return fetchJSON(`/destinations/${id}`);
}

// ─── Districts ──────────────────────────────────────────────────
export async function getDistricts() {
  return fetchJSON('/districts');
}

export async function getDistrict(id) {
  return fetchJSON(`/districts/${id}`);
}

// ─── Reviews ────────────────────────────────────────────────────
export async function getReviews(destinationId) {
  return fetchJSON(`/reviews/${destinationId}`);
}

export async function postReview(data) {
  return fetchJSON('/reviews', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// ─── Trips ──────────────────────────────────────────────────────
export async function saveTrip(data) {
  return fetchJSON('/trips', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function getTrip(id) {
  return fetchJSON(`/trips/${id}`);
}

// ─── Stats ──────────────────────────────────────────────────────
export async function getStats() {
  return fetchJSON('/stats');
}

const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

function getToken(): string {
  if (typeof document === 'undefined') return '';
  const match = document.cookie.match(/token=([^;]+)/);
  return match ? match[1] : '';
}

function authHeaders(): HeadersInit {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export function saveToken(token: string) {
  document.cookie = `token=${token}; path=/; max-age=86400`;
}

export function clearToken() {
  document.cookie = 'token=; path=/; max-age=0';
}

export async function signup(email: string, password: string) {
  const res = await fetch(`${BASE}/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Signup failed');
  return data;
}

export async function login(email: string, password: string) {
  const res = await fetch(`${BASE}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Login failed');
  const token = data.token || data.access_token;
  if (token) saveToken(token);
  return data;
}

export async function createTrip(trip: {
  lodging_location: string;
  trip_description: string;
  arrival_date: string;
  departure_date: string;
  status: string;
}) {
  const res = await fetch(`${BASE}/trip`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(trip),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to create trip');
  return data;
}

export async function getTripById(id: string) {
  const res = await fetch(`${BASE}/get_trip_by_id/${id}`, { headers: authHeaders() });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Trip not found');
  return data;
}

export async function addReview(id: string, review: string) {
  const res = await fetch(`${BASE}/add_trip_review/${id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify({ trip_review: review }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to add review');
  return data;
}

export async function deleteTrip(id: string) {
  const res = await fetch(`${BASE}/delete_trip/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to delete trip');
  return data;
}

export async function getAllTrips() {
  const res = await fetch(`${BASE}/admin/get_all_trips`, { headers: authHeaders() });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Unauthorized');
  return data;
}

export async function getAllLogs() {
  const res = await fetch(`${BASE}/admin/get_all_logs`, { headers: authHeaders() });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Unauthorized');
  return data;
}

export async function getRoteiros(params?: { search?: string; category?: string; location?: string }) {
  const query = new URLSearchParams();
  if (params?.search) query.set('search', params.search);
  if (params?.category) query.set('category', params.category);
  if (params?.location) query.set('location', params.location);
  const qs = query.toString();
  const res = await fetch(`${BASE}/roteiros${qs ? `?${qs}` : ''}`, { headers: authHeaders() });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to fetch roteiros');
  return data;
}

export async function getRecommendations() {
  const res = await fetch(`${BASE}/tourist/recommendations`, { headers: authHeaders() });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to fetch recommendations');
  return data;
}

export async function getRoteiroById(id: string) {
  const res = await fetch(`${BASE}/get_roteiro_by_id/${id}`, { headers: authHeaders() });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Roteiro not found');
  return data;
}

export async function createRoteiro(roteiro: {
  name: string;
  category: string;
  description: string;
  location: string;
  rating?: number;
  latitude?: number;
  longitude?: number;
}) {
  const res = await fetch(`${BASE}/roteiro`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(roteiro),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to create roteiro');
  return data;
}

export async function getRoteiroReviews(id: string) {
  const res = await fetch(`${BASE}/roteiro/${id}/reviews`, { headers: authHeaders() });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to fetch reviews');
  return data;
}

export async function createRoteiroReview(id: string, review: { rating: number; comment: string }) {
  const res = await fetch(`${BASE}/roteiro/${id}/review`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(review),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to submit review');
  return data;
}

export async function createCheckin(id: string) {
  const res = await fetch(`${BASE}/roteiro/${id}/checkin`, {
    method: 'POST',
    headers: authHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to check in');
  return data;
}

export async function getBadges() {
  const res = await fetch(`${BASE}/tourist/badges`, { headers: authHeaders() });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to fetch badges');
  return data;
}

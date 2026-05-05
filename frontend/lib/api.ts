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

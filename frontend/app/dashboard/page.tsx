'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createTrip, clearToken } from '@/lib/api';

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '11px 14px', fontSize: '14px',
  background: 'var(--bg-input)', border: '1px solid var(--border)',
  borderRadius: '10px', color: 'var(--text-primary)',
  outline: 'none', fontFamily: 'inherit',
};

const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: '12px', color: 'var(--text-secondary)',
  marginBottom: '8px', letterSpacing: '0.05em', textTransform: 'uppercase',
};

export default function DashboardPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    lodging_location: '',
    trip_description: '',
    arrival_date: '',
    departure_date: '',
    status: 'planned',
  });
  const [result, setResult] = useState('');
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [lookupId, setLookupId] = useState('');

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setResult('');
    try {
      const data = await createTrip(form);
      setResult(JSON.stringify(data, null, 2));
      setIsError(false);
      setForm({ lodging_location: '', trip_description: '', arrival_date: '', departure_date: '', status: 'planned' });
    } catch (err: unknown) {
      setResult(err instanceof Error ? err.message : 'Error');
      setIsError(true);
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    clearToken();
    router.push('/login');
  }

  const navLink: React.CSSProperties = {
    fontSize: '14px', color: 'var(--text-secondary)', textDecoration: 'none',
    padding: '6px 12px', borderRadius: '8px', transition: 'color 0.2s',
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Navbar */}
      <nav style={{
        borderBottom: '1px solid var(--border)', padding: '0 32px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: '60px', background: 'var(--bg-card)',
        position: 'sticky', top: 0, zIndex: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '18px' }}>✈</span>
          <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: '18px', color: 'var(--text-primary)' }}>
            AppTurismo
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Link href="/dashboard" style={{ ...navLink, color: 'var(--accent)' }}>Trips</Link>
          <Link href="/dashboard/admin" style={navLink}>Admin</Link>
          <button onClick={logout} style={{
            ...navLink, background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--text-muted)', marginLeft: '8px',
          }}>Logout</button>
        </div>
      </nav>

      <div style={{ maxWidth: '680px', margin: '0 auto', padding: '40px 24px' }}>

        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '32px', color: 'var(--text-primary)', marginBottom: '8px' }}>
            My Trips
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>Manage your travel records</p>
        </div>

        {/* Lookup card */}
        <div style={{
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          borderRadius: '16px', padding: '24px', marginBottom: '20px',
        }}>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', fontFamily: "'DM Mono', monospace", marginBottom: '16px' }}>
            GET /get_trip_by_id/:id
          </p>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input
              type="number" placeholder="Enter trip ID"
              value={lookupId} onChange={e => setLookupId(e.target.value)}
              style={{ ...inputStyle, flex: 1 }}
              onFocus={e => e.target.style.borderColor = 'var(--accent)'}
              onBlur={e => e.target.style.borderColor = 'var(--border)'}
            />
            <button
              onClick={() => { if (lookupId) router.push(`/dashboard/${lookupId}`); }}
              style={{
                padding: '11px 20px', background: 'rgba(232,160,71,0.12)',
                border: '1px solid rgba(232,160,71,0.25)', borderRadius: '10px',
                color: 'var(--accent)', fontSize: '14px', fontWeight: '500',
                cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap',
              }}
            >
              View trip →
            </button>
          </div>
        </div>

        {/* Create trip card */}
        <div style={{
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          borderRadius: '16px', padding: '28px',
        }}>
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '22px', color: 'var(--text-primary)', marginBottom: '4px' }}>
              New trip
            </h2>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', fontFamily: "'DM Mono', monospace" }}>POST /trip</p>
          </div>

          <form onSubmit={handleCreate}>
            <div style={{ marginBottom: '16px' }}>
              <label style={labelStyle}>Lodging location</label>
              <input name="lodging_location" required value={form.lodging_location}
                onChange={handleChange} placeholder="e.g. Ipanema Beach Hotel, Rio de Janeiro"
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={labelStyle}>Description</label>
              <textarea name="trip_description" required value={form.trip_description}
                onChange={handleChange} rows={3}
                placeholder="Describe your trip..."
                style={{ ...inputStyle, resize: 'vertical', minHeight: '80px' }}
                onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={labelStyle}>Arrival</label>
                <input name="arrival_date" type="date" required value={form.arrival_date}
                  onChange={handleChange} style={inputStyle}
                  onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border)'}
                />
              </div>
              <div>
                <label style={labelStyle}>Departure</label>
                <input name="departure_date" type="date" required value={form.departure_date}
                  onChange={handleChange} style={inputStyle}
                  onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border)'}
                />
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={labelStyle}>Status</label>
              <select name="status" value={form.status} onChange={handleChange}
                style={{ ...inputStyle, cursor: 'pointer' }}>
                <option value="planned">Planned</option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <button type="submit" disabled={loading} style={{
              width: '100%', padding: '13px', fontSize: '14px', fontWeight: '500',
              background: loading ? 'var(--accent-dim)' : 'var(--accent)',
              color: '#0e0e11', border: 'none', borderRadius: '10px',
              cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit',
            }}>
              {loading ? 'Creating trip...' : 'Create trip'}
            </button>
          </form>

          {result && (
            <div style={{
              marginTop: '16px', padding: '16px',
              background: isError ? 'var(--danger-bg)' : 'var(--success-bg)',
              border: `1px solid ${isError ? 'rgba(224,82,82,0.2)' : 'rgba(76,175,130,0.2)'}`,
              borderRadius: '10px',
            }}>
              <pre style={{
                fontSize: '12px', fontFamily: "'DM Mono', monospace",
                color: isError ? 'var(--danger)' : 'var(--success)',
                overflow: 'auto', maxHeight: '200px', margin: 0,
              }}>{result}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

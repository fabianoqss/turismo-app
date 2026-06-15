'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getRoteiros, createRoteiro, getRecommendations, clearToken } from '@/lib/api';
import { useOnlineStatus } from '@/lib/useOnlineStatus';
import { getCache, setCache } from '@/lib/offlineCache';

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

const categories = [
  { value: '', label: 'All categories' },
  { value: 'praia', label: 'Praia' },
  { value: 'cultura', label: 'Cultura' },
  { value: 'gastronomia', label: 'Gastronomia' },
  { value: 'natureza', label: 'Natureza' },
  { value: 'aventura', label: 'Aventura' },
];

const categoryColors: Record<string, { bg: string; text: string }> = {
  praia: { bg: 'rgba(111,191,115,0.12)', text: 'var(--accent)' },
  cultura: { bg: 'rgba(124,207,136,0.12)', text: 'var(--success)' },
  gastronomia: { bg: 'rgba(232,160,71,0.12)', text: '#e8a047' },
  natureza: { bg: 'rgba(76,175,130,0.12)', text: '#4caf82' },
  aventura: { bg: 'rgba(217,92,92,0.12)', text: 'var(--danger)' },
};

const offlineBannerStyle: React.CSSProperties = {
  marginBottom: '20px', padding: '12px 14px',
  background: 'rgba(232,160,71,0.08)', border: '1px solid rgba(232,160,71,0.2)',
  borderRadius: '10px', fontSize: '13px', color: '#e8a047',
};

type Roteiro = {
  id: number;
  name: string;
  category: string;
  description: string;
  location: string;
  rating: number;
};

export default function RoteirosPage() {
  const router = useRouter();
  const isOnline = useOnlineStatus();

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');

  const [roteiros, setRoteiros] = useState<Roteiro[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [usingCache, setUsingCache] = useState(false);
  const [cachedAt, setCachedAt] = useState<number | null>(null);

  const [recommendations, setRecommendations] = useState<Roteiro[]>([]);

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', category: 'praia', description: '', location: '', rating: '', latitude: '', longitude: '' });
  const [createResult, setCreateResult] = useState('');
  const [createError, setCreateError] = useState(false);
  const [creating, setCreating] = useState(false);

  async function fetchRoteiros(e?: React.FormEvent) {
    e?.preventDefault();
    const unfiltered = !search && !category && !location;
    setLoading(true); setError('');
    try {
      const data = await getRoteiros({ search, category, location });
      setRoteiros(Array.isArray(data) ? data : []);
      setUsingCache(false);
      if (unfiltered) setCache('roteiros:all', data);
    } catch (err: unknown) {
      if (unfiltered) {
        const cached = getCache<Roteiro[]>('roteiros:all');
        if (cached) {
          setRoteiros(cached.data);
          setUsingCache(true);
          setCachedAt(cached.cachedAt);
          return;
        }
      }
      setError(err instanceof Error ? err.message : 'Error');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchRoteiros();
    getRecommendations()
      .then(data => setRecommendations(Array.isArray(data) ? data : []))
      .catch(() => setRecommendations([]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleFormChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true); setCreateResult('');
    try {
      const data = await createRoteiro({
        name: form.name,
        category: form.category,
        description: form.description,
        location: form.location,
        rating: form.rating ? Number(form.rating) : undefined,
        latitude: form.latitude ? Number(form.latitude) : undefined,
        longitude: form.longitude ? Number(form.longitude) : undefined,
      });
      setCreateResult(JSON.stringify(data, null, 2));
      setCreateError(false);
      setForm({ name: '', category: 'praia', description: '', location: '', rating: '', latitude: '', longitude: '' });
      fetchRoteiros();
    } catch (err: unknown) {
      setCreateResult(err instanceof Error ? err.message : 'Error');
      setCreateError(true);
    } finally {
      setCreating(false);
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
          {!isOnline && (
            <span style={{
              fontSize: '11px', padding: '3px 9px', borderRadius: '100px',
              background: 'rgba(232,160,71,0.12)', color: '#e8a047',
              fontWeight: '500', marginRight: '8px',
            }}>
              Offline
            </span>
          )}
          <Link href="/dashboard" style={navLink}>Trips</Link>
          <Link href="/dashboard/roteiros" style={{ ...navLink, color: 'var(--accent)' }}>Roteiros</Link>
          <Link href="/dashboard/map" style={navLink}>Map</Link>
          <Link href="/dashboard/admin" style={navLink}>Admin</Link>
          <button onClick={logout} style={{
            ...navLink, background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--text-muted)', marginLeft: '8px',
          }}>Logout</button>
        </div>
      </nav>

      <div style={{ maxWidth: '880px', margin: '0 auto', padding: '40px 24px' }}>

        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '32px', color: 'var(--text-primary)', marginBottom: '8px' }}>
            Roteiros
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>Discover itineraries and points of interest</p>
        </div>

        {/* Recommended for you */}
        {recommendations.length > 0 && (
          <div style={{ marginBottom: '20px' }}>
            <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '20px', color: 'var(--text-primary)', marginBottom: '12px' }}>
              Recommended for you
            </h2>
            <div style={{ display: 'flex', gap: '16px', overflowX: 'auto', paddingBottom: '4px' }}>
              {recommendations.map(r => {
                const cc = categoryColors[r.category] || { bg: 'rgba(255,255,255,0.06)', text: 'var(--text-secondary)' };
                return (
                  <Link key={r.id} href={`/dashboard/roteiros/${r.id}`} style={{ textDecoration: 'none', flex: '0 0 240px' }}>
                    <div style={{
                      background: 'var(--bg-card)', border: '1px solid var(--border)',
                      borderRadius: '16px', padding: '20px', height: '100%',
                      display: 'flex', flexDirection: 'column', gap: '10px',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{
                          fontSize: '11px', padding: '3px 9px', borderRadius: '100px',
                          background: cc.bg, color: cc.text, fontWeight: '500', textTransform: 'capitalize',
                        }}>
                          {r.category}
                        </span>
                        {r.rating > 0 && (
                          <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontFamily: "'DM Mono', monospace" }}>
                            {r.rating.toFixed(1)}★
                          </span>
                        )}
                      </div>
                      <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '18px', color: 'var(--text-primary)' }}>
                        {r.name}
                      </h3>
                      <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.5', flex: 1 }}>
                        {r.description.length > 90 ? `${r.description.slice(0, 90)}…` : r.description}
                      </p>
                      <p style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: "'DM Mono', monospace" }}>
                        📍 {r.location}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Search & filters */}
        <div style={{
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          borderRadius: '16px', padding: '24px', marginBottom: '20px',
        }}>
          <form onSubmit={fetchRoteiros} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: '12px', alignItems: 'end' }}>
            <div>
              <label style={labelStyle}>Search</label>
              <input
                value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search by name or description"
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
              />
            </div>
            <div>
              <label style={labelStyle}>Category</label>
              <select value={category} onChange={e => setCategory(e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }}>
                {categories.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Location</label>
              <input
                value={location} onChange={e => setLocation(e.target.value)}
                placeholder="e.g. João Pessoa"
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
              />
            </div>
            <button type="submit" disabled={loading} style={{
              padding: '11px 20px', fontSize: '14px', fontWeight: '500',
              background: loading ? 'var(--accent-dim)' : 'var(--accent)',
              color: '#0e0e11', border: 'none', borderRadius: '10px',
              cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap',
            }}>
              {loading ? 'Searching...' : 'Search'}
            </button>
          </form>

          {error && (
            <div style={{ marginTop: '16px', padding: '12px 14px', background: 'var(--danger-bg)', border: '1px solid rgba(224,82,82,0.2)', borderRadius: '10px', fontSize: '13px', color: 'var(--danger)' }}>
              {error}
            </div>
          )}
        </div>

        {/* Offline banner */}
        {usingCache && (
          <div style={offlineBannerStyle}>
            You&apos;re offline — showing roteiros from your last visit{cachedAt ? ` (cached ${new Date(cachedAt).toLocaleString()})` : ''}.
          </div>
        )}

        {/* Results */}
        {!loading && roteiros.length === 0 && !error && (
          <div style={{
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: '16px', padding: '28px', marginBottom: '20px',
            textAlign: 'center', color: 'var(--text-muted)', fontSize: '14px',
          }}>
            No roteiros found. Try adjusting your search or filters.
          </div>
        )}

        {roteiros.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px', marginBottom: '20px' }}>
            {roteiros.map(r => {
              const cc = categoryColors[r.category] || { bg: 'rgba(255,255,255,0.06)', text: 'var(--text-secondary)' };
              return (
                <Link key={r.id} href={`/dashboard/roteiros/${r.id}`} style={{ textDecoration: 'none' }}>
                  <div style={{
                    background: 'var(--bg-card)', border: '1px solid var(--border)',
                    borderRadius: '16px', padding: '20px', height: '100%',
                    display: 'flex', flexDirection: 'column', gap: '10px',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{
                        fontSize: '11px', padding: '3px 9px', borderRadius: '100px',
                        background: cc.bg, color: cc.text, fontWeight: '500', textTransform: 'capitalize',
                      }}>
                        {r.category}
                      </span>
                      {r.rating > 0 && (
                        <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontFamily: "'DM Mono', monospace" }}>
                          {r.rating.toFixed(1)}★
                        </span>
                      )}
                    </div>
                    <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '18px', color: 'var(--text-primary)' }}>
                      {r.name}
                    </h3>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.5', flex: 1 }}>
                      {r.description.length > 110 ? `${r.description.slice(0, 110)}…` : r.description}
                    </p>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: "'DM Mono', monospace" }}>
                      📍 {r.location}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Add roteiro */}
        <div style={{
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          borderRadius: '16px', padding: '28px',
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: showForm ? '24px' : 0 }}>
            <div>
              <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '22px', color: 'var(--text-primary)' }}>
                Add roteiro
              </h2>
            </div>
            <button onClick={() => setShowForm(s => !s)} style={{
              padding: '9px 18px', fontSize: '13px', fontWeight: '500',
              background: 'rgba(111,191,115,0.1)', border: '1px solid rgba(111,191,115,0.2)',
              borderRadius: '10px', color: 'var(--accent)', cursor: 'pointer', fontFamily: 'inherit',
            }}>
              {showForm ? 'Cancel' : 'New roteiro'}
            </button>
          </div>

          {showForm && (
            <form onSubmit={handleCreate}>
              <div style={{ marginBottom: '16px' }}>
                <label style={labelStyle}>Name</label>
                <input name="name" required value={form.name}
                  onChange={handleFormChange} placeholder="e.g. Praia de Tambau"
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border)'}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={labelStyle}>Category</label>
                  <select name="category" value={form.category} onChange={handleFormChange} style={{ ...inputStyle, cursor: 'pointer' }}>
                    {categories.filter(c => c.value).map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Location</label>
                  <input name="location" required value={form.location}
                    onChange={handleFormChange} placeholder="e.g. João Pessoa"
                    style={inputStyle}
                    onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                    onBlur={e => e.target.style.borderColor = 'var(--border)'}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={labelStyle}>Description</label>
                <textarea name="description" required value={form.description}
                  onChange={handleFormChange} rows={3}
                  placeholder="Describe this place..."
                  style={{ ...inputStyle, resize: 'vertical', minHeight: '80px' }}
                  onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border)'}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                <div>
                  <label style={labelStyle}>Rating (optional)</label>
                  <input name="rating" type="number" min="0" max="5" step="0.1" value={form.rating}
                    onChange={handleFormChange} placeholder="e.g. 4.5"
                    style={inputStyle}
                    onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                    onBlur={e => e.target.style.borderColor = 'var(--border)'}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Latitude (optional)</label>
                  <input name="latitude" type="number" step="any" value={form.latitude}
                    onChange={handleFormChange} placeholder="e.g. -7.115"
                    style={inputStyle}
                    onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                    onBlur={e => e.target.style.borderColor = 'var(--border)'}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Longitude (optional)</label>
                  <input name="longitude" type="number" step="any" value={form.longitude}
                    onChange={handleFormChange} placeholder="e.g. -34.861"
                    style={inputStyle}
                    onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                    onBlur={e => e.target.style.borderColor = 'var(--border)'}
                  />
                </div>
              </div>

              <button type="submit" disabled={creating} style={{
                width: '100%', padding: '13px', fontSize: '14px', fontWeight: '500',
                background: creating ? 'var(--accent-dim)' : 'var(--accent)',
                color: '#0e0e11', border: 'none', borderRadius: '10px',
                cursor: creating ? 'not-allowed' : 'pointer', fontFamily: 'inherit',
              }}>
                {creating ? 'Saving...' : 'Create roteiro'}
              </button>
            </form>
          )}

          {createResult && (
            <div style={{
              marginTop: '16px', padding: '16px',
              background: createError ? 'var(--danger-bg)' : 'var(--success-bg)',
              border: `1px solid ${createError ? 'rgba(224,82,82,0.2)' : 'rgba(76,175,130,0.2)'}`,
              borderRadius: '10px',
            }}>
              <pre style={{
                fontSize: '12px', fontFamily: "'DM Mono', monospace",
                color: createError ? 'var(--danger)' : 'var(--success)',
                overflow: 'auto', maxHeight: '200px', margin: 0,
              }}>{createResult}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

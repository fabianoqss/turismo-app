'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { getRoteiros, clearToken } from '@/lib/api';

const MapView = dynamic(() => import('./MapView'), {
  ssr: false,
  loading: () => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)', fontSize: '14px' }}>
      Loading map…
    </div>
  ),
});

type Roteiro = {
  id: number;
  name: string;
  category: string;
  latitude: number;
  longitude: number;
};

export default function MapPage() {
  const router = useRouter();

  const [roteiros, setRoteiros] = useState<Roteiro[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    getRoteiros()
      .then(data => { if (!cancelled) setRoteiros(Array.isArray(data) ? data : []); })
      .catch(err => { if (!cancelled) setError(err instanceof Error ? err.message : 'Error'); });
    return () => { cancelled = true; };
  }, []);

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
          <Link href="/dashboard" style={navLink}>Trips</Link>
          <Link href="/dashboard/roteiros" style={navLink}>Roteiros</Link>
          <Link href="/dashboard/map" style={{ ...navLink, color: 'var(--accent)' }}>Map</Link>
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
            Map
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>Explore roteiros around João Pessoa and track your live location</p>
        </div>

        {error && (
          <div style={{ marginBottom: '20px', padding: '12px 14px', background: 'var(--danger-bg)', border: '1px solid rgba(224,82,82,0.2)', borderRadius: '10px', fontSize: '13px', color: 'var(--danger)' }}>
            {error}
          </div>
        )}

        <div style={{
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          borderRadius: '16px', overflow: 'hidden', height: '520px',
        }}>
          <MapView roteiros={roteiros} />
        </div>
      </div>
    </div>
  );
}

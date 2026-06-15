'use client';
import { useState } from 'react';
import Link from 'next/link';
import { getAllTrips, getAllLogs } from '@/lib/api';

export default function AdminPage() {
  const [trips, setTrips] = useState<unknown[] | null>(null);
  const [tripsError, setTripsError] = useState('');
  const [loadingTrips, setLoadingTrips] = useState(false);

  const [logs, setLogs] = useState<unknown[] | null>(null);
  const [logsError, setLogsError] = useState('');
  const [loadingLogs, setLoadingLogs] = useState(false);

  async function fetchTrips() {
    setLoadingTrips(true); setTripsError('');
    try {
      const data = await getAllTrips();
      setTrips(Array.isArray(data) ? data : [data]);
    } catch (err: unknown) {
      setTripsError(err instanceof Error ? err.message : 'Error');
    } finally { setLoadingTrips(false); }
  }

  async function fetchLogs() {
    setLoadingLogs(true); setLogsError('');
    try {
      const data = await getAllLogs();
      setLogs(Array.isArray(data) ? data : [data]);
    } catch (err: unknown) {
      setLogsError(err instanceof Error ? err.message : 'Error');
    } finally { setLoadingLogs(false); }
  }

  const statusColors: Record<string, { bg: string; text: string }> = {
    planned: { bg: 'rgba(232,160,71,0.12)', text: '#e8a047' },
    ongoing: { bg: 'rgba(76,175,130,0.12)', text: '#4caf82' },
    completed: { bg: 'rgba(138,135,148,0.15)', text: '#8a8794' },
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <nav style={{
        borderBottom: '1px solid var(--border)', padding: '0 32px',
        display: 'flex', alignItems: 'center', gap: '12px',
        height: '60px', background: 'var(--bg-card)',
      }}>
        <Link href="/dashboard" style={{ fontSize: '14px', color: 'var(--text-muted)', textDecoration: 'none' }}>← Dashboard</Link>
        <span style={{ color: 'var(--border-hover)' }}>/</span>
        <span style={{ fontSize: '14px', color: 'var(--text-primary)' }}>Admin</span>
        <span style={{
          fontSize: '11px', padding: '3px 8px', borderRadius: '100px',
          background: 'rgba(232,160,71,0.12)', color: 'var(--accent)',
          border: '1px solid rgba(232,160,71,0.2)', fontWeight: '500',
        }}>admin only</span>
        <span style={{ flex: 1 }} />
        <Link href="/dashboard/roteiros" style={{ fontSize: '14px', color: 'var(--text-muted)', textDecoration: 'none' }}>Roteiros</Link>
        <Link href="/dashboard/map" style={{ fontSize: '14px', color: 'var(--text-muted)', textDecoration: 'none' }}>Map</Link>
      </nav>

      <div style={{ maxWidth: '780px', margin: '0 auto', padding: '40px 24px' }}>
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '32px', color: 'var(--text-primary)', marginBottom: '8px' }}>
            Admin panel
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>System-wide data and logs</p>
        </div>

        {/* All trips */}
        <div style={{
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          borderRadius: '16px', padding: '28px', marginBottom: '20px',
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div>
              <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '22px', color: 'var(--text-primary)' }}>
                All trips
              </h2>
            </div>
            <button onClick={fetchTrips} disabled={loadingTrips} style={{
              padding: '9px 18px', fontSize: '13px', fontWeight: '500',
              background: 'rgba(232,160,71,0.1)', border: '1px solid rgba(232,160,71,0.2)',
              borderRadius: '10px', color: 'var(--accent)', cursor: 'pointer', fontFamily: 'inherit',
            }}>
              {loadingTrips ? 'Loading...' : 'Fetch'}
            </button>
          </div>

          {tripsError && (
            <div style={{ padding: '12px 14px', background: 'var(--danger-bg)', border: '1px solid rgba(224,82,82,0.2)', borderRadius: '10px', fontSize: '13px', color: 'var(--danger)' }}>
              {tripsError}
            </div>
          )}

          {trips && trips.length === 0 && (
            <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>No trips found.</p>
          )}

          {trips && trips.length > 0 && (
            <div style={{ display: 'grid', gap: '10px' }}>
              {trips.map((trip, i) => {
                const t = trip as Record<string, string>;
                const status = String(t.status || 'planned');
                const sc = statusColors[status] || { bg: 'rgba(255,255,255,0.06)', text: 'var(--text-secondary)' };
                return (
                  <div key={i} style={{
                    border: '1px solid var(--border)', borderRadius: '12px',
                    padding: '16px 20px', background: 'rgba(255,255,255,0.02)',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                      <span style={{ fontSize: '15px', fontWeight: '500', color: 'var(--text-primary)' }}>
                        {String(t.lodging_location || '—')}
                      </span>
                      <span style={{ fontSize: '11px', padding: '3px 9px', borderRadius: '100px', background: sc.bg, color: sc.text, fontWeight: '500' }}>
                        {status}
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: '24px', fontSize: '12px', color: 'var(--text-muted)', fontFamily: "'DM Mono', monospace" }}>
                      <span>id: {String(t.id || '—')}</span>
                      <span>tourist: {String(t.tourist_id || '—')}</span>
                      <span>{String(t.arrival_date || '—')} → {String(t.departure_date || '—')}</span>
                    </div>
                    {t.trip_description && (
                      <p style={{ marginTop: '8px', fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                        {String(t.trip_description)}
                      </p>
                    )}
                    {t.trip_review && (
                      <p style={{ marginTop: '8px', fontSize: '13px', color: 'var(--accent)', fontStyle: 'italic' }}>
                        "{String(t.trip_review)}"
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* All logs */}
        <div style={{
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          borderRadius: '16px', padding: '28px',
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div>
              <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '22px', color: 'var(--text-primary)' }}>
                System logs
              </h2>
            </div>
            <button onClick={fetchLogs} disabled={loadingLogs} style={{
              padding: '9px 18px', fontSize: '13px', fontWeight: '500',
              background: 'rgba(232,160,71,0.1)', border: '1px solid rgba(232,160,71,0.2)',
              borderRadius: '10px', color: 'var(--accent)', cursor: 'pointer', fontFamily: 'inherit',
            }}>
              {loadingLogs ? 'Loading...' : 'Fetch'}
            </button>
          </div>

          {logsError && (
            <div style={{ padding: '12px 14px', background: 'var(--danger-bg)', border: '1px solid rgba(224,82,82,0.2)', borderRadius: '10px', fontSize: '13px', color: 'var(--danger)' }}>
              {logsError}
            </div>
          )}

          {logs && logs.length === 0 && (
            <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>No logs found.</p>
          )}

          {logs && logs.length > 0 && (
            <div style={{
              background: '#0a0a0d', borderRadius: '12px', padding: '20px',
              maxHeight: '400px', overflowY: 'auto',
              border: '1px solid rgba(255,255,255,0.05)',
            }}>
              {logs.map((log, i) => (
                <div key={i} style={{
                  display: 'flex', gap: '16px', padding: '6px 0',
                  borderBottom: i < logs.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: '12px', fontFamily: "'DM Mono', monospace", whiteSpace: 'nowrap', minWidth: '24px' }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <pre style={{
                    fontSize: '12px', fontFamily: "'DM Mono', monospace",
                    color: '#4caf82', margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-all',
                  }}>
                    {typeof log === 'string' ? log : JSON.stringify(log, null, 2)}
                  </pre>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

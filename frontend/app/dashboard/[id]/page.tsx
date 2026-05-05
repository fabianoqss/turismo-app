'use client';
import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { getTripById, addReview, deleteTrip } from '@/lib/api';

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

const sectionCard: React.CSSProperties = {
  background: 'var(--bg-card)', border: '1px solid var(--border)',
  borderRadius: '16px', padding: '28px', marginBottom: '20px',
};

export default function TripPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [trip, setTrip] = useState<Record<string, unknown> | null>(null);
  const [fetchError, setFetchError] = useState('');
  const [fetching, setFetching] = useState(false);

  const [review, setReview] = useState('');
  const [reviewResult, setReviewResult] = useState('');
  const [reviewError, setReviewError] = useState(false);
  const [reviewing, setReviewing] = useState(false);

  const [deleteResult, setDeleteResult] = useState('');
  const [deleteErr, setDeleteErr] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleFetch() {
    setFetching(true); setFetchError(''); setTrip(null);
    try { setTrip(await getTripById(id)); }
    catch (err: unknown) { setFetchError(err instanceof Error ? err.message : 'Error'); }
    finally { setFetching(false); }
  }

  async function handleReview(e: React.FormEvent) {
    e.preventDefault(); setReviewing(true); setReviewResult('');
    try {
      const data = await addReview(id, review);
      setReviewResult(JSON.stringify(data, null, 2)); setReviewError(false);
    } catch (err: unknown) {
      setReviewResult(err instanceof Error ? err.message : 'Error'); setReviewError(true);
    } finally { setReviewing(false); }
  }

  async function handleDelete() {
    if (!confirm(`Delete trip #${id}? This cannot be undone.`)) return;
    setDeleting(true);
    try {
      const data = await deleteTrip(id);
      setDeleteResult(JSON.stringify(data, null, 2)); setDeleteErr(false);
      setTimeout(() => router.push('/dashboard'), 1500);
    } catch (err: unknown) {
      setDeleteResult(err instanceof Error ? err.message : 'Error'); setDeleteErr(true);
    } finally { setDeleting(false); }
  }

  const statusColors: Record<string, string> = {
    planned: 'rgba(232,160,71,0.15)',
    ongoing: 'rgba(76,175,130,0.15)',
    completed: 'rgba(138,135,148,0.2)',
  };
  const statusText: Record<string, string> = {
    planned: 'var(--accent)',
    ongoing: 'var(--success)',
    completed: 'var(--text-secondary)',
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
        <span style={{ fontSize: '14px', color: 'var(--text-primary)', fontFamily: "'DM Mono', monospace" }}>
          Trip #{id}
        </span>
      </nav>

      <div style={{ maxWidth: '680px', margin: '0 auto', padding: '40px 24px' }}>
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '32px', color: 'var(--text-primary)', marginBottom: '8px' }}>
            Trip #{id}
          </h1>
        </div>

        {/* Fetch */}
        <div style={sectionCard}>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', fontFamily: "'DM Mono', monospace", marginBottom: '16px' }}>
            GET /get_trip_by_id/{id}
          </p>
          <button onClick={handleFetch} disabled={fetching} style={{
            padding: '10px 20px', fontSize: '14px', fontWeight: '500',
            background: 'rgba(240,237,232,0.06)', border: '1px solid var(--border)',
            borderRadius: '10px', color: 'var(--text-primary)', cursor: 'pointer', fontFamily: 'inherit',
          }}>
            {fetching ? 'Fetching...' : 'Fetch trip'}
          </button>

          {fetchError && (
            <div style={{ marginTop: '16px', padding: '12px 14px', background: 'var(--danger-bg)', border: '1px solid rgba(224,82,82,0.2)', borderRadius: '10px', fontSize: '13px', color: 'var(--danger)' }}>
              {fetchError}
            </div>
          )}

          {trip && (
            <div style={{ marginTop: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <span style={{ fontSize: '18px', fontFamily: "'DM Serif Display', serif", color: 'var(--text-primary)' }}>
                  {String(trip.lodging_location || '—')}
                </span>
                {trip.status && (
                  <span style={{
                    fontSize: '12px', padding: '4px 10px', borderRadius: '100px',
                    background: statusColors[String(trip.status)] || 'rgba(255,255,255,0.08)',
                    color: statusText[String(trip.status)] || 'var(--text-secondary)',
                    fontWeight: '500',
                  }}>
                    {String(trip.status)}
                  </span>
                )}
              </div>
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '16px', display: 'grid', gap: '10px' }}>
                {Object.entries(trip).filter(([k]) => k !== 'lodging_location' && k !== 'status').map(([key, val]) => (
                  <div key={key} style={{ display: 'flex', gap: '16px' }}>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: "'DM Mono', monospace", minWidth: '140px' }}>{key}</span>
                    <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{String(val)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Review */}
        <div style={sectionCard}>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '20px', color: 'var(--text-primary)', marginBottom: '4px' }}>Add review</h2>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', fontFamily: "'DM Mono', monospace", marginBottom: '20px' }}>PUT /add_trip_review/{id}</p>
          <form onSubmit={handleReview}>
            <div style={{ marginBottom: '16px' }}>
              <label style={labelStyle}>Your review</label>
              <textarea required value={review} onChange={e => setReview(e.target.value)} rows={4}
                placeholder="How was the trip? Share your experience..."
                style={{ ...inputStyle, resize: 'vertical', minHeight: '100px' }}
                onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
              />
            </div>
            <button type="submit" disabled={reviewing} style={{
              padding: '10px 20px', fontSize: '14px', fontWeight: '500',
              background: reviewing ? 'var(--accent-dim)' : 'var(--accent)',
              color: '#0e0e11', border: 'none', borderRadius: '10px',
              cursor: reviewing ? 'not-allowed' : 'pointer', fontFamily: 'inherit',
            }}>
              {reviewing ? 'Saving...' : 'Submit review'}
            </button>
          </form>
          {reviewResult && (
            <div style={{ marginTop: '16px', padding: '14px', background: reviewError ? 'var(--danger-bg)' : 'var(--success-bg)', border: `1px solid ${reviewError ? 'rgba(224,82,82,0.2)' : 'rgba(76,175,130,0.2)'}`, borderRadius: '10px' }}>
              <pre style={{ fontSize: '12px', fontFamily: "'DM Mono', monospace", color: reviewError ? 'var(--danger)' : 'var(--success)', margin: 0, overflow: 'auto' }}>{reviewResult}</pre>
            </div>
          )}
        </div>

        {/* Delete */}
        <div style={{ ...sectionCard, borderColor: 'rgba(224,82,82,0.15)' }}>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '20px', color: 'var(--danger)', marginBottom: '4px' }}>Delete trip</h2>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', fontFamily: "'DM Mono', monospace", marginBottom: '20px' }}>DELETE /delete_trip/{id}</p>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
            This action is permanent and cannot be undone.
          </p>
          <button onClick={handleDelete} disabled={deleting} style={{
            padding: '10px 20px', fontSize: '14px', fontWeight: '500',
            background: 'var(--danger-bg)', border: '1px solid rgba(224,82,82,0.25)',
            color: 'var(--danger)', borderRadius: '10px',
            cursor: deleting ? 'not-allowed' : 'pointer', fontFamily: 'inherit',
          }}>
            {deleting ? 'Deleting...' : `Delete trip #${id}`}
          </button>
          {deleteResult && (
            <div style={{ marginTop: '16px', padding: '14px', background: deleteErr ? 'var(--danger-bg)' : 'var(--success-bg)', border: `1px solid ${deleteErr ? 'rgba(224,82,82,0.2)' : 'rgba(76,175,130,0.2)'}`, borderRadius: '10px' }}>
              <pre style={{ fontSize: '12px', fontFamily: "'DM Mono', monospace", color: deleteErr ? 'var(--danger)' : 'var(--success)', margin: 0 }}>{deleteResult}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

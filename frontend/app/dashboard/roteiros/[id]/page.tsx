'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { getRoteiroById, getRoteiroReviews, createRoteiroReview, createCheckin } from '@/lib/api';
import { distanceMeters } from '@/lib/geo';
import { useOnlineStatus } from '@/lib/useOnlineStatus';
import { getCache, setCache } from '@/lib/offlineCache';

const CHECKIN_RADIUS_M = 2000;

const sectionCard: React.CSSProperties = {
  background: 'var(--bg-card)', border: '1px solid var(--border)',
  borderRadius: '16px', padding: '28px', marginBottom: '20px',
};

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
  latitude: number;
  longitude: number;
  created_at?: string;
};

type Review = {
  id: number;
  roteiro_id: number;
  tourist_id: number;
  rating: number;
  comment: string;
  created_at: string;
};

export default function RoteiroPage() {
  const { id } = useParams<{ id: string }>();
  const isOnline = useOnlineStatus();

  const [roteiro, setRoteiro] = useState<Roteiro | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [usingCache, setUsingCache] = useState(false);
  const [cachedAt, setCachedAt] = useState<number | null>(null);

  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsError, setReviewsError] = useState('');
  const [reviewsUsingCache, setReviewsUsingCache] = useState(false);

  const [rating, setRating] = useState('5');
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const [checkingIn, setCheckingIn] = useState(false);
  const [checkinMessage, setCheckinMessage] = useState('');
  const [checkinError, setCheckinError] = useState('');

  const loadRoteiro = () => {
    setLoading(true); setError('');
    return getRoteiroById(id)
      .then(data => setRoteiro(data))
      .catch(err => setError(err instanceof Error ? err.message : 'Error'))
      .finally(() => setLoading(false));
  };

  const loadReviews = () => {
    setReviewsError('');
    return getRoteiroReviews(id)
      .then(data => setReviews(data ?? []))
      .catch(err => setReviewsError(err instanceof Error ? err.message : 'Error'));
  };

  useEffect(() => {
    let cancelled = false;
    setLoading(true); setError('');
    getRoteiroById(id)
      .then(data => {
        if (cancelled) return;
        setRoteiro(data);
        setUsingCache(false);
        setCache('roteiro:' + id, data);
      })
      .catch(err => {
        if (cancelled) return;
        const cached = getCache<Roteiro>('roteiro:' + id);
        if (cached) {
          setRoteiro(cached.data);
          setUsingCache(true);
          setCachedAt(cached.cachedAt);
        } else {
          setError(err instanceof Error ? err.message : 'Error');
        }
      })
      .finally(() => { if (!cancelled) setLoading(false); });

    getRoteiroReviews(id)
      .then(data => {
        if (cancelled) return;
        setReviews(data ?? []);
        setReviewsUsingCache(false);
        setCache('reviews:' + id, data ?? []);
      })
      .catch(err => {
        if (cancelled) return;
        const cached = getCache<Review[]>('reviews:' + id);
        if (cached) {
          setReviews(cached.data);
          setReviewsUsingCache(true);
        } else {
          setReviewsError(err instanceof Error ? err.message : 'Error');
        }
      });

    return () => { cancelled = true; };
  }, [id]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true); setSubmitError('');
    try {
      await createRoteiroReview(id, { rating: Number(rating), comment });
      setComment('');
      setRating('5');
      await Promise.all([loadRoteiro(), loadReviews()]);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCheckin = () => {
    if (!isOnline) {
      setCheckinError('Check-in requires an internet connection.');
      return;
    }
    setCheckingIn(true); setCheckinMessage(''); setCheckinError('');

    const finish = async () => {
      try {
        await createCheckin(id);
        setCheckinMessage('Checked in! 🎉');
      } catch (err) {
        setCheckinError(err instanceof Error ? err.message : 'Error');
      } finally {
        setCheckingIn(false);
      }
    };

    const hasCoords = roteiro && (roteiro.latitude || roteiro.longitude);

    if (!hasCoords || !navigator.geolocation) {
      finish();
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const distance = distanceMeters(
          position.coords.latitude,
          position.coords.longitude,
          roteiro!.latitude,
          roteiro!.longitude,
        );
        if (distance > CHECKIN_RADIUS_M) {
          setCheckinError(`You're too far from this place (${Math.round(distance / 1000)} km away).`);
          setCheckingIn(false);
          return;
        }
        finish();
      },
      () => finish(),
    );
  };

  const cc = roteiro ? (categoryColors[roteiro.category] || { bg: 'rgba(255,255,255,0.06)', text: 'var(--text-secondary)' }) : null;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <nav style={{
        borderBottom: '1px solid var(--border)', padding: '0 32px',
        display: 'flex', alignItems: 'center', gap: '12px',
        height: '60px', background: 'var(--bg-card)',
      }}>
        <Link href="/dashboard/roteiros" style={{ fontSize: '14px', color: 'var(--text-muted)', textDecoration: 'none' }}>← Roteiros</Link>
        <span style={{ color: 'var(--border-hover)' }}>/</span>
        <span style={{ fontSize: '14px', color: 'var(--text-primary)', fontFamily: "'DM Mono', monospace" }}>
          Roteiro #{id}
        </span>
        <span style={{ flex: 1 }} />
        <Link href="/dashboard/map" style={{ fontSize: '14px', color: 'var(--text-muted)', textDecoration: 'none' }}>Map</Link>
      </nav>

      <div style={{ maxWidth: '680px', margin: '0 auto', padding: '40px 24px' }}>
        {loading && (
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Loading...</p>
        )}

        {error && (
          <div style={{ padding: '12px 14px', background: 'var(--danger-bg)', border: '1px solid rgba(224,82,82,0.2)', borderRadius: '10px', fontSize: '13px', color: 'var(--danger)' }}>
            {error}
          </div>
        )}

        {usingCache && (
          <div style={offlineBannerStyle}>
            You&apos;re offline — showing this roteiro from your last visit{cachedAt ? ` (cached ${new Date(cachedAt).toLocaleString()})` : ''}.
          </div>
        )}

        {roteiro && cc && (
          <div style={sectionCard}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <span style={{
                fontSize: '11px', padding: '3px 9px', borderRadius: '100px',
                background: cc.bg, color: cc.text, fontWeight: '500', textTransform: 'capitalize',
              }}>
                {roteiro.category}
              </span>
              {roteiro.rating > 0 && (
                <span style={{ fontSize: '14px', color: 'var(--text-secondary)', fontFamily: "'DM Mono', monospace" }}>
                  {roteiro.rating.toFixed(1)}★
                </span>
              )}
            </div>

            <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '32px', color: 'var(--text-primary)', marginBottom: '8px' }}>
              {roteiro.name}
            </h1>

            <p style={{ fontSize: '13px', color: 'var(--text-muted)', fontFamily: "'DM Mono', monospace", marginBottom: '20px' }}>
              📍 {roteiro.location}
            </p>

            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.7' }}>
                {roteiro.description}
              </p>
            </div>
          </div>
        )}

        {roteiro && (
          <>
            {/* Check-in */}
            <div style={sectionCard}>
              <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '20px', color: 'var(--text-primary)', marginBottom: '4px' }}>
                Check-in
              </h2>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '20px' }}>
                Check in here to earn badges and track your travels.
              </p>
              <button onClick={handleCheckin} disabled={checkingIn} style={{
                padding: '10px 20px', fontSize: '14px', fontWeight: '500',
                background: checkingIn ? 'var(--accent-dim)' : 'var(--accent)',
                color: '#0e0e11', border: 'none', borderRadius: '10px',
                cursor: checkingIn ? 'not-allowed' : 'pointer', fontFamily: 'inherit',
              }}>
                {checkingIn ? 'Checking in...' : 'Check in here'}
              </button>
              {checkinMessage && (
                <div style={{ marginTop: '16px', padding: '14px', background: 'rgba(124,207,136,0.08)', border: '1px solid rgba(124,207,136,0.2)', borderRadius: '10px', fontSize: '13px', color: 'var(--success)' }}>
                  {checkinMessage}
                </div>
              )}
              {checkinError && (
                <div style={{ marginTop: '16px', padding: '14px', background: 'var(--danger-bg)', border: '1px solid rgba(224,82,82,0.2)', borderRadius: '10px', fontSize: '13px', color: 'var(--danger)' }}>
                  {checkinError}
                </div>
              )}
            </div>

            {/* Reviews */}
            <div style={sectionCard}>
              <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '20px', color: 'var(--text-primary)', marginBottom: '16px' }}>
                Reviews
              </h2>

              {reviewsError && (
                <div style={{ padding: '12px 14px', background: 'var(--danger-bg)', border: '1px solid rgba(224,82,82,0.2)', borderRadius: '10px', fontSize: '13px', color: 'var(--danger)', marginBottom: '16px' }}>
                  {reviewsError}
                </div>
              )}

              {reviewsUsingCache && (
                <div style={offlineBannerStyle}>
                  You&apos;re offline — showing reviews from your last visit.
                </div>
              )}

              {reviews.length === 0 ? (
                <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
                  No reviews yet — be the first!
                </p>
              ) : (
                <div style={{ display: 'grid', gap: '14px' }}>
                  {reviews.map(review => (
                    <div key={review.id} style={{ borderTop: '1px solid var(--border)', paddingTop: '14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                        <span style={{ fontSize: '14px', color: 'var(--accent)', fontFamily: "'DM Mono', monospace" }}>
                          {review.rating.toFixed(1)}★
                        </span>
                        <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: "'DM Mono', monospace" }}>
                          {new Date(review.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                        {review.comment}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Add review */}
            <div style={sectionCard}>
              <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '20px', color: 'var(--text-primary)', marginBottom: '20px' }}>
                Add review
              </h2>
              <form onSubmit={handleSubmitReview}>
                <div style={{ marginBottom: '16px' }}>
                  <label style={labelStyle}>Rating</label>
                  <select value={rating} onChange={e => setRating(e.target.value)} style={inputStyle}>
                    <option value="5">5 ★ — Excellent</option>
                    <option value="4">4 ★ — Good</option>
                    <option value="3">3 ★ — Average</option>
                    <option value="2">2 ★ — Poor</option>
                    <option value="1">1 ★ — Terrible</option>
                  </select>
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <label style={labelStyle}>Comment</label>
                  <textarea required value={comment} onChange={e => setComment(e.target.value)} rows={4}
                    placeholder="Share your experience..."
                    style={{ ...inputStyle, resize: 'vertical', minHeight: '100px' }}
                    onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                    onBlur={e => e.target.style.borderColor = 'var(--border)'}
                  />
                </div>
                <button type="submit" disabled={submitting} style={{
                  padding: '10px 20px', fontSize: '14px', fontWeight: '500',
                  background: submitting ? 'var(--accent-dim)' : 'var(--accent)',
                  color: '#0e0e11', border: 'none', borderRadius: '10px',
                  cursor: submitting ? 'not-allowed' : 'pointer', fontFamily: 'inherit',
                }}>
                  {submitting ? 'Saving...' : 'Submit review'}
                </button>
              </form>
              {submitError && (
                <div style={{ marginTop: '16px', padding: '14px', background: 'var(--danger-bg)', border: '1px solid rgba(224,82,82,0.2)', borderRadius: '10px', fontSize: '13px', color: 'var(--danger)' }}>
                  {submitError}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

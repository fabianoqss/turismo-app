'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signup } from '@/lib/api';

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signup(email, password);
      router.push('/login');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg)', padding: '24px',
    }}>
      <div style={{ width: '100%', maxWidth: '400px' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{
            width: '48px', height: '48px', borderRadius: '14px',
            background: 'var(--accent-glow)', border: '1px solid rgba(232,160,71,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px', fontSize: '22px',
          }}>✈</div>
          <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '26px', color: 'var(--text-primary)', marginBottom: '6px' }}>
            AppTurismo
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Create your account</p>
        </div>

        {/* Card */}
        <div style={{
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          borderRadius: '16px', padding: '32px',
        }}>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                Email
              </label>
              <input
                type="email" required value={email} onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                style={{
                  width: '100%', padding: '11px 14px', fontSize: '14px',
                  background: 'var(--bg-input)', border: '1px solid var(--border)',
                  borderRadius: '10px', color: 'var(--text-primary)',
                  outline: 'none', fontFamily: 'inherit',
                  transition: 'border-color 0.2s',
                }}
                onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
              />
            </div>
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                Password
              </label>
              <input
                type="password" required value={password} onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{
                  width: '100%', padding: '11px 14px', fontSize: '14px',
                  background: 'var(--bg-input)', border: '1px solid var(--border)',
                  borderRadius: '10px', color: 'var(--text-primary)',
                  outline: 'none', fontFamily: 'inherit',
                }}
                onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
              />
            </div>

            {error && (
              <div style={{
                background: 'var(--danger-bg)', border: '1px solid rgba(224,82,82,0.2)',
                borderRadius: '10px', padding: '10px 14px', marginBottom: '16px',
                fontSize: '13px', color: 'var(--danger)',
              }}>{error}</div>
            )}

            <button
              type="submit" disabled={loading}
              style={{
                width: '100%', padding: '12px', fontSize: '14px', fontWeight: '500',
                background: loading ? 'var(--accent-dim)' : 'var(--accent)',
                color: '#0e0e11', border: 'none', borderRadius: '10px',
                cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit',
                transition: 'opacity 0.2s',
              }}
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px', color: 'var(--text-secondary)' }}>
          Already have an account?{' '}
          <Link href="/login" style={{ color: 'var(--accent)', textDecoration: 'none' }}>Log in</Link>
        </p>
      </div>
    </div>
  );
}

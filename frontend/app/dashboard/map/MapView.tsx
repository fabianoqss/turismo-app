'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { MapContainer, TileLayer, Marker, Popup, Circle, CircleMarker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { distanceMeters } from '@/lib/geo';

delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const CENTER: [number, number] = [-7.115, -34.863];

// "Nearby" notification thresholds, in meters.
const NEARBY_RADIUS_M = 1000;
const EXIT_RADIUS_M = 1500;
const TOAST_DURATION_MS = 8000;

const statusBoxStyle: React.CSSProperties = {
  position: 'absolute', bottom: '10px', left: '10px', zIndex: 1000,
  background: 'var(--bg-card)', border: '1px solid var(--border)',
  borderRadius: '8px', padding: '6px 12px', fontSize: '12px',
  color: 'var(--text-muted)', fontFamily: "'DM Mono', monospace",
};

const toastStackStyle: React.CSSProperties = {
  position: 'absolute', top: '10px', right: '10px', zIndex: 1000,
  display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '280px',
};

const toastStyle: React.CSSProperties = {
  background: 'var(--bg-card)', border: '1px solid var(--border)',
  borderRadius: '10px', padding: '12px 14px', fontSize: '13px',
  color: 'var(--text-primary)', boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
};

const categoryColors: Record<string, { bg: string; text: string }> = {
  praia: { bg: 'rgba(111,191,115,0.12)', text: 'var(--accent)' },
  cultura: { bg: 'rgba(124,207,136,0.12)', text: 'var(--success)' },
  gastronomia: { bg: 'rgba(232,160,71,0.12)', text: '#e8a047' },
  natureza: { bg: 'rgba(76,175,130,0.12)', text: '#4caf82' },
  aventura: { bg: 'rgba(217,92,92,0.12)', text: 'var(--danger)' },
};

type Roteiro = {
  id: number;
  name: string;
  category: string;
  latitude: number;
  longitude: number;
};

type Toast = {
  toastId: number;
  roteiroId: number;
  name: string;
  category: string;
  distance: number;
};

function UserLocation({ onPosition }: { onPosition: (pos: { lat: number; lng: number }) => void }) {
  const [position, setPosition] = useState<{ lat: number; lng: number; accuracy: number } | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!('geolocation' in navigator)) {
      setError('Geolocation is not supported by this browser.');
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      pos => {
        setError('');
        const next = { lat: pos.coords.latitude, lng: pos.coords.longitude, accuracy: pos.coords.accuracy };
        setPosition(next);
        onPosition(next);
      },
      err => setError(err.message || 'Unable to retrieve your location.'),
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 10000 },
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [onPosition]);

  if (error) return <div style={statusBoxStyle}>{error}</div>;
  if (!position) return <div style={statusBoxStyle}>Locating…</div>;

  return (
    <>
      <CircleMarker
        center={[position.lat, position.lng]}
        radius={8}
        pathOptions={{ color: '#3a7bd5', fillColor: '#3a7bd5', fillOpacity: 0.9 }}
      >
        <Popup>You are here</Popup>
      </CircleMarker>
      <Circle
        center={[position.lat, position.lng]}
        radius={position.accuracy}
        pathOptions={{ color: '#3a7bd5', fillColor: '#3a7bd5', fillOpacity: 0.1 }}
      />
    </>
  );
}

export default function MapView({ roteiros }: { roteiros: Roteiro[] }) {
  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nearbyIdsRef = useRef<Set<number>>(new Set());
  const toastCounterRef = useRef(0);

  const handlePosition = useCallback((pos: { lat: number; lng: number }) => {
    setPosition(pos);
  }, []);

  useEffect(() => {
    if (!position) return;

    const newToasts: Toast[] = [];

    for (const r of roteiros) {
      if (r.latitude === 0 && r.longitude === 0) continue;
      const dist = distanceMeters(position.lat, position.lng, r.latitude, r.longitude);
      const isNearby = nearbyIdsRef.current.has(r.id);

      if (dist <= NEARBY_RADIUS_M && !isNearby) {
        nearbyIdsRef.current.add(r.id);
        toastCounterRef.current += 1;
        newToasts.push({
          toastId: toastCounterRef.current,
          roteiroId: r.id,
          name: r.name,
          category: r.category,
          distance: dist,
        });
      } else if (dist > EXIT_RADIUS_M && isNearby) {
        nearbyIdsRef.current.delete(r.id);
      }
    }

    if (newToasts.length > 0) {
      setToasts(prev => [...prev, ...newToasts]);
      newToasts.forEach(t => {
        setTimeout(() => {
          setToasts(prev => prev.filter(x => x.toastId !== t.toastId));
        }, TOAST_DURATION_MS);
      });
    }
  }, [position, roteiros]);

  return (
    <div style={{ position: 'relative', height: '100%', width: '100%' }}>
      <MapContainer center={CENTER} zoom={14} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {roteiros
          .filter(r => r.latitude !== 0 || r.longitude !== 0)
          .map(r => (
            <Marker key={r.id} position={[r.latitude, r.longitude]}>
              <Popup>
                <strong>{r.name}</strong>
                <br />
                <span style={{ textTransform: 'capitalize' }}>{r.category}</span>
                <br />
                <Link href={`/dashboard/roteiros/${r.id}`}>View details →</Link>
              </Popup>
            </Marker>
          ))}
        <UserLocation onPosition={handlePosition} />
      </MapContainer>

      {toasts.length > 0 && (
        <div style={toastStackStyle}>
          {toasts.map(t => {
            const cc = categoryColors[t.category] || { bg: 'rgba(255,255,255,0.06)', text: 'var(--text-secondary)' };
            return (
              <div key={t.toastId} style={toastStyle}>
                <div style={{ marginBottom: '8px' }}>📍 You&apos;re near <strong>{t.name}</strong></div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{
                    fontSize: '11px', padding: '3px 9px', borderRadius: '100px',
                    background: cc.bg, color: cc.text, fontWeight: 500, textTransform: 'capitalize',
                  }}>
                    {t.category}
                  </span>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: "'DM Mono', monospace" }}>
                    {Math.round(t.distance)} m away
                  </span>
                </div>
                <Link href={`/dashboard/roteiros/${t.roteiroId}`} style={{ fontSize: '12px', color: 'var(--accent)', textDecoration: 'none', marginTop: '8px', display: 'inline-block' }}>
                  View details →
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

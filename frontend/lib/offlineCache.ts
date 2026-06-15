const PREFIX = 'appturismo:cache:';

export type CacheEntry<T> = {
  data: T;
  cachedAt: number;
};

export function setCache<T>(key: string, data: T): void {
  if (typeof window === 'undefined') return;
  try {
    const entry: CacheEntry<T> = { data, cachedAt: Date.now() };
    window.localStorage.setItem(PREFIX + key, JSON.stringify(entry));
  } catch {
    // storage unavailable or full - ignore
  }
}

export function getCache<T>(key: string): CacheEntry<T> | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(PREFIX + key);
    if (!raw) return null;
    return JSON.parse(raw) as CacheEntry<T>;
  } catch {
    return null;
  }
}

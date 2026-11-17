/**
 * Cache shared by the public catalogues (products + events).
 *
 * Results are kept in memory and in localStorage for CACHE_TTL_MS, so revisiting a page,
 * switching tabs or reloading does not read Firestore again. Admin screens call
 * clearCatalogCache() after any change so the admin always sees fresh data.
 */

export const PAGE_SIZE = 20
export const CACHE_TTL_MS = 30 * 60 * 1000 // 30 minutes

const STORAGE_PREFIX = 'able-catalog:'
const CACHE_PREFIX = `${STORAGE_PREFIX}v2:`
const memoryCache = new Map()
const inflight = new Map()

export function readCache(key) {
  const fromMemory = memoryCache.get(key)
  if (fromMemory) {
    if (Date.now() - fromMemory.savedAt < CACHE_TTL_MS) return fromMemory
    memoryCache.delete(key)
  }

  try {
    const raw = localStorage.getItem(CACHE_PREFIX + key)
    if (!raw) return null

    const entry = JSON.parse(raw)
    if (entry && Date.now() - entry.savedAt < CACHE_TTL_MS) {
      memoryCache.set(key, entry)
      return entry
    }
    localStorage.removeItem(CACHE_PREFIX + key)
  } catch {
    // Corrupt entry or storage unavailable - behave as a cache miss.
  }
  return null
}

// `savedAt` is kept when more pages are appended, so the TTL counts from the first read.
export function writeCache(key, value, savedAt = Date.now()) {
  const entry = { savedAt, value }
  memoryCache.set(key, entry)
  try {
    localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(entry))
  } catch {
    // Storage full / blocked - the in-memory copy still works for this session.
  }
}

export function clearCatalogCache() {
  memoryCache.clear()
  inflight.clear()
  try {
    Object.keys(localStorage)
      .filter((key) => key.startsWith(STORAGE_PREFIX))
      .forEach((key) => localStorage.removeItem(key))
  } catch {
    // ignore
  }
}

/**
 * Share one request between callers asking for the same thing at the same time
 * (also stops React StrictMode's double effect from reading twice in development).
 */
export function once(key, load) {
  if (inflight.has(key)) return inflight.get(key)
  const promise = load().finally(() => inflight.delete(key))
  inflight.set(key, promise)
  return promise
}

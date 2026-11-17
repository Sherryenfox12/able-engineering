import { Timestamp, collection, getDocs, limit, orderBy, query, startAfter } from 'firebase/firestore'
import { db } from '../firebase'
import { PAGE_SIZE, once, readCache, writeCache } from './catalogCache'

/**
 * Read-only events for the public /event page.
 * Newest first, 20 per page, cached like the product catalogue (see catalogCache.js).
 * Each event stores title / summary / description in every language; the page picks one.
 */

const EVENT_COLLECTION = 'Event'
const FEED_KEY = 'event-feed'

export const EVENT_LANGUAGES = ['en', 'zh', 'id']

function texts(value) {
  const source = value && typeof value === 'object' ? value : {}
  return { en: String(source.en ?? ''), zh: String(source.zh ?? ''), id: String(source.id ?? '') }
}

/** Text in the visitor's language, falling back to English, then to any language that has it. */
export function pickText(value, lang) {
  if (!value) return ''
  return value[lang]?.trim() || value.en?.trim() || EVENT_LANGUAGES.map((code) => value[code]?.trim()).find(Boolean) || ''
}

function toEvent(docSnap) {
  const data = docSnap.data()

  return {
    id: docSnap.id,
    title: texts(data.title),
    summary: texts(data.summary),
    description: texts(data.description),
    images: (data.images || []).filter((img) => img?.url).map((img) => ({ url: img.url })),
    createdAt: data.createdAt
      ? { seconds: data.createdAt.seconds, nanoseconds: data.createdAt.nanoseconds }
      : null,
  }
}

async function fetchPage(cursor) {
  const constraints = [orderBy('createdAt', 'desc')]
  if (cursor) constraints.push(startAfter(new Timestamp(cursor.seconds, cursor.nanoseconds)))
  // One extra document tells us whether another page exists without a wasted empty read.
  constraints.push(limit(PAGE_SIZE + 1))

  const snapshot = await getDocs(query(collection(db, EVENT_COLLECTION), ...constraints))
  const events = snapshot.docs.map(toEvent)

  const hasMore = events.length > PAGE_SIZE
  return { items: hasMore ? events.slice(0, PAGE_SIZE) : events, hasMore }
}

/** Cached first page ({ items, hasMore }), or null when nothing fresh is cached. */
export function peekEventFeed() {
  return readCache(FEED_KEY)?.value ?? null
}

/** Newest event for the home page - from the same feed cache as /event. */
export async function getLatestEvent() {
  const feed = await getEventFeed()
  return feed.items[0] ?? null
}

/** First page of events - from cache when possible. */
export function getEventFeed() {
  const cached = readCache(FEED_KEY)
  if (cached) return Promise.resolve(cached.value)

  return once(FEED_KEY, async () => {
    const page = await fetchPage(null)
    writeCache(FEED_KEY, page)
    return page
  })
}

/** The page after `feed`. Resolves to the whole feed so far: { items, hasMore }. */
export function getMoreEventFeed(feed) {
  const cursor = feed.items[feed.items.length - 1]?.createdAt
  if (!feed.hasMore || !cursor) return Promise.resolve({ ...feed, hasMore: false })

  return once(`${FEED_KEY}:after:${cursor.seconds}.${cursor.nanoseconds}`, async () => {
    const page = await fetchPage(cursor)

    const seen = new Set(feed.items.map((item) => item.id))
    const merged = {
      items: [...feed.items, ...page.items.filter((item) => !seen.has(item.id))],
      hasMore: page.hasMore,
    }

    writeCache(FEED_KEY, merged, readCache(FEED_KEY)?.savedAt)
    return merged
  })
}

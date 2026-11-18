import {
  Timestamp,
  collection,
  getCountFromServer,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  where,
} from 'firebase/firestore'
import { db } from '../firebase'
import { PAGE_SIZE, clearCatalogCache, once, readCache, writeCache } from './catalogCache'

/**
 * Read-only product catalogue for the public Products page.
 *
 * Cost control:
 *  - "All products" loads 20 at a time from Firestore, newest first.
 *  - A specific category loads that category once (no composite index needed),
 *    then pages of 20 are sliced in memory / from cache.
 *  - Results are cached (see catalogCache.js) and identical in-flight requests share one read.
 */

const CATEGORY_COLLECTION = 'ProductCategory'
const PRODUCT_COLLECTION = 'Product'

// Admin screens import this from here.
export { clearCatalogCache }

/* ------------------------------------------------------------------ */
/* Categories (only those that actually contain products)              */
/* ------------------------------------------------------------------ */

/** Returns [{ id, name, count }] sorted by the admin's order, empty categories removed. */
export function getCategories() {
  const cached = readCache('categories')
  if (cached) return Promise.resolve(cached.value)

  return once('categories', async () => {
    const snapshot = await getDocs(collection(db, CATEGORY_COLLECTION))
    const categories = snapshot.docs
      .map((item) => ({ id: item.id, ...item.data() }))
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0) || String(a.name).localeCompare(String(b.name)))

    const counts = await Promise.all(
      categories.map(async (category) => {
        const result = await getCountFromServer(
          query(collection(db, PRODUCT_COLLECTION), where('categoryId', '==', category.id)),
        )
        return result.data().count
      }),
    )

    const value = categories
      .map((category, index) => ({ id: category.id, name: category.name, count: counts[index] }))
      .filter((category) => category.count > 0)

    writeCache('categories', value)
    return value
  })
}

/* ------------------------------------------------------------------ */
/* Products feed (paged, newest first)                                 */
/* ------------------------------------------------------------------ */

function toProduct(docSnap) {
  const data = docSnap.data()

  const legacyDescription = [data.summary, ...(Array.isArray(data.highlights) ? data.highlights : [])]
    .map((line) => String(line ?? '').trim())
    .filter(Boolean)
    .join('\n')

  return {
    id: docSnap.id,
    categoryId: data.categoryId || '',
    name: data.name || '',
    condition: data.condition || '',
    description: data.description ?? legacyDescription,
    featured: Boolean(data.featured),
    images: (data.images || []).filter((img) => img?.url).map((img) => ({ url: img.url })),
    createdAt: data.createdAt
      ? { seconds: data.createdAt.seconds, nanoseconds: data.createdAt.nanoseconds }
      : null,
  }
}

function createdAtValue(product) {
  if (!product?.createdAt) return 0
  return product.createdAt.seconds * 1e9 + product.createdAt.nanoseconds
}

function sortNewestFirst(products) {
  return [...products].sort((a, b) => createdAtValue(b) - createdAtValue(a))
}

function slicePage(all, offset = 0) {
  const items = all.slice(offset, offset + PAGE_SIZE)
  return { items, hasMore: offset + PAGE_SIZE < all.length }
}

const feedKey = (categoryId) => `feed:${categoryId || 'all'}`
const categoryListKey = (categoryId) => `category-list:${categoryId}`

export function peekCategories() {
  return readCache('categories')?.value ?? null
}

export function peekFeed(categoryId) {
  return readCache(feedKey(categoryId))?.value ?? null
}

/** All products for one category - one equality query, no composite index required. */
async function loadCategoryList(categoryId) {
  const key = categoryListKey(categoryId)
  const cached = readCache(key)
  if (cached) return cached.value

  return once(key, async () => {
    const snapshot = await getDocs(
      query(collection(db, PRODUCT_COLLECTION), where('categoryId', '==', categoryId)),
    )
    const value = sortNewestFirst(snapshot.docs.map(toProduct))
    writeCache(key, value)
    return value
  })
}

/** "All products" page from Firestore - single-field orderBy, works without a composite index. */
async function fetchAllPage(cursor) {
  const constraints = [orderBy('createdAt', 'desc')]
  if (cursor) constraints.push(startAfter(new Timestamp(cursor.seconds, cursor.nanoseconds)))
  constraints.push(limit(PAGE_SIZE + 1))

  const snapshot = await getDocs(query(collection(db, PRODUCT_COLLECTION), ...constraints))
  const products = snapshot.docs.map(toProduct)
  const hasMore = products.length > PAGE_SIZE
  return { items: hasMore ? products.slice(0, PAGE_SIZE) : products, hasMore }
}

/**
 * Newest products whose category name contains `name` (case-insensitive),
 * e.g. "machine" matches "Machine", "machine", "Machine for rent".
 * Resolves to { category, products } — category is the sole match when only one
 * category matched (for the "view all" link), otherwise null.
 */
export async function getLatestByCategoryName(name, count = 3) {
  const needle = String(name).toLowerCase()
  const categories = await getCategories()
  const matched = categories.filter((c) => String(c.name).toLowerCase().includes(needle))
  if (matched.length === 0) return { category: null, products: [] }

  const lists = await Promise.all(matched.map((c) => loadCategoryList(c.id)))
  const products = sortNewestFirst(lists.flat()).slice(0, count)
  return { category: matched.length === 1 ? matched[0] : null, products }
}

/**
 * First page for a category (or all products when categoryId is empty).
 * Resolves to { items, hasMore } - from cache when possible.
 */
export function getFeed(categoryId) {
  const key = feedKey(categoryId)
  const cached = readCache(key)
  if (cached) return Promise.resolve(cached.value)

  return once(key, async () => {
    const page = categoryId
      ? slicePage(await loadCategoryList(categoryId), 0)
      : await fetchAllPage(null)
    writeCache(key, page)
    return page
  })
}

/**
 * Next page. Resolves to the whole feed so far: { items, hasMore }.
 */
export function getMoreFeed(categoryId, feed) {
  const key = feedKey(categoryId)
  if (!feed.hasMore) return Promise.resolve({ ...feed, hasMore: false })

  // Category feeds page from the already-loaded sorted list - no extra Firestore reads.
  if (categoryId) {
    return once(`${key}:more:${feed.items.length}`, async () => {
      const all = await loadCategoryList(categoryId)
      const page = slicePage(all, feed.items.length)
      const seen = new Set(feed.items.map((item) => item.id))
      const merged = {
        items: [...feed.items, ...page.items.filter((item) => !seen.has(item.id))],
        hasMore: page.hasMore,
      }
      const existing = readCache(key)
      writeCache(key, merged, existing?.savedAt)
      return merged
    })
  }

  const last = feed.items[feed.items.length - 1]
  const cursor = last?.createdAt
  if (!cursor) return Promise.resolve({ ...feed, hasMore: false })

  return once(`${key}:after:${cursor.seconds}.${cursor.nanoseconds}`, async () => {
    const page = await fetchAllPage(cursor)
    const seen = new Set(feed.items.map((item) => item.id))
    const merged = {
      items: [...feed.items, ...page.items.filter((item) => !seen.has(item.id))],
      hasMore: page.hasMore,
    }
    const existing = readCache(key)
    writeCache(key, merged, existing?.savedAt)
    return merged
  })
}

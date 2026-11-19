import { collection, deleteDoc, doc, getDocs, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { clearCatalogCache } from './catalogCache'
import { deleteStoragePath, removedPhotoPaths, uploadNewPhotos } from './photoStorage'

export const EVENT_COLLECTION = 'Event'
export const EVENT_STORAGE_FOLDER = 'events'
export const MAX_EVENT_PHOTOS = 5

export const EVENT_LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'zh', label: '中文' },
  { code: 'id', label: 'Indonesia' },
]

export const EMPTY_EVENT_TEXTS = {
  en: { title: '', description: '' },
  zh: { title: '', description: '' },
  id: { title: '', description: '' },
}

/** The admin editor works with { en: { title, description }, zh: {...}, id: {...} }. */
export function eventToTexts(event) {
  const result = {}
  EVENT_LANGUAGES.forEach(({ code }) => {
    result[code] = {
      title: event?.title?.[code] ?? '',
      description: event?.description?.[code] ?? '',
    }
  })
  return result
}

/** A title to show in admin lists: English first, otherwise whichever language has one. */
export function eventDisplayTitle(event) {
  return (
    event.title?.en?.trim() ||
    EVENT_LANGUAGES.map(({ code }) => event.title?.[code]?.trim()).find(Boolean) ||
    'Untitled event'
  )
}

export async function listEvents() {
  const snapshot = await getDocs(collection(db, EVENT_COLLECTION))

  const events = snapshot.docs.map((item) => {
    const data = item.data()
    return { id: item.id, ...data, images: (data.images || []).filter((img) => img?.url) }
  })

  // Newest first (documents saved moments ago may not have their server timestamp yet).
  events.sort((a, b) => (b.createdAt?.seconds ?? Infinity) - (a.createdAt?.seconds ?? Infinity))
  return events
}

/** Reserve an id up front so photos can be uploaded before the document exists. */
export function newEventId() {
  return doc(collection(db, EVENT_COLLECTION)).id
}

export async function deleteEvent(event) {
  const paths = (event.images || []).map((img) => img.path).filter(Boolean)
  await deleteDoc(doc(db, EVENT_COLLECTION, event.id))
  clearCatalogCache()
  await Promise.all(paths.map(deleteStoragePath))
}

/**
 * Create or update an event with its photos in one flow (same approach as products):
 * upload new photos -> write the document once -> delete photos that were removed,
 * rolling back the uploads if anything fails before the document is written.
 */
export async function saveEvent({ eventId, existing, texts, photos, onPhotoStatus }) {
  const clean = (field) =>
    Object.fromEntries(EVENT_LANGUAGES.map(({ code }) => [code, String(texts[code]?.[field] ?? '').trim()]))

  const title = clean('title')
  if (!Object.values(title).some(Boolean)) {
    throw new Error('Please enter a title in at least one language.')
  }
  if (photos.length > MAX_EVENT_PHOTOS) {
    throw new Error(`Only ${MAX_EVENT_PHOTOS} photos are allowed.`)
  }

  const uploadedPaths = []

  try {
    const images = await uploadNewPhotos(photos, {
      folder: EVENT_STORAGE_FOLDER,
      id: eventId,
      uploadedPaths,
      onPhotoStatus,
    })

    const fields = {
      title,
      description: clean('description'),
      images,
      updatedAt: serverTimestamp(),
    }

    if (existing) {
      await updateDoc(doc(db, EVENT_COLLECTION, eventId), fields)
    } else {
      await setDoc(doc(db, EVENT_COLLECTION, eventId), { ...fields, createdAt: serverTimestamp() })
    }
  } catch (err) {
    await Promise.all(uploadedPaths.map(deleteStoragePath))
    throw err
  }

  clearCatalogCache()
  await Promise.all(removedPhotoPaths(existing?.images, photos).map(deleteStoragePath))
}

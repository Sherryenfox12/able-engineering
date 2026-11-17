import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  writeBatch,
} from 'firebase/firestore'
import { deleteObject, listAll, ref } from 'firebase/storage'
import { db, storage } from '../firebase'
import { clearCatalogCache } from './productCatalog'
import { deleteStoragePath, removedPhotoPaths, uploadNewPhotos } from './photoStorage'

export const CATEGORY_COLLECTION = 'ProductCategory'
export const PRODUCT_COLLECTION = 'Product'
export const MAX_PRODUCT_PHOTOS = 3

/** Storage folder name from category name, e.g. "Machine" -> products/Machine */
export function toStorageFolder(name) {
  return String(name ?? '')
    .trim()
    .replace(/[\\/#?[\]*]/g, '-')
    .replace(/\s+/g, ' ')
}

/* ------------------------------------------------------------------ */
/* Storage helpers                                                     */
/* ------------------------------------------------------------------ */

async function deleteStorageFolder(folderPath) {
  try {
    const result = await listAll(ref(storage, folderPath))
    await Promise.all([
      ...result.items.map((item) => deleteObject(item).catch(() => {})),
      ...result.prefixes.map((prefix) => deleteStorageFolder(prefix.fullPath)),
    ])
  } catch {
    // Listing may be blocked by rules - known paths are deleted separately.
  }
}

/* ------------------------------------------------------------------ */
/* Categories                                                          */
/* ------------------------------------------------------------------ */

export async function listCategories() {
  const snapshot = await getDocs(collection(db, CATEGORY_COLLECTION))
  const list = snapshot.docs.map((item) => ({ id: item.id, ...item.data() }))
  list.sort((a, b) => (a.order ?? 0) - (b.order ?? 0) || String(a.name).localeCompare(String(b.name)))
  return list
}

export async function createCategory({ name }) {
  const trimmed = String(name ?? '').trim()
  if (!trimmed) throw new Error('Category name is required.')

  const storageFolder = toStorageFolder(trimmed)
  if (!storageFolder) throw new Error('Category name is invalid.')

  const existing = await listCategories()
  const duplicate = existing.some(
    (c) => String(c.storageFolder).toLowerCase() === storageFolder.toLowerCase(),
  )
  if (duplicate) throw new Error('A category with this name already exists.')

  const nextOrder = existing.reduce((max, c) => Math.max(max, c.order ?? 0), -1) + 1

  const docRef = await addDoc(collection(db, CATEGORY_COLLECTION), {
    name: trimmed,
    storageFolder,
    order: nextOrder,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })

  clearCatalogCache()
  return docRef.id
}

export async function updateCategory(categoryId, { name }) {
  const trimmed = String(name ?? '').trim()
  if (!trimmed) throw new Error('Category name is required.')

  // storageFolder is intentionally left unchanged so existing photos keep working.
  await updateDoc(doc(db, CATEGORY_COLLECTION, categoryId), {
    name: trimmed,
    updatedAt: serverTimestamp(),
  })
  clearCatalogCache()
}

export async function deleteCategory(category) {
  const productsSnap = await getDocs(
    query(collection(db, PRODUCT_COLLECTION), where('categoryId', '==', category.id)),
  )

  const batch = writeBatch(db)
  const imagePaths = []

  productsSnap.docs.forEach((productDoc) => {
    ;(productDoc.data().images || []).forEach((img) => {
      if (img?.path) imagePaths.push(img.path)
    })
    batch.delete(productDoc.ref)
  })

  batch.delete(doc(db, CATEGORY_COLLECTION, category.id))
  await batch.commit()
  clearCatalogCache()

  await Promise.all(imagePaths.map(deleteStoragePath))
  // Sweep the folder too, so stray files from older uploads are removed.
  await deleteStorageFolder(`products/${category.storageFolder}`)
}

/* ------------------------------------------------------------------ */
/* Products                                                            */
/* ------------------------------------------------------------------ */

function normalizeProduct(id, data) {
  // Older documents used summary + highlights; fold them into description.
  const legacyDescription = [data.summary, ...(Array.isArray(data.highlights) ? data.highlights : [])]
    .map((line) => String(line ?? '').trim())
    .filter(Boolean)
    .join('\n')

  return {
    id,
    ...data,
    description: data.description ?? legacyDescription,
    images: (data.images || []).filter((img) => img?.url),
  }
}

export async function listProductsByCategory(categoryId) {
  const snapshot = await getDocs(
    query(collection(db, PRODUCT_COLLECTION), where('categoryId', '==', categoryId)),
  )

  const products = snapshot.docs.map((item) => normalizeProduct(item.id, item.data()))
  products.sort((a, b) => String(a.name || '').localeCompare(String(b.name || '')))
  return products
}

/** Reserve a product id up front so photos can be uploaded before the document exists. */
export function newProductId() {
  return doc(collection(db, PRODUCT_COLLECTION)).id
}

export async function deleteProduct(product) {
  const paths = (product.images || []).map((img) => img.path).filter(Boolean)
  await deleteDoc(doc(db, PRODUCT_COLLECTION, product.id))
  clearCatalogCache()
  await Promise.all(paths.map(deleteStoragePath))
}

/**
 * Create or update a product together with its photos, in one flow:
 *   1. upload the new (already compressed) photos
 *   2. write the Firestore document once
 *   3. delete photos the admin removed
 * If step 1 or 2 fails, anything uploaded in this run is rolled back, so Storage
 * never ends up with files the product does not reference.
 *
 * `photos` is the final ordered list: { source: 'existing' | 'new', key, url?, path?, size?, file? }
 */
export async function saveProduct({ category, productId, existing, form, photos, onPhotoStatus }) {
  const name = String(form.name ?? '').trim()
  if (!name) throw new Error('Product name is required.')
  if (photos.length > MAX_PRODUCT_PHOTOS) {
    throw new Error(`Only ${MAX_PRODUCT_PHOTOS} photos are allowed.`)
  }

  const uploadedPaths = []

  try {
    const images = await uploadNewPhotos(photos, {
      folder: `products/${category.storageFolder}`,
      id: productId,
      uploadedPaths,
      onPhotoStatus,
    })

    const fields = {
      name,
      condition: String(form.condition ?? '').trim(),
      description: String(form.description ?? '').trim(),
      featured: Boolean(form.featured),
      images,
      updatedAt: serverTimestamp(),
    }

    if (existing) {
      await updateDoc(doc(db, PRODUCT_COLLECTION, productId), fields)
    } else {
      await setDoc(doc(db, PRODUCT_COLLECTION, productId), {
        ...fields,
        categoryId: category.id,
        categoryFolder: category.storageFolder,
        createdAt: serverTimestamp(),
      })
    }
  } catch (err) {
    await Promise.all(uploadedPaths.map(deleteStoragePath))
    throw err
  }

  clearCatalogCache()

  // Saved. Remove photos that were taken off the product.
  await Promise.all(removedPhotoPaths(existing?.images, photos).map(deleteStoragePath))
}

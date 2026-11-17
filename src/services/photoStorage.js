import { deleteObject, getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { storage } from '../firebase'

/** Delete one Storage file. Missing files / permission errors are ignored on purpose. */
export async function deleteStoragePath(path) {
  if (!path) return
  try {
    await deleteObject(ref(storage, path))
  } catch {
    // Already gone / not permitted - nothing else to do.
  }
}

async function uploadOne(folder, id, file) {
  const random = Math.random().toString(36).slice(2, 8)
  const path = `${folder}/${id}_${Date.now()}_${random}.jpg`
  const storageRef = ref(storage, path)

  await uploadBytes(storageRef, file, {
    contentType: 'image/jpeg',
    cacheControl: 'public,max-age=31536000',
  })
  const url = await getDownloadURL(storageRef)

  return { url, path, size: file.size }
}

/**
 * Turn the editor's photo list into the `images` array to store in Firestore.
 *
 * Existing photos are kept as-is, new (already compressed) ones are uploaded to `folder`.
 * Every path uploaded is pushed onto `uploadedPaths` (supplied by the caller) so the caller
 * can roll back if the Firestore write that follows fails. All uploads are awaited before
 * returning or throwing, so nothing can land in Storage after a rollback has run.
 *
 * photos: [{ source: 'existing' | 'new', key, url?, path?, size?, file? }]
 */
export async function uploadNewPhotos(photos, { folder, id, uploadedPaths, onPhotoStatus }) {
  const results = await Promise.allSettled(
    photos.map(async (photo) => {
      if (photo.source === 'existing') {
        return { url: photo.url, path: photo.path, size: photo.size ?? 0 }
      }

      onPhotoStatus?.(photo.key, 'uploading')
      const uploaded = await uploadOne(folder, id, photo.file)
      uploadedPaths.push(uploaded.path)
      onPhotoStatus?.(photo.key, 'ready')
      return uploaded
    }),
  )

  const failure = results.find((result) => result.status === 'rejected')
  if (failure) throw failure.reason

  return results.map((result) => result.value)
}

/** Storage paths that were on the saved item before but are no longer in the final photo list. */
export function removedPhotoPaths(existingImages, photos) {
  const kept = new Set(photos.filter((p) => p.source === 'existing').map((p) => p.path))
  return (existingImages || []).map((img) => img.path).filter((path) => path && !kept.has(path))
}

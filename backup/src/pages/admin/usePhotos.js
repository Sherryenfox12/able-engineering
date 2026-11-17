import { useEffect, useRef, useState } from 'react'
import { compressImage } from '../../utils/compressImage'

let photoCounter = 0
const nextPhotoKey = () => `new-${Date.now()}-${photoCounter++}`

function toExistingPhotos(images) {
  return (images || []).map((img, index) => ({
    key: `existing-${index}-${img.path}`,
    source: 'existing',
    url: img.url,
    path: img.path,
    size: img.size,
    status: 'ready',
  }))
}

/**
 * State for a photo editor (products: 3, events: 5).
 *
 * Photos are picked and compressed straight away, each with its own status
 * ('compressing' | 'ready' | 'uploading'), but are only uploaded when the admin saves.
 * Preview URLs are released when the editor closes.
 */
export function usePhotos(initialImages, max) {
  const [photos, setPhotos] = useState(() => toExistingPhotos(initialImages))
  const [photoError, setPhotoError] = useState('')
  const [photosDirty, setPhotosDirty] = useState(false)

  const photosRef = useRef(photos)
  useEffect(() => {
    photosRef.current = photos
  }, [photos])
  useEffect(
    () => () => {
      photosRef.current.forEach((p) => {
        if (p.source === 'new' && p.url) URL.revokeObjectURL(p.url)
      })
    },
    [],
  )

  const addFiles = (fileList) => {
    const files = Array.from(fileList || [])
    if (files.length === 0) return

    const room = max - photos.length
    const accepted = files.slice(0, Math.max(0, room))
    setPhotoError(files.length > accepted.length ? `Only ${max} photos are allowed.` : '')
    if (accepted.length === 0) return

    setPhotosDirty(true)

    // Placeholders appear immediately; only their own tile shows "Compressing".
    const placeholders = accepted.map((file) => ({
      key: nextPhotoKey(),
      source: 'new',
      url: '',
      size: 0,
      originalSize: file.size,
      status: 'compressing',
    }))
    setPhotos((prev) => [...prev, ...placeholders])

    accepted.forEach(async (file, index) => {
      const { key } = placeholders[index]
      try {
        const compressed = await compressImage(file)
        const url = URL.createObjectURL(compressed)
        setPhotos((prev) =>
          prev.map((p) => (p.key === key ? { ...p, file: compressed, url, size: compressed.size, status: 'ready' } : p)),
        )
      } catch (err) {
        setPhotos((prev) => prev.filter((p) => p.key !== key))
        setPhotoError(err?.message || 'Could not process that photo.')
      }
    })
  }

  const removePhoto = (key) => {
    setPhotosDirty(true)
    setPhotos((prev) => {
      const target = prev.find((p) => p.key === key)
      if (target?.source === 'new' && target.url) URL.revokeObjectURL(target.url)
      return prev.filter((p) => p.key !== key)
    })
  }

  const setStatus = (key, status) =>
    setPhotos((prev) => prev.map((p) => (p.key === key ? { ...p, status } : p)))

  const resetUploading = () =>
    setPhotos((prev) => prev.map((p) => (p.status === 'uploading' ? { ...p, status: 'ready' } : p)))

  return {
    photos,
    photoError,
    photosDirty,
    compressing: photos.some((p) => p.status === 'compressing'),
    addFiles,
    removePhoto,
    setStatus,
    resetUploading,
  }
}

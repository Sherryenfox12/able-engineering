const MAX_BYTES = 1024 * 1024 // hard limit: 1MB
const MAX_DIMENSION = 1600 // longest edge, px
const MIN_DIMENSION = 640
const START_QUALITY = 0.8
const MIN_QUALITY = 0.45

function loadImage(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      URL.revokeObjectURL(url)
      resolve(img)
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error(`Could not read "${file.name}". Please use a JPG, PNG or WebP image.`))
    }
    img.src = url
  })
}

function canvasToBlob(canvas, quality) {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('Image compression failed.'))),
      'image/jpeg',
      quality,
    )
  })
}

function drawScaled(img, maxDimension) {
  const scale = Math.min(1, maxDimension / Math.max(img.width, img.height))
  const width = Math.max(1, Math.round(img.width * scale))
  const height = Math.max(1, Math.round(img.height * scale))

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height

  const ctx = canvas.getContext('2d')
  // JPEG has no transparency - paint white first so transparent PNGs don't turn black.
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, width, height)
  ctx.drawImage(img, 0, 0, width, height)
  return canvas
}

function toJpegFile(blob, originalName) {
  const base = originalName.replace(/\.[^.]+$/, '') || 'photo'
  return new File([blob], `${base}.jpg`, { type: 'image/jpeg', lastModified: Date.now() })
}

/**
 * Compress an image before upload. Always returns a JPEG File that is
 * at most 1MB (usually a few hundred KB).
 */
export async function compressImage(file, { maxBytes = MAX_BYTES } = {}) {
  if (!file?.type?.startsWith('image/')) {
    throw new Error(`"${file?.name ?? 'File'}" is not an image.`)
  }

  const img = await loadImage(file)

  let dimension = MAX_DIMENSION
  let smallest = null

  while (dimension >= MIN_DIMENSION) {
    const canvas = drawScaled(img, dimension)

    for (let quality = START_QUALITY; quality >= MIN_QUALITY; quality -= 0.07) {
      const blob = await canvasToBlob(canvas, quality)
      if (!smallest || blob.size < smallest.size) smallest = blob

      if (blob.size <= maxBytes) {
        // An already-optimised JPEG can be smaller than our re-encode - keep whichever is smaller.
        if (file.type === 'image/jpeg' && file.size <= blob.size) return file
        return toJpegFile(blob, file.name)
      }
    }

    dimension = Math.round(dimension * 0.75)
  }

  if (smallest && smallest.size <= maxBytes) return toJpegFile(smallest, file.name)
  throw new Error(`"${file.name}" is still over 1MB after compression. Please use a smaller photo.`)
}

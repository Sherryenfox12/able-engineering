import { useEffect, useState } from 'react'
import { MAX_PRODUCT_PHOTOS, newProductId, saveProduct } from '../../services/productAdmin'
import PhotoGrid from './PhotoGrid'
import { usePhotos } from './usePhotos'

const CONDITIONS = ['Used', 'Parts', 'New']

/**
 * Add / edit a product. Photos are picked and compressed here, but only uploaded
 * when the admin presses Save - so a new product can have photos from the start,
 * and cancelling never leaves files in Storage.
 */
function ProductModal({ category, product, onClose, onSaved }) {
  const isEdit = Boolean(product)

  const [productId] = useState(() => product?.id || newProductId())
  const [name, setName] = useState(product?.name || '')
  const [condition, setCondition] = useState(product?.condition || 'Used')
  const [description, setDescription] = useState(product?.description || '')
  const [featured, setFeatured] = useState(Boolean(product?.featured))
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [formDirty, setFormDirty] = useState(false)

  const { photos, photoError, photosDirty, compressing, addFiles, removePhoto, setStatus, resetUploading } =
    usePhotos(product?.images, MAX_PRODUCT_PHOTOS)

  const dirty = formDirty || photosDirty

  const requestClose = () => {
    if (saving) return
    if (dirty && !window.confirm('Discard your changes?')) return
    onClose()
  }

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === 'Escape') requestClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  const edit = (setter) => (value) => {
    setFormDirty(true)
    setter(value)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (compressing) {
      setError('Please wait for the photos to finish compressing.')
      return
    }

    setSaving(true)
    setError('')
    try {
      await saveProduct({
        category,
        productId,
        existing: product,
        form: { name, condition, description, featured },
        photos,
        onPhotoStatus: setStatus,
      })
      onSaved()
    } catch (err) {
      setError(err?.message || 'Could not save product.')
      resetUploading()
      setSaving(false)
    }
  }

  const shownError = error || photoError

  return (
    <div className="admin-modal" role="dialog" aria-modal="true" aria-label={isEdit ? 'Edit product' : 'Add product'}>
      <form className="admin-modal__card admin-modal__card--product" onSubmit={handleSubmit}>
        <div className="admin-modal__head">
          <h3>{isEdit ? 'Edit product' : 'Add product'}</h3>
          <span className="admin-modal__tag">{category.name}</span>
        </div>

        <label className="admin-field">
          <span>Name</span>
          <input value={name} onChange={(e) => edit(setName)(e.target.value)} required disabled={saving} autoFocus />
        </label>

        <label className="admin-field">
          <span>Condition</span>
          <select value={condition} onChange={(e) => edit(setCondition)(e.target.value)} disabled={saving}>
            {CONDITIONS.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>

        <label className="admin-field">
          <span>Description</span>
          <textarea rows={5} value={description} onChange={(e) => edit(setDescription)(e.target.value)} disabled={saving} />
        </label>

        <label className="admin-check">
          <input type="checkbox" checked={featured} onChange={(e) => edit(setFeatured)(e.target.checked)} disabled={saving} />
          <span>Featured product</span>
        </label>

        <div className="admin-field">
          <span>
            Photos <em>({photos.length}/{MAX_PRODUCT_PHOTOS})</em>
          </span>
          <PhotoGrid photos={photos} max={MAX_PRODUCT_PHOTOS} saving={saving} onAdd={addFiles} onRemove={removePhoto} />
        </div>

        {shownError ? <p className="admin-error">{shownError}</p> : null}

        <div className="admin-modal__actions">
          <button type="button" className="btn btn--outline btn--sm" onClick={requestClose} disabled={saving}>
            Cancel
          </button>
          <button type="submit" className="btn btn--primary btn--sm" disabled={saving || compressing}>
            {saving ? 'Saving…' : compressing ? 'Compressing…' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default ProductModal

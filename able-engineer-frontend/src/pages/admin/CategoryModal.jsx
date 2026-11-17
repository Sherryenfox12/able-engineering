import { useEffect, useState } from 'react'
import { createCategory, updateCategory } from '../../services/productAdmin'

function CategoryModal({ category, onClose, onSaved }) {
  const isEdit = Boolean(category)
  const [name, setName] = useState(category?.name || '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === 'Escape' && !saving) onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSaving(true)
    setError('')
    try {
      const id = isEdit ? category.id : await createCategory({ name })
      if (isEdit) await updateCategory(category.id, { name })
      onSaved(id)
    } catch (err) {
      setError(err?.message || 'Could not save category.')
      setSaving(false)
    }
  }

  return (
    <div className="admin-modal" role="dialog" aria-modal="true" aria-label={isEdit ? 'Edit category' : 'Add category'}>
      <form className="admin-modal__card" onSubmit={handleSubmit}>
        <div className="admin-modal__head">
          <h3>{isEdit ? 'Rename category' : 'Add category'}</h3>
        </div>

        <label className="admin-field">
          <span>Name</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Machine"
            required
            disabled={saving}
            autoFocus
          />
        </label>

        {error ? <p className="admin-error">{error}</p> : null}

        <div className="admin-modal__actions">
          <button type="button" className="btn btn--outline btn--sm" onClick={onClose} disabled={saving}>
            Cancel
          </button>
          <button type="submit" className="btn btn--primary btn--sm" disabled={saving}>
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default CategoryModal

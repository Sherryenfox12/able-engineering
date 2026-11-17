import { useEffect, useState } from 'react'
import {
  EVENT_LANGUAGES,
  MAX_EVENT_PHOTOS,
  eventToTexts,
  newEventId,
  saveEvent,
} from '../../services/eventAdmin'
import PhotoGrid from './PhotoGrid'
import { usePhotos } from './usePhotos'

/**
 * Add / edit an event. Title, summary and description are entered per language
 * (English / 中文 / Indonesia); the website shows the visitor's language and falls back to English.
 * Photos (up to 5) are only uploaded when Save is pressed.
 */
function EventModal({ event, onClose, onSaved }) {
  const isEdit = Boolean(event)

  const [eventId] = useState(() => event?.id || newEventId())
  const [texts, setTexts] = useState(() => eventToTexts(event))
  const [lang, setLang] = useState('en')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [formDirty, setFormDirty] = useState(false)

  const { photos, photoError, photosDirty, compressing, addFiles, removePhoto, setStatus, resetUploading } =
    usePhotos(event?.images, MAX_EVENT_PHOTOS)

  const dirty = formDirty || photosDirty

  const requestClose = () => {
    if (saving) return
    if (dirty && !window.confirm('Discard your changes?')) return
    onClose()
  }

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') requestClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  const setField = (field, value) => {
    setFormDirty(true)
    setTexts((prev) => ({ ...prev, [lang]: { ...prev[lang], [field]: value } }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (compressing) {
      setError('Please wait for the photos to finish compressing.')
      return
    }

    setSaving(true)
    setError('')
    try {
      await saveEvent({ eventId, existing: event, texts, photos, onPhotoStatus: setStatus })
      onSaved()
    } catch (err) {
      setError(err?.message || 'Could not save event.')
      resetUploading()
      setSaving(false)
    }
  }

  const current = texts[lang]
  const shownError = error || photoError

  return (
    <div className="admin-modal" role="dialog" aria-modal="true" aria-label={isEdit ? 'Edit event' : 'Add event'}>
      <form className="admin-modal__card admin-modal__card--product" onSubmit={handleSubmit}>
        <div className="admin-modal__head">
          <h3>{isEdit ? 'Edit event' : 'Add event'}</h3>
        </div>

        <div className="lang-tabs" role="tablist" aria-label="Language">
          {EVENT_LANGUAGES.map(({ code, label }) => {
            const filled = Boolean(texts[code].title.trim())
            return (
              <button
                key={code}
                type="button"
                role="tab"
                aria-selected={lang === code}
                className={`lang-tab${lang === code ? ' is-active' : ''}${filled ? ' has-content' : ''}`}
                onClick={() => setLang(code)}
              >
                {label}
              </button>
            )
          })}
        </div>

        <label className="admin-field">
          <span>Title</span>
          <input value={current.title} onChange={(e) => setField('title', e.target.value)} disabled={saving} autoFocus />
        </label>

        <label className="admin-field">
          <span>Summary</span>
          <textarea rows={2} value={current.summary} onChange={(e) => setField('summary', e.target.value)} disabled={saving} />
        </label>

        <label className="admin-field">
          <span>Description</span>
          <textarea
            rows={6}
            value={current.description}
            onChange={(e) => setField('description', e.target.value)}
            disabled={saving}
          />
        </label>

        <div className="admin-field">
          <span>
            Photos <em>({photos.length}/{MAX_EVENT_PHOTOS})</em>
          </span>
          <PhotoGrid photos={photos} max={MAX_EVENT_PHOTOS} saving={saving} onAdd={addFiles} onRemove={removePhoto} />
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

export default EventModal

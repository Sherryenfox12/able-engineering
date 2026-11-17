function formatSize(bytes) {
  if (!bytes) return ''
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

/** Photo slots: filled tiles, one "Add photo" tile, then dimmed empty slots up to `max`. */
function PhotoGrid({ photos, max, saving, onAdd, onRemove }) {
  return (
    <div className="photo-grid" data-max={max}>
      {Array.from({ length: max }, (_, index) => {
        const photo = photos[index]

        if (photo) {
          return (
            <div key={photo.key} className="photo-tile">
              {photo.url ? <img src={photo.url} alt={`Photo ${index + 1}`} /> : <div className="photo-tile__blank" />}

              {photo.status !== 'ready' ? (
                <div className="photo-tile__busy">
                  <span className="spinner" aria-hidden="true" />
                  <small>{photo.status === 'compressing' ? 'Compressing…' : 'Uploading…'}</small>
                </div>
              ) : null}

              {photo.status === 'ready' && !saving ? (
                <button
                  type="button"
                  className="photo-tile__remove"
                  onClick={() => onRemove(photo.key)}
                  aria-label={`Remove photo ${index + 1}`}
                >
                  ×
                </button>
              ) : null}

              {photo.status === 'ready' && photo.size ? (
                <span className="photo-tile__size">
                  {photo.originalSize ? `${formatSize(photo.originalSize)} → ` : ''}
                  {formatSize(photo.size)}
                </span>
              ) : null}
            </div>
          )
        }

        if (index === photos.length) {
          return (
            <label key="add" className={`photo-tile photo-tile--add${saving ? ' is-disabled' : ''}`}>
              <span className="photo-tile__plus">+</span>
              <small>Add photo</small>
              <input
                type="file"
                accept="image/*"
                multiple
                disabled={saving}
                onChange={(e) => {
                  onAdd(e.target.files)
                  e.target.value = ''
                }}
              />
            </label>
          )
        }

        return <div key={`empty-${index}`} className="photo-tile photo-tile--empty" />
      })}
    </div>
  )
}

export default PhotoGrid

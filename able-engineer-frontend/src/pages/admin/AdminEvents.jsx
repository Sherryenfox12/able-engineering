import { useCallback, useEffect, useState } from 'react'
import { deleteEvent, eventDisplayTitle, listEvents } from '../../services/eventAdmin'
import EventModal from './EventModal'
import './AdminProducts.css' // shared admin styles (modals, fields, photo tiles, cards)
import './AdminEvents.css'

function AdminEvents() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [modal, setModal] = useState(null) // null | { event: obj | null }

  const load = useCallback(async () => {
    setLoading(true)
    try {
      setEvents(await listEvents())
      setError('')
    } catch (err) {
      setError(err?.message || 'Failed to load events.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const handleDelete = async (event) => {
    if (!window.confirm(`Delete "${eventDisplayTitle(event)}" and its photos?`)) return

    setBusy(true)
    setError('')
    try {
      await deleteEvent(event)
      await load()
    } catch (err) {
      setError(err?.message || 'Could not delete event.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="admin-catalog">
      <div className="admin-catalog__top">
        <div>
          <h2>Events</h2>
          <p className="admin-muted">
            {loading ? 'Loading…' : `${events.length} event${events.length === 1 ? '' : 's'}`}
          </p>
        </div>
        <button type="button" className="btn btn--primary btn--sm" onClick={() => setModal({ event: null })} disabled={busy}>
          + Add event
        </button>
      </div>

      {error ? <p className="admin-error">{error}</p> : null}

      <div className="admin-catalog__panel">
        {loading ? (
          <p className="admin-muted">Loading events…</p>
        ) : events.length === 0 ? (
          <div className="admin-empty">
            <p>No events yet.</p>
            <button type="button" className="btn btn--primary btn--sm" onClick={() => setModal({ event: null })}>
              Add your first event
            </button>
          </div>
        ) : (
          <ul className="product-list">
            {events.map((event) => {
              const description = event.description?.en || event.description?.zh || event.description?.id || ''
              const languages = ['en', 'zh', 'id'].filter((code) => event.title?.[code]?.trim())

              return (
                <li key={event.id} className="product-item">
                  <button type="button" className="product-item__main" onClick={() => setModal({ event })}>
                    <div className="product-item__media">
                      {event.images[0] ? <img src={event.images[0].url} alt="" loading="lazy" /> : <span>No photo</span>}
                      {event.images.length > 1 ? (
                        <span className="product-item__count">{event.images.length} photos</span>
                      ) : null}
                    </div>
                    <div className="product-item__body">
                      <strong>{eventDisplayTitle(event)}</strong>
                      <span className="product-item__langs">
                        {languages.map((code) => (
                          <span key={code} className="product-item__tag">
                            {code.toUpperCase()}
                          </span>
                        ))}
                      </span>
                      {description ? <p>{description}</p> : null}
                    </div>
                  </button>
                  <div className="product-item__actions">
                    <button type="button" className="admin-link" onClick={() => setModal({ event })} disabled={busy}>
                      Edit
                    </button>
                    <button type="button" className="admin-link admin-link--danger" onClick={() => handleDelete(event)} disabled={busy}>
                      Delete
                    </button>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </div>

      {modal ? (
        <EventModal
          key={modal.event?.id || 'new'}
          event={modal.event}
          onClose={() => setModal(null)}
          onSaved={async () => {
            setModal(null)
            await load()
          }}
        />
      ) : null}
    </section>
  )
}

export default AdminEvents

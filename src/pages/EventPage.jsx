import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import DetailDialog from '../components/DetailDialog'
import Reveal from '../components/Reveal'
import { ArrowRightIcon, GearIcon, PackageIcon } from '../components/Icons'
import { IMAGES } from '../constants/images'
import { useLanguage } from '../locales/i18n'
import { getEventFeed, getMoreEventFeed, peekEventFeed, pickText } from '../services/eventCatalog'
import './EventPage.css'

// Reached by typing /event - it is intentionally not linked from the navigation.

const SKELETON_COUNT = 6

function EventCard({ event, index, lang, onOpen }) {
  const { t } = useLanguage()
  const title = pickText(event.title, lang)
  const summary = pickText(event.summary, lang)
  const cover = event.images[0] // The list only shows the first photo; the rest load in the details view.

  return (
    <Reveal delay={(index % 3) * 100} as="article" className="event-card" onClick={() => onOpen(event)}>
      <div className="event-card__media">
        {cover ? (
          <img src={cover.url} alt={title} loading="lazy" decoding="async" />
        ) : (
          <div className="event-card__placeholder" aria-hidden="true">
            <GearIcon size={56} strokeWidth={1.1} />
          </div>
        )}
      </div>

      <div className="event-card__body">
        <h3>{title}</h3>
        {summary ? <p className="event-card__summary">{summary}</p> : null}

        <button
          type="button"
          className="btn btn--outline btn--sm event-card__cta"
          onClick={(e) => {
            e.stopPropagation()
            onOpen(event)
          }}
        >
          {t('products.viewDetails')} <ArrowRightIcon size={16} />
        </button>
      </div>
    </Reveal>
  )
}

function EventCardSkeleton() {
  return (
    <div className="event-card event-card--skeleton" aria-hidden="true">
      <div className="event-card__media" />
      <div className="event-card__body">
        <span className="skeleton-line skeleton-line--title" />
        <span className="skeleton-line" />
        <span className="skeleton-line skeleton-line--short" />
      </div>
    </div>
  )
}

function EventPage() {
  const { t, lang } = useLanguage()
  const [openEvent, setOpenEvent] = useState(null)
  const [attempt, setAttempt] = useState(0) // bump to retry after an error

  // Start from the cache when it has fresh data: a return visit paints instantly with no Firestore read.
  const [feed, setFeed] = useState(() => peekEventFeed())
  const [error, setError] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [moreError, setMoreError] = useState(false)

  const sentinelRef = useRef(null)

  /* ---------------- First page ---------------- */
  useEffect(() => {
    let cancelled = false
    getEventFeed()
      .then((result) => {
        if (cancelled) return
        setFeed(result)
        setError(false)
      })
      .catch((err) => {
        console.error('Could not load events', err)
        if (!cancelled) setError(true)
      })
    return () => {
      cancelled = true
    }
  }, [attempt])

  /* ---------------- Infinite scroll: the next 20 ---------------- */
  const loadMore = useCallback(async () => {
    if (!feed || !feed.hasMore || loadingMore) return

    setLoadingMore(true)
    try {
      setFeed(await getMoreEventFeed(feed))
    } catch (err) {
      console.error('Could not load more events', err)
      setMoreError(true)
    } finally {
      setLoadingMore(false)
    }
  }, [feed, loadingMore])

  const hasMore = Boolean(feed?.hasMore)
  const canAutoLoad = hasMore && !loadingMore && !moreError

  useEffect(() => {
    const el = sentinelRef.current
    if (!el || !canAutoLoad) return undefined

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) loadMore()
      },
      { rootMargin: '600px 0px' },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [canAutoLoad, loadMore])

  const closeDetail = useCallback(() => setOpenEvent(null), [])

  const items = feed?.items ?? []

  return (
    <>
      {/* ---------------- Page banner ---------------- */}
      <section className="page-banner">
        <div className="page-banner__bg" style={{ backgroundImage: `url(${IMAGES.machinery})` }} />
        <div className="container page-banner__inner">
          <span className="page-banner__eyebrow">{t('events.eyebrow')}</span>
          <h1>{t('events.title')}</h1>
          <p>{t('events.lead')}</p>
        </div>
        <svg className="page-banner__wave" viewBox="0 0 1440 120" preserveAspectRatio="none" aria-hidden="true">
          <polygon points="0,120 1440,0 1440,120" fill="#0b3f91" />
          <polygon points="0,120 1440,34 1440,120" fill="#1a6adf" />
          <polygon points="0,120 1440,70 1440,120" fill="#e8f2fc" />
        </svg>
      </section>

      {/* ---------------- Events ---------------- */}
      <section className="section section--ice events">
        <div className="container">
          {error ? (
            <div className="events__empty">
              <span className="events__empty-icon">
                <PackageIcon size={34} />
              </span>
              <h3>{t('events.loadErrorTitle')}</h3>
              <p>{t('events.loadErrorText')}</p>
              <button type="button" className="btn btn--primary btn--sm" onClick={() => setAttempt((n) => n + 1)}>
                {t('events.retry')}
              </button>
            </div>
          ) : !feed ? (
            <div className="events__grid" aria-busy="true">
              {Array.from({ length: SKELETON_COUNT }, (_, i) => (
                <EventCardSkeleton key={i} />
              ))}
            </div>
          ) : items.length > 0 ? (
            <div className="events__grid">
              {items.map((event, i) => (
                <EventCard key={event.id} event={event} index={i} lang={lang} onOpen={setOpenEvent} />
              ))}
            </div>
          ) : (
            <div className="events__empty">
              <span className="events__empty-icon">
                <PackageIcon size={34} />
              </span>
              <h3>{t('events.emptyTitle')}</h3>
              <p>{t('events.emptyText')}</p>
              <Link to="/contact" className="btn btn--primary btn--sm">
                {t('events.contact')} <ArrowRightIcon size={16} />
              </Link>
            </div>
          )}

          {/* Scroll trigger: when it nears the viewport, the next 20 events are loaded. */}
          {hasMore && !error ? (
            <div className="events__more">
              <div ref={sentinelRef} className="events__sentinel" aria-hidden="true" />
              {moreError ? (
                <button
                  type="button"
                  className="btn btn--outline btn--sm"
                  onClick={() => {
                    setMoreError(false)
                    loadMore()
                  }}
                >
                  {t('events.retry')}
                </button>
              ) : (
                <span className="events__more-status" role="status">
                  <span className="events__spinner" aria-hidden="true" /> {t('events.loadingMore')}
                </span>
              )}
            </div>
          ) : null}
        </div>
      </section>

      {openEvent ? (
        <DetailDialog
          title={pickText(openEvent.title, lang)}
          summary={pickText(openEvent.summary, lang)}
          description={pickText(openEvent.description, lang)}
          images={openEvent.images}
          onClose={closeDetail}
        />
      ) : null}
    </>
  )
}

export default EventPage

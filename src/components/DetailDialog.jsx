import { useEffect, useRef, useState } from 'react'
import { WhatsAppIcon } from './Icons'
import { useLanguage } from '../locales/i18n'
import './DetailDialog.css'

/**
 * Full-screen detail view shared by the Products and Event pages:
 * a photo gallery (every photo, with thumbnails), tags, title, optional summary,
 * description, and an optional WhatsApp enquiry button.
 *
 * Photos reuse the same URLs as the list cards, so the first one is already cached by the browser.
 *
 * tags: [{ label, dark? }]
 */
function DetailDialog({ title, summary, description, images, tags = [], enquiryLink, onClose }) {
  const { t } = useLanguage()
  const [index, setIndex] = useState(0)
  const closeRef = useRef(null)

  const total = images.length
  const go = (step) => setIndex((current) => (current + step + total) % total)

  // Lock page scroll behind the dialog, focus it, and restore on close.
  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [])

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === 'Escape') onClose()
      else if (total > 1 && event.key === 'ArrowLeft') setIndex((c) => (c - 1 + total) % total)
      else if (total > 1 && event.key === 'ArrowRight') setIndex((c) => (c + 1) % total)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose, total])

  const visibleTags = tags.filter((tag) => tag.label)

  return (
    <div className="pd" role="dialog" aria-modal="true" aria-label={title} onClick={onClose}>
      <div className="pd__card" onClick={(event) => event.stopPropagation()}>
        <button ref={closeRef} type="button" className="pd__close" onClick={onClose} aria-label={t('products.close')}>
          ×
        </button>

        <div className="pd__gallery">
          <div className="pd__stage">
            {total > 0 ? (
              <img key={images[index].url} src={images[index].url} alt={`${title} - ${index + 1}/${total}`} decoding="async" />
            ) : (
              <div className="pd__nophoto">{t('products.photoSoon')}</div>
            )}

            {total > 1 ? (
              <>
                <button type="button" className="pd__nav pd__nav--prev" onClick={() => go(-1)} aria-label={t('products.previousPhoto')}>
                  ‹
                </button>
                <button type="button" className="pd__nav pd__nav--next" onClick={() => go(1)} aria-label={t('products.nextPhoto')}>
                  ›
                </button>
                <span className="pd__counter">
                  {index + 1} / {total}
                </span>
              </>
            ) : null}
          </div>

          {total > 1 ? (
            <div className="pd__thumbs">
              {images.map((image, i) => (
                <button
                  key={image.url}
                  type="button"
                  className={`pd__thumb${i === index ? ' is-active' : ''}`}
                  onClick={() => setIndex(i)}
                  aria-label={t('products.photoLabel', { n: i + 1, total })}
                  aria-current={i === index}
                >
                  <img src={image.url} alt="" decoding="async" />
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <div className="pd__info">
          {visibleTags.length > 0 ? (
            <div className="pd__tags">
              {visibleTags.map((tag) => (
                <span key={tag.label} className={`pd__tag${tag.dark ? ' pd__tag--dark' : ''}`}>
                  {tag.label}
                </span>
              ))}
            </div>
          ) : null}

          <h2>{title}</h2>

          {summary ? <p className="pd__summary">{summary}</p> : null}

          {description ? (
            <div className="pd__description">
              <h3>{t('products.descriptionLabel')}</h3>
              <p>{description}</p>
            </div>
          ) : null}

          {enquiryLink ? (
            <a className="btn btn--primary pd__cta" href={enquiryLink} target="_blank" rel="noopener noreferrer">
              <WhatsAppIcon size={18} /> {t('products.enquire')}
            </a>
          ) : null}
        </div>
      </div>
    </div>
  )
}

export default DetailDialog

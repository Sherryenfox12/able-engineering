import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Reveal from '../components/Reveal'
import {
  ArrowRightIcon,
  CheckIcon,
  FactoryIcon,
  GearIcon,
  PackageIcon,
  SearchIcon,
  WhatsAppIcon,
} from '../components/Icons'
import { BRANCHES } from '../constants/company'
import { IMAGES } from '../constants/images'
import { PRODUCT_CATEGORIES, PRODUCTS } from '../constants/products'
import { useLanguage } from '../locales/i18n'
import './ProductsPage.css'

const ALL = 'all'
const WHATSAPP_NUMBER = BRANCHES[0].whatsapp.display.replace(/\D/g, '')

const whatsappLink = (text) => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`

function ProductPlaceholder({ category, label }) {
  const PlaceholderIcon = category === 'machine' ? FactoryIcon : category === 'spare-parts' ? PackageIcon : GearIcon
  return (
    <div className="product-card__placeholder" aria-hidden="true">
      <PlaceholderIcon size={64} strokeWidth={1.1} />
      <span>{label}</span>
    </div>
  )
}

function ProductCard({ product, index }) {
  const { t } = useLanguage()
  const { name, category, image, condition, id, summary, highlights } = product
  const categoryLabel = t(`products.categories.${category}.label`)
  const conditionLabel = condition ? t(`products.condition.${condition}`) : ''
  const message = t('products.enquireMessage', { name })

  return (
    <Reveal delay={(index % 3) * 100} as="article" className="product-card">
      <div className="product-card__media">
        {image ? (
          <img src={image} alt={name} loading="lazy" />
        ) : (
          <ProductPlaceholder category={category} label={t('products.photoSoon')} />
        )}
        <span className="product-card__category">{categoryLabel}</span>
        {condition && <span className="product-card__condition">{conditionLabel}</span>}
      </div>

      <div className="product-card__body">
        <h3>{name}</h3>
        <p className="product-card__summary">{summary}</p>

        <ul className="product-card__highlights">
          {highlights.map((itemText) => (
            <li key={itemText}>
              <CheckIcon size={15} />
              {itemText}
            </li>
          ))}
        </ul>

        <a
          className="btn btn--outline btn--sm product-card__cta"
          href={whatsappLink(message)}
          target="_blank"
          rel="noopener noreferrer"
        >
          <WhatsAppIcon size={18} /> {t('products.enquire')}
        </a>
      </div>
    </Reveal>
  )
}

function ProductsPage() {
  const { t } = useLanguage()
  const [searchParams, setSearchParams] = useSearchParams()
  const [query, setQuery] = useState('')

  // The active category lives in the URL (/products?category=machine) so links can be shared / bookmarked.
  const requested = searchParams.get('category')
  const active = PRODUCT_CATEGORIES.some((c) => c.id === requested) ? requested : ALL

  const selectCategory = (id) => {
    setSearchParams(id === ALL ? {} : { category: id }, { replace: true })
  }

  const counts = useMemo(() => {
    const result = { [ALL]: PRODUCTS.length }
    PRODUCT_CATEGORIES.forEach((c) => {
      result[c.id] = PRODUCTS.filter((p) => p.category === c.id).length
    })
    return result
  }, [])

  const localizedProducts = useMemo(
    () =>
      PRODUCTS.map((product) => {
        const item = t(`products.items.${product.id}`)
        const translated = item && typeof item === 'object' ? item : null
        return {
          ...product,
          summary: translated?.summary ?? product.summary,
          highlights: Array.isArray(translated?.highlights) ? translated.highlights : product.highlights,
          categoryLabel: t(`products.categories.${product.category}.label`),
        }
      }),
    [t],
  )

  const visibleProducts = useMemo(() => {
    const term = query.trim().toLowerCase()
    return localizedProducts.filter((p) => {
      if (active !== ALL && p.category !== active) return false
      if (!term) return true
      return [p.name, p.summary, p.categoryLabel, ...p.highlights].join(' ').toLowerCase().includes(term)
    })
  }, [active, query, localizedProducts])

  const heading = active === ALL ? t('products.allProducts') : t(`products.categories.${active}.label`)
  const blurb = active === ALL ? t('products.allBlurb') : t(`products.categories.${active}.blurb`)

  const categoryItems = [
    { id: ALL, label: t('products.allProducts') },
    ...PRODUCT_CATEGORIES.map((c) => ({
      id: c.id,
      label: t(`products.categories.${c.id}.label`),
    })),
  ]

  return (
    <>
      {/* ---------------- Page banner ---------------- */}
      <section className="page-banner">
        <div className="page-banner__bg" style={{ backgroundImage: `url(${IMAGES.machinery})` }} />
        <div className="container page-banner__inner">
          <span className="page-banner__eyebrow">{t('products.eyebrow')}</span>
          <h1>{t('products.title')}</h1>
          <p>{t('products.lead')}</p>
        </div>
        <svg className="page-banner__wave" viewBox="0 0 1440 120" preserveAspectRatio="none" aria-hidden="true">
          <polygon points="0,120 1440,0 1440,120" fill="#0b3f91" />
          <polygon points="0,120 1440,34 1440,120" fill="#1a6adf" />
          <polygon points="0,120 1440,70 1440,120" fill="#e8f2fc" />
        </svg>
      </section>

      {/* ---------------- Catalogue ---------------- */}
      <section className="section section--ice products">
        <div className="container products__layout">
          {/* Sidebar (becomes a scrollable chip row on mobile) */}
          <aside className="products__sidebar" aria-label={t('products.categoriesLabel')}>
            <div className="products__sidebar-head">
              <h2>{t('products.sidebarTitle')}</h2>
              <span>{t('products.chooseCategory')}</span>
            </div>
            <ul>
              {categoryItems.map(({ id, label }) => (
                <li key={id}>
                  <button
                    type="button"
                    className={`products__cat ${active === id ? 'is-active' : ''}`}
                    aria-pressed={active === id}
                    onClick={() => selectCategory(id)}
                  >
                    <span>{label}</span>
                    <small>{counts[id]}</small>
                  </button>
                </li>
              ))}
            </ul>

            <a
              className="products__sidebar-help"
              href={whatsappLink(t('products.sourceMessage'))}
              target="_blank"
              rel="noopener noreferrer"
            >
              <WhatsAppIcon size={22} />
              <span>
                <strong>{t('products.cantFind')}</strong>
                {t('products.sourceIt')}
              </span>
            </a>
          </aside>

          {/* Product grid */}
          <div className="products__main">
            <div className="products__toolbar">
              <div>
                <h2 className="products__title">{heading}</h2>
                <p>{blurb}</p>
              </div>
              <label className="products__search">
                <SearchIcon size={18} />
                <input
                  type="search"
                  placeholder={t('products.searchPlaceholder')}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  aria-label={t('products.searchLabel')}
                />
              </label>
            </div>

            {visibleProducts.length > 0 ? (
              <div className="products__grid">
                {visibleProducts.map((product, i) => (
                  <ProductCard key={product.id} product={product} index={i} />
                ))}
              </div>
            ) : (
              <div className="products__empty">
                <span className="products__empty-icon">
                  <PackageIcon size={34} />
                </span>
                <h3>{query ? t('products.emptySearchTitle') : t('products.emptyStockTitle')}</h3>
                <p>{query ? t('products.emptySearchText') : t('products.emptyStockText')}</p>
                <a
                  className="btn btn--primary btn--sm"
                  href={whatsappLink(
                    t('products.askMessage', {
                      item: query || (active === ALL ? t('products.defaultItem') : t(`products.categories.${active}.label`)),
                    }),
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <WhatsAppIcon size={18} /> {t('products.askWhatsApp')}
                </a>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ---------------- CTA ---------------- */}
      <section className="cta">
        <Reveal className="container cta__inner">
          <div>
            <h2>{t('products.ctaTitle')}</h2>
            <p>{t('products.ctaText')}</p>
          </div>
          <Link to="/contact" className="btn btn--primary">
            {t('products.ctaButton')} <ArrowRightIcon size={18} />
          </Link>
        </Reveal>
      </section>
    </>
  )
}

export default ProductsPage

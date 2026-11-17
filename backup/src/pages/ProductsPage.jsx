import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Reveal from '../components/Reveal'
import DetailDialog from '../components/DetailDialog'
import { ArrowRightIcon, GearIcon, PackageIcon, SearchIcon, WhatsAppIcon } from '../components/Icons'
import { BRANCHES } from '../constants/company'
import { IMAGES } from '../constants/images'
import { getCategories, getFeed, getMoreFeed, peekCategories, peekFeed } from '../services/productCatalog'
import { useLanguage } from '../locales/i18n'
import './ProductsPage.css'

// NOTE: src/constants/products.js (the old sample catalogue) is intentionally no longer used here.
// Products and categories now come from Firestore (managed in /admin).

const ALL = 'all'
const SKELETON_COUNT = 6
const NO_ITEMS = []
const WHATSAPP_NUMBER = BRANCHES[0].whatsapp.display.replace(/\D/g, '')

const whatsappLink = (text) => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`

// The admin types the condition freely; fall back to the raw text when there is no translation.
function conditionText(t, condition) {
  if (!condition) return ''
  const key = `products.condition.${condition}`
  const label = t(key)
  return label === key ? condition : label
}

function ProductCard({ product, index, categoryLabel, onOpen }) {
  const { t } = useLanguage()
  const { name, condition, description, images } = product
  const cover = images[0] // The list only shows the first photo; the others load in the detail view.
  const conditionLabel = conditionText(t, condition)

  return (
    <Reveal delay={(index % 3) * 100} as="article" className="product-card" onClick={() => onOpen(product)}>
      <div className="product-card__media">
        {cover ? (
          <img src={cover.url} alt={name} loading="lazy" decoding="async" />
        ) : (
          <div className="product-card__placeholder" aria-hidden="true">
            <GearIcon size={64} strokeWidth={1.1} />
            <span>{t('products.photoSoon')}</span>
          </div>
        )}
        {categoryLabel ? <span className="product-card__category">{categoryLabel}</span> : null}
        {conditionLabel ? <span className="product-card__condition">{conditionLabel}</span> : null}
      </div>

      <div className="product-card__body">
        <h3>{name}</h3>
        {description ? <p className="product-card__summary">{description}</p> : null}

        <button
          type="button"
          className="btn btn--outline btn--sm product-card__cta"
          onClick={(event) => {
            event.stopPropagation()
            onOpen(product)
          }}
        >
          {t('products.viewDetails')} <ArrowRightIcon size={16} />
        </button>
      </div>
    </Reveal>
  )
}

function ProductCardSkeleton() {
  return (
    <div className="product-card product-card--skeleton" aria-hidden="true">
      <div className="product-card__media" />
      <div className="product-card__body">
        <span className="skeleton-line skeleton-line--title" />
        <span className="skeleton-line" />
        <span className="skeleton-line skeleton-line--short" />
      </div>
    </div>
  )
}

function ProductsPage() {
  const { t } = useLanguage()
  const [searchParams, setSearchParams] = useSearchParams()
  const [query, setQuery] = useState('')
  const [openProduct, setOpenProduct] = useState(null)
  const [attempt, setAttempt] = useState(0) // bump to retry after an error

  // Start from the cache when it has fresh data, so a return visit paints instantly with no Firestore read.
  const [categories, setCategories] = useState(() => peekCategories() ?? [])
  const [categoriesReady, setCategoriesReady] = useState(() => peekCategories() !== null)
  const [categoriesError, setCategoriesError] = useState(false)

  // `key` records which category the products belong to, so a stale list is never shown.
  const [feed, setFeed] = useState({ key: '', items: [], hasMore: false })
  const [feedError, setFeedError] = useState('') // key of the feed that failed to load
  const [moreError, setMoreError] = useState('') // key of the feed whose next page failed
  const [loadingMore, setLoadingMore] = useState(false)

  const sentinelRef = useRef(null)
  const activeKeyRef = useRef('')

  /* ---------------- Categories ---------------- */
  useEffect(() => {
    let cancelled = false
    getCategories()
      .then((list) => {
        if (cancelled) return
        setCategories(list)
        setCategoriesError(false)
        setCategoriesReady(true)
      })
      .catch((err) => {
        console.error('Could not load product categories', err)
        if (cancelled) return
        setCategoriesError(true)
        setCategoriesReady(true)
      })
    return () => {
      cancelled = true
    }
  }, [attempt])

  // The active category lives in the URL (/products?category=<id>) so links can be shared / bookmarked.
  const requested = searchParams.get('category')
  const active = categories.some((c) => c.id === requested) ? requested : ALL
  const categoryId = active === ALL ? '' : active
  const feedKey = active

  const selectCategory = (id) => {
    setSearchParams(id === ALL ? {} : { category: id }, { replace: true })
  }

  const storeIsEmpty = categoriesReady && !categoriesError && categories.length === 0
  const totalCount = useMemo(() => categories.reduce((sum, c) => sum + c.count, 0), [categories])
  const categoryNames = useMemo(() => Object.fromEntries(categories.map((c) => [c.id, c.name])), [categories])
  const activeCategory = categories.find((c) => c.id === active)

  /* ---------------- First page of the active category ---------------- */
  useEffect(() => {
    activeKeyRef.current = feedKey
    if (!categoriesReady || categoriesError || storeIsEmpty) return undefined

    let cancelled = false
    getFeed(categoryId)
      .then((result) => {
        if (cancelled) return
        setFeed({ key: feedKey, ...result })
        setFeedError('')
        setMoreError('')
      })
      .catch((err) => {
        // Firestore reports a missing composite index here, with a link to create it, in the console.
        console.error('Could not load products', err)
        if (!cancelled) setFeedError(feedKey)
      })
    return () => {
      cancelled = true
    }
  }, [categoriesReady, categoriesError, storeIsEmpty, categoryId, feedKey, attempt])

  // The products to show: what has loaded, or - while the first page is still on its way - whatever is cached.
  const current = useMemo(() => {
    if (feed.key === feedKey) return feed
    if (!categoriesReady || categoriesError) return null
    const cached = peekFeed(categoryId)
    return cached ? { key: feedKey, ...cached } : null
  }, [feed, feedKey, categoriesReady, categoriesError, categoryId])
  const loaded = current !== null
  const items = current ? current.items : NO_ITEMS
  const hasMore = current ? current.hasMore : false

  /* ---------------- Infinite scroll: the next 20 ---------------- */
  const loadMore = useCallback(async () => {
    if (!current || !current.hasMore || loadingMore) return

    setLoadingMore(true)
    try {
      const next = await getMoreFeed(categoryId, current)
      // Ignore the result if the visitor has already switched to another category.
      if (activeKeyRef.current === feedKey) setFeed({ key: feedKey, ...next })
    } catch (err) {
      console.error('Could not load more products', err)
      if (activeKeyRef.current === feedKey) setMoreError(feedKey)
    } finally {
      setLoadingMore(false)
    }
  }, [current, loadingMore, categoryId, feedKey])

  const canAutoLoad = loaded && hasMore && !loadingMore && moreError !== feedKey

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

  /* ---------------- Search (over the products loaded so far) ---------------- */
  const visibleProducts = useMemo(() => {
    const term = query.trim().toLowerCase()
    if (!term) return items
    return items.filter((p) =>
      [p.name, p.description, categoryNames[p.categoryId]].join(' ').toLowerCase().includes(term),
    )
  }, [items, query, categoryNames])

  const closeDetail = useCallback(() => setOpenProduct(null), [])

  const failed = categoriesError || feedError === feedKey
  const loadingFirstPage = !failed && !storeIsEmpty && (!categoriesReady || !loaded)

  const heading = active === ALL ? t('products.allProducts') : activeCategory?.name
  const subheading =
    active === ALL ? t('products.allBlurb') : t('products.itemCount', { count: activeCategory?.count ?? 0 })

  const categoryItems = [
    { id: ALL, label: t('products.allProducts'), count: categoriesReady ? totalCount : null },
    ...categories.map((c) => ({ id: c.id, label: c.name, count: c.count })),
  ]

  const emptyAskItem = query || (active === ALL ? t('products.defaultItem') : activeCategory?.name)

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
              {categoryItems.map(({ id, label, count }) => (
                <li key={id}>
                  <button
                    type="button"
                    className={`products__cat ${active === id ? 'is-active' : ''}`}
                    aria-pressed={active === id}
                    onClick={() => selectCategory(id)}
                  >
                    <span>{label}</span>
                    {count != null ? <small>{count}</small> : null}
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
                <p>{subheading}</p>
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

            {failed ? (
              <div className="products__empty">
                <span className="products__empty-icon">
                  <PackageIcon size={34} />
                </span>
                <h3>{t('products.loadErrorTitle')}</h3>
                <p>{t('products.loadErrorText')}</p>
                <button type="button" className="btn btn--primary btn--sm" onClick={() => setAttempt((n) => n + 1)}>
                  {t('products.retry')}
                </button>
              </div>
            ) : loadingFirstPage ? (
              <div className="products__grid" aria-busy="true">
                {Array.from({ length: SKELETON_COUNT }, (_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            ) : visibleProducts.length > 0 ? (
              <div className="products__grid">
                {visibleProducts.map((product, i) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    index={i}
                    categoryLabel={categoryNames[product.categoryId]}
                    onOpen={setOpenProduct}
                  />
                ))}
              </div>
            ) : !hasMore ? (
              // Nothing to show and nothing more to load.
              <div className="products__empty">
                <span className="products__empty-icon">
                  <PackageIcon size={34} />
                </span>
                <h3>{query ? t('products.emptySearchTitle') : t('products.emptyStockTitle')}</h3>
                <p>{query ? t('products.emptySearchText') : t('products.emptyStockText')}</p>
                <a
                  className="btn btn--primary btn--sm"
                  href={whatsappLink(t('products.askMessage', { item: emptyAskItem }))}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <WhatsAppIcon size={18} /> {t('products.askWhatsApp')}
                </a>
              </div>
            ) : null}

            {/* Scroll trigger: when it nears the viewport, the next 20 products are loaded. */}
            {loaded && hasMore && !failed ? (
              <div className="products__more">
                <div ref={sentinelRef} className="products__sentinel" aria-hidden="true" />
                {moreError === feedKey ? (
                  <button
                    type="button"
                    className="btn btn--outline btn--sm"
                    onClick={() => {
                      setMoreError('')
                      loadMore()
                    }}
                  >
                    {t('products.retry')}
                  </button>
                ) : (
                  <span className="products__more-status" role="status">
                    <span className="products__spinner" aria-hidden="true" /> {t('products.loadingMore')}
                  </span>
                )}
              </div>
            ) : null}
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

      {openProduct ? (
        <DetailDialog
          title={openProduct.name}
          description={openProduct.description}
          images={openProduct.images}
          tags={[
            { label: categoryNames[openProduct.categoryId] },
            { label: conditionText(t, openProduct.condition), dark: true },
          ]}
          enquiryLink={whatsappLink(t('products.enquireMessage', { name: openProduct.name }))}
          onClose={closeDetail}
        />
      ) : null}
    </>
  )
}

export default ProductsPage

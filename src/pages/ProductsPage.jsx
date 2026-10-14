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
import './ProductsPage.css'

const ALL = 'all'
const WHATSAPP_NUMBER = BRANCHES[0].whatsapp.display.replace(/\D/g, '')

const whatsappLink = (text) => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`

const categoryLabel = (id) => PRODUCT_CATEGORIES.find((c) => c.id === id)?.label ?? ''

function ProductPlaceholder({ category }) {
  const PlaceholderIcon = category === 'machine' ? FactoryIcon : category === 'spare-parts' ? PackageIcon : GearIcon
  return (
    <div className="product-card__placeholder" aria-hidden="true">
      <PlaceholderIcon size={64} strokeWidth={1.1} />
      <span>Photo coming soon</span>
    </div>
  )
}

function ProductCard({ product, index }) {
  const { name, category, image, condition, summary, highlights } = product
  const message = `Hi Able Engineering, I'm interested in "${name}". Could you share the price and availability?`

  return (
    <Reveal delay={(index % 3) * 100} as="article" className="product-card">
      <div className="product-card__media">
        {image ? <img src={image} alt={name} loading="lazy" /> : <ProductPlaceholder category={category} />}
        <span className="product-card__category">{categoryLabel(category)}</span>
        {condition && <span className="product-card__condition">{condition}</span>}
      </div>

      <div className="product-card__body">
        <h3>{name}</h3>
        <p className="product-card__summary">{summary}</p>

        <ul className="product-card__highlights">
          {highlights.map((item) => (
            <li key={item}>
              <CheckIcon size={15} />
              {item}
            </li>
          ))}
        </ul>

        <a
          className="btn btn--outline btn--sm product-card__cta"
          href={whatsappLink(message)}
          target="_blank"
          rel="noopener noreferrer"
        >
          <WhatsAppIcon size={18} /> Enquire Now
        </a>
      </div>
    </Reveal>
  )
}

function ProductsPage() {
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

  const visibleProducts = useMemo(() => {
    const term = query.trim().toLowerCase()
    return PRODUCTS.filter((p) => {
      if (active !== ALL && p.category !== active) return false
      if (!term) return true
      return [p.name, p.summary, categoryLabel(p.category), ...p.highlights].join(' ').toLowerCase().includes(term)
    })
  }, [active, query])

  const activeCategory = PRODUCT_CATEGORIES.find((c) => c.id === active)
  const heading = activeCategory ? activeCategory.label : 'All Products'
  const blurb = activeCategory ? activeCategory.blurb : 'Browse our CNC machines and parts, or ask us to source what you need.'

  const categoryItems = [{ id: ALL, label: 'All Products' }, ...PRODUCT_CATEGORIES]

  return (
    <>
      {/* ---------------- Page banner ---------------- */}
      <section className="page-banner">
        <div className="page-banner__bg" style={{ backgroundImage: `url(${IMAGES.machinery})` }} />
        <div className="container page-banner__inner">
          <span className="page-banner__eyebrow">Our Products</span>
          <h1>CNC Machines &amp; Parts</h1>
          <p>Used Brother CNC machines and genuine spare parts, ready when you need them.</p>
        </div>
      </section>

      {/* ---------------- Catalogue ---------------- */}
      <section className="section products">
        <div className="container products__layout">
          {/* Sidebar (becomes a scrollable chip row on mobile) */}
          <aside className="products__sidebar" aria-label="Product categories">
            <div className="products__sidebar-head">
              <h2>Products</h2>
              <span>Choose a category</span>
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
              href={whatsappLink("Hi Able Engineering, I'm looking for a CNC machine / part. Can you help me source it?")}
              target="_blank"
              rel="noopener noreferrer"
            >
              <WhatsAppIcon size={22} />
              <span>
                <strong>Can&apos;t find it?</strong>
                We can source it for you
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
                  placeholder="Search products..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  aria-label="Search products"
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
                <h3>{query ? 'No products match your search' : 'New stock being updated'}</h3>
                <p>
                  {query
                    ? 'Try a different keyword, or tell us what you need and we will find it.'
                    : 'This category is being updated. Contact us for current availability or sourcing.'}
                </p>
                <a
                  className="btn btn--primary btn--sm"
                  href={whatsappLink(
                    `Hi Able Engineering, I'm looking for ${query || activeCategory?.label || 'a CNC part'}. Do you have it available?`,
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <WhatsAppIcon size={18} /> Ask on WhatsApp
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
            <h2>Need something that is not listed?</h2>
            <p>Our team can source machines and parts on request. Send us the model and we will get back to you.</p>
          </div>
          <Link to="/contact" className="btn btn--primary">
            Contact Us <ArrowRightIcon size={18} />
          </Link>
        </Reveal>
      </section>
    </>
  )
}

export default ProductsPage

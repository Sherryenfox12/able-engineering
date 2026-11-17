import { useCallback, useEffect, useRef, useState } from 'react'
import {
  deleteCategory,
  deleteProduct,
  listCategories,
  listProductsByCategory,
} from '../../services/productAdmin'
import CategoryModal from './CategoryModal'
import ProductModal from './ProductModal'
import './AdminProducts.css'

function AdminProducts() {
  const [categories, setCategories] = useState([])
  const [selectedId, setSelectedId] = useState('')
  const [products, setProducts] = useState([])
  const [loadingCategories, setLoadingCategories] = useState(true)
  const [loadingProducts, setLoadingProducts] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const [categoryModal, setCategoryModal] = useState(null) // null | { category: obj | null }
  const [productModal, setProductModal] = useState(null) // null | { product: obj | null }

  const selected = categories.find((c) => c.id === selectedId) || null

  // Ignore responses from a category the admin has already clicked away from.
  const requestId = useRef(0)

  const loadProducts = useCallback(async (categoryId) => {
    const current = ++requestId.current
    if (!categoryId) {
      setProducts([])
      setLoadingProducts(false)
      return
    }

    setLoadingProducts(true)
    try {
      const list = await listProductsByCategory(categoryId)
      if (current === requestId.current) {
        setProducts(list)
        setError('')
      }
    } catch (err) {
      if (current === requestId.current) setError(err?.message || 'Failed to load products.')
    } finally {
      if (current === requestId.current) setLoadingProducts(false)
    }
  }, [])

  const loadCategories = useCallback(async (preferId) => {
    setLoadingCategories(true)
    try {
      const list = await listCategories()
      setCategories(list)
      setSelectedId((currentId) => {
        const wanted = preferId || currentId
        return list.some((c) => c.id === wanted) ? wanted : list[0]?.id || ''
      })
      setError('')
    } catch (err) {
      setError(err?.message || 'Failed to load categories.')
    } finally {
      setLoadingCategories(false)
    }
  }, [])

  useEffect(() => {
    loadCategories()
  }, [loadCategories])

  useEffect(() => {
    loadProducts(selectedId)
  }, [selectedId, loadProducts])

  const handleDeleteCategory = async () => {
    if (!selected) return
    const ok = window.confirm(
      `Delete category "${selected.name}" and all ${products.length} product(s) and photos inside it? This cannot be undone.`,
    )
    if (!ok) return

    setBusy(true)
    setError('')
    try {
      await deleteCategory(selected)
      setSelectedId('')
      await loadCategories()
    } catch (err) {
      setError(err?.message || 'Could not delete category.')
    } finally {
      setBusy(false)
    }
  }

  const handleDeleteProduct = async (product) => {
    if (!window.confirm(`Delete "${product.name}" and its photos?`)) return

    setBusy(true)
    setError('')
    try {
      await deleteProduct(product)
      await loadProducts(selectedId)
    } catch (err) {
      setError(err?.message || 'Could not delete product.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="admin-catalog">
      <div className="admin-catalog__top">
        <div>
          <h2>Products</h2>
          <p className="admin-muted">Pick a category to see and manage the products inside it.</p>
        </div>
        <button type="button" className="btn btn--outline btn--sm" onClick={() => setCategoryModal({ category: null })} disabled={busy}>
          + Add category
        </button>
      </div>

      {error ? <p className="admin-error">{error}</p> : null}

      <div className="admin-catalog__panel">
        {/* ---------- Category tabs ---------- */}
        {loadingCategories ? (
          <p className="admin-muted">Loading categories…</p>
        ) : categories.length === 0 ? (
          <div className="admin-empty">
            <p>No categories yet.</p>
            <button type="button" className="btn btn--primary btn--sm" onClick={() => setCategoryModal({ category: null })}>
              Add your first category
            </button>
          </div>
        ) : (
          <>
            <div className="admin-tabs" role="tablist" aria-label="Categories">
              {categories.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  role="tab"
                  aria-selected={category.id === selectedId}
                  className={`admin-tab${category.id === selectedId ? ' is-active' : ''}`}
                  onClick={() => setSelectedId(category.id)}
                >
                  {category.name}
                </button>
              ))}
            </div>

            {/* ---------- Selected category + its products ---------- */}
            {selected ? (
              <div className="admin-catalog__body">
                <div className="admin-catalog__bar">
                  <div>
                    <h3>{selected.name}</h3>
                    <p className="admin-muted">
                      {loadingProducts ? '…' : products.length} item{products.length === 1 ? '' : 's'}
                    </p>
                  </div>
                  <div className="admin-catalog__actions">
                    <button type="button" className="admin-link" onClick={() => setCategoryModal({ category: selected })} disabled={busy}>
                      Rename
                    </button>
                    <button type="button" className="admin-link admin-link--danger" onClick={handleDeleteCategory} disabled={busy}>
                      Delete category
                    </button>
                    <button type="button" className="btn btn--primary btn--sm" onClick={() => setProductModal({ product: null })} disabled={busy}>
                      + Add product
                    </button>
                  </div>
                </div>

                {loadingProducts ? (
                  <p className="admin-muted">Loading products…</p>
                ) : products.length === 0 ? (
                  <div className="admin-empty">
                    <p>No products in {selected.name} yet.</p>
                  </div>
                ) : (
                  <ul className="product-list">
                    {products.map((product) => (
                      <li key={product.id} className="product-item">
                        <button type="button" className="product-item__main" onClick={() => setProductModal({ product })}>
                          <div className="product-item__media">
                            {product.images[0] ? (
                              <img src={product.images[0].url} alt="" loading="lazy" />
                            ) : (
                              <span>No photo</span>
                            )}
                            {product.images.length > 1 ? (
                              <span className="product-item__count">{product.images.length} photos</span>
                            ) : null}
                          </div>
                          <div className="product-item__body">
                            <strong>{product.name}</strong>
                            {product.condition ? <span className="product-item__tag">{product.condition}</span> : null}
                            {product.description ? <p>{product.description}</p> : null}
                          </div>
                        </button>
                        <div className="product-item__actions">
                          <button type="button" className="admin-link" onClick={() => setProductModal({ product })} disabled={busy}>
                            Edit
                          </button>
                          <button type="button" className="admin-link admin-link--danger" onClick={() => handleDeleteProduct(product)} disabled={busy}>
                            Delete
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ) : null}
          </>
        )}
      </div>

      {categoryModal ? (
        <CategoryModal
          category={categoryModal.category}
          onClose={() => setCategoryModal(null)}
          onSaved={async (id) => {
            setCategoryModal(null)
            await loadCategories(id)
          }}
        />
      ) : null}

      {productModal && selected ? (
        <ProductModal
          key={productModal.product?.id || 'new'}
          category={selected}
          product={productModal.product}
          onClose={() => setProductModal(null)}
          onSaved={async () => {
            setProductModal(null)
            await loadProducts(selected.id)
          }}
        />
      ) : null}
    </section>
  )
}

export default AdminProducts

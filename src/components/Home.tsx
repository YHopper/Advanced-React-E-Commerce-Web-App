import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useDispatch } from 'react-redux'
import { addToCart } from '../features/cart/cartSlice'
import type { AppDispatch } from '../store'
import type { Product } from '../types'

const placeholderImage = 'https://via.placeholder.com/300x300/ffffff/0f172a?text=No+Image'

const fetchProducts = async (): Promise<Product[]> => {
  const response = await fetch('https://fakestoreapi.com/products')

  if (!response.ok) {
    throw new Error('Unable to fetch products')
  }

  return response.json()
}

const fetchCategories = async (): Promise<string[]> => {
  const response = await fetch('https://fakestoreapi.com/products/categories')

  if (!response.ok) {
    throw new Error('Unable to fetch categories')
  }

  return response.json()
}

const fetchProductsByCategory = async (category: string): Promise<Product[]> => {
  const response = await fetch(`https://fakestoreapi.com/products/category/${category}`)

  if (!response.ok) {
    throw new Error('Unable to fetch products for selected category')
  }

  return response.json()
}

export function Home() {
  const dispatch = useDispatch<AppDispatch>()
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [message, setMessage] = useState('')

  const { data: categoriesData, isLoading: categoriesLoading, isError: categoriesError } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  })

  const {
    data: products,
    isLoading: productsLoading,
    isError: productsError,
    isFetching,
  } = useQuery<Product[]>({
    queryKey: ['products', selectedCategory],
    queryFn: () =>
      selectedCategory === 'all' ? fetchProducts() : fetchProductsByCategory(selectedCategory),
  })

  const isLoading = productsLoading || categoriesLoading
  const isError = productsError || categoriesError

  const handleAddToCart = (product: Product) => {
    dispatch(addToCart(product))
    setMessage(`${product.title} added to cart`)
    window.setTimeout(() => setMessage(''), 4000)
  }

  return (
    <section className="catalog-section">
      <div className="hero-copy mb-4 rounded-4 p-4 shadow-sm bg-white border">
        <div className="d-flex flex-column flex-md-row justify-content-between gap-3">
          <div>
            <p className="eyebrow text-uppercase mb-2">Product Catalog</p>
            <h2 className="fw-bold mb-2">Find the perfect products for your storefront</h2>
            <p className="text-muted mb-0">Use the category selector to filter the catalog and add items to your cart instantly.</p>
          </div>
        </div>
      </div>

      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-4">
        <div>
          <label className="form-label fw-semibold mb-2" htmlFor="category-select">
            Category filter
          </label>
          <select
            id="category-select"
            className="form-select w-100 w-md-auto"
            value={selectedCategory}
            onChange={(event) => setSelectedCategory(event.target.value)}
          >
            <option value="all">All categories</option>
            {categoriesData?.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {isFetching ? <div className="text-primary">Updating products...</div> : null}
      </div>

      {message ? (
        <div className="alert alert-success py-2 px-3 mb-4" role="status">
          {message}
        </div>
      ) : null}

      {isLoading ? (
        <div className="status-card bg-white border rounded-4 p-4 shadow-sm">Loading products...</div>
      ) : isError ? (
        <div className="status-card bg-white border rounded-4 p-4 shadow-sm text-danger">Unable to load products. Please refresh.</div>
      ) : (
        <div className="product-grid row row-cols-1 row-cols-md-2 row-cols-xl-3 g-4">
          {products?.map((product) => (
            <article className="col" key={product.id}>
              <div className="product-card card h-100 border-0 shadow-sm rounded-4 overflow-hidden">
                <img
                  className="card-img-top p-3 bg-white"
                  src={product.image}
                  alt={product.title}
                  style={{ height: '240px', objectFit: 'contain' }}
                  onError={(event) => {
                    event.currentTarget.src = placeholderImage
                  }}
                />
                <div className="card-body d-flex flex-column gap-3">
                  <div>
                    <p className="category text-uppercase small fw-semibold mb-1">{product.category}</p>
                    <h3 className="h6 fw-semibold mb-2">{product.title}</h3>
                    <p className="description text-muted small mb-3">{product.description.slice(0, 110)}...</p>
                  </div>

                  <div className="d-flex justify-content-between align-items-center gap-3">
                    <div>
                      <span className="badge bg-info text-dark me-2">★ {product.rating.rate}</span>
                      <span className="price fw-semibold">${product.price.toFixed(2)}</span>
                    </div>
                    <button type="button" className="btn btn-primary btn-sm" onClick={() => handleAddToCart(product)}>
                      Add to cart
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}

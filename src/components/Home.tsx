import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useDispatch } from 'react-redux'
import { addToCart } from '../features/cart/cartSlice'
import type { AppDispatch } from '../store'
import type { Product } from '../types'

const placeholderImage = 'https://via.placeholder.com/300x300?text=No+Image'

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

  const { data: categoriesData, isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  })

  const { data, isLoading, error } = useQuery({
    queryKey: ['products', selectedCategory],
    queryFn: () =>
      selectedCategory === 'all' ? fetchProducts() : fetchProductsByCategory(selectedCategory),
  })

  if (isLoading || categoriesLoading) {
    return <div className="status-card">Loading products...</div>
  }

  if (error) {
    return <div className="status-card">Could not load products right now.</div>
  }

  const handleAddToCart = (product: Product) => {
    dispatch(addToCart(product))
    setMessage(`${product.title} added to cart`)

    window.setTimeout(() => setMessage(''), 5000)
  }

  return (
    <section className="catalog-section">
      <div className="hero-copy mb-4">
        <p className="eyebrow text-uppercase mb-2">Featured picks</p>
        <h1 className="display-6 fw-bold mb-2">Shop the latest essentials</h1>
        <p className="text-muted">
          Browse a curated selection from the Fake Store API and build your cart in a
          few clicks.
        </p>
      </div>

      <label className="category-filter d-flex flex-column gap-2 mb-4" htmlFor="category-select">
        <span className="fw-semibold">Category</span>
        <select
          id="category-select"
          className="form-select w-auto"
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
      </label>

      {message ? (
        <div className="alert alert-success py-2 px-3 mb-4" role="status">
          {message}
        </div>
      ) : null}

      <div className="product-grid row row-cols-1 row-cols-md-2 row-cols-xl-3 g-4">
        {data?.map((product) => (
          <article className="col" key={product.id}>
            <div className="product-card card h-100 border-0 shadow-sm rounded-4 overflow-hidden">
              <img
                className="card-img-top p-3 bg-light"
                src={product.image}
                alt={product.title}
                style={{ height: '240px', objectFit: 'contain' }}
                onError={(event) => {
                  event.currentTarget.src = placeholderImage
                }}
              />
              <div className="card-body d-flex flex-column gap-2">
                <p className="category text-uppercase small fw-semibold mb-0">{product.category}</p>
                <h2 className="h5 fw-semibold mb-0">{product.title}</h2>
                <p className="description text-muted small flex-grow-1">
                  {product.description.slice(0, 110)}...
                </p>
                <div className="product-meta d-flex justify-content-between align-items-center mt-2">
                  <span className="rating badge bg-secondary-subtle text-dark">★ {product.rating.rate}</span>
                  <span className="price fw-bold">${product.price.toFixed(2)}</span>
                </div>
                <button type="button" className="btn btn-dark mt-2" onClick={() => handleAddToCart(product)}>
                  Add to cart
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

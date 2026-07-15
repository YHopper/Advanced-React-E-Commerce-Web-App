import { useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import './App.css'
import { Home } from './components/Home'
import { ShoppingCart } from './components/ShoppingCart'
import type { RootState } from './store'

function App() {
  const [view, setView] = useState<'home' | 'cart'>('home')
  const cartItems = useSelector((state: RootState) => state.cart)

  const cartCount = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems],
  )

  return (
    <div className="app-shell py-4 px-3 px-md-4">
      <header className="topbar rounded-5 shadow-sm p-4 mb-4 d-flex flex-column flex-lg-row justify-content-between align-items-start align-items-lg-center gap-3">
        <div>
          <p className="eyebrow text-uppercase mb-1">FakeStore Shop</p>
          <h1 className="h3 fw-bold mb-2">Digital storefront</h1>
          <p className="mb-0 text-white-50">Browse products, filter by category, and manage your cart with persistence.</p>
        </div>

        <div className="d-flex gap-2 align-items-center flex-wrap">
          <button type="button" className={`btn ${view === 'home' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setView('home')}>
            Shop
          </button>
          <button type="button" className={`btn ${view === 'cart' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setView('cart')}>
            Cart ({cartCount})
          </button>
        </div>
      </header>

      {view === 'home' ? <Home /> : <ShoppingCart onContinueShopping={() => setView('home')} />}
    </div>
  )
}

export default App

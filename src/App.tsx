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
      <header className="topbar rounded-4 border shadow-sm p-4 mb-4 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
        <div>
          <p className="eyebrow text-uppercase mb-1">Fake Store</p>
          <h1 className="h3 fw-bold mb-0">Modern Market</h1>
        </div>
        <nav className="topbar-nav d-flex gap-2">
          <button type="button" className="btn btn-outline-dark" onClick={() => setView('home')}>
            Home
          </button>
          <button type="button" className="btn btn-dark" onClick={() => setView('cart')}>
            Cart ({cartCount})
          </button>
        </nav>
      </header>

      {view === 'home' ? <Home /> : <ShoppingCart onContinueShopping={() => setView('home')} />}
    </div>
  )
}

export default App

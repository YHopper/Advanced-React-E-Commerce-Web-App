import { useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { clearCart, removeFromCart, updateQuantity } from '../features/cart/cartSlice'
import type { AppDispatch, RootState } from '../store'

interface ShoppingCartProps {
  onContinueShopping: () => void
}

const placeholderImage = 'https://via.placeholder.com/150x150/ffffff/0f172a?text=No+Image'

export function ShoppingCart({ onContinueShopping }: ShoppingCartProps) {
  const dispatch = useDispatch<AppDispatch>()
  const items = useSelector((state: RootState) => state.cart)
  const [checkoutComplete, setCheckoutComplete] = useState(false)
  const [message, setMessage] = useState('')

  const totalItems = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items],
  )

  const totalPrice = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items],
  )

  const handleCheckout = () => {
    dispatch(clearCart())
    setCheckoutComplete(true)
    setMessage('Checkout completed. Your cart has been cleared.')
    window.setTimeout(() => {
      setCheckoutComplete(false)
      setMessage('')
    }, 3000)
  }

  const handleRemoveItem = (itemId: number, title: string) => {
    const confirmed = window.confirm(`Remove "${title}" from your cart?`)

    if (!confirmed) {
      return
    }

    dispatch(removeFromCart(itemId))
    setMessage(`${title} removed from cart`)
    window.setTimeout(() => setMessage(''), 4000)
  }

  return (
    <section className="cart-section">
      <div className="cart-header d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-4">
        <div>
          <p className="eyebrow text-uppercase mb-1">Shopping cart</p>
          <h2 className="fw-bold mb-0">Your order summary</h2>
        </div>

        <div className="cart-summary-card rounded-4 border p-4 shadow-sm bg-white text-center">
          <p className="mb-1 text-muted">Items in cart</p>
          <h3 className="fw-semibold mb-0">{totalItems}</h3>
          <p className="mb-0 text-muted">Total price</p>
          <strong>${totalPrice.toFixed(2)}</strong>
        </div>
      </div>

      {message ? (
        <div className="alert alert-info py-2 px-3 mb-4" role="status">
          {message}
        </div>
      ) : null}

      {items.length === 0 ? (
        <div className="empty-state rounded-4 border p-4 shadow-sm text-center bg-white">
          {checkoutComplete ? (
            <p className="success-message fw-bold text-success mb-3">Checkout complete! Your cart is ready for new items.</p>
          ) : (
            <p className="text-muted mb-3">Your cart is empty. Add products from the shop to begin.</p>
          )}
          <button type="button" className="btn btn-primary" onClick={onContinueShopping}>
            Continue shopping
          </button>
        </div>
      ) : (
        <div className="cart-layout row g-4">
          <div className="col-lg-8">
            <ul className="cart-list list-unstyled d-flex flex-column gap-3">
              {items.map((item) => (
                <li className="cart-item rounded-4 border p-3 shadow-sm bg-white d-flex flex-column flex-sm-row align-items-start gap-3" key={item.id}>
                  <img
                    src={item.image}
                    alt={item.title}
                    className="rounded-4 flex-shrink-0"
                    style={{ width: '120px', height: '120px', objectFit: 'contain' }}
                    onError={(event) => {
                      event.currentTarget.src = placeholderImage
                    }}
                  />

                  <div className="flex-grow-1 d-flex flex-column justify-content-between">
                    <div>
                      <h3 className="h6 fw-semibold mb-1">{item.title}</h3>
                      <p className="text-muted small mb-2">{item.category}</p>
                      <p className="mb-2">Unit price: <strong>${item.price.toFixed(2)}</strong></p>
                    </div>

                    <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3">
                      <div className="quantity-controls d-flex align-items-center gap-2">
                        <button
                          type="button"
                          className="btn btn-outline-primary btn-sm"
                          onClick={() =>
                            dispatch(updateQuantity({ id: item.id, quantity: item.quantity - 1 }))
                          }
                        >
                          −
                        </button>
                        <span className="fw-semibold">{item.quantity}</span>
                        <button
                          type="button"
                          className="btn btn-outline-primary btn-sm"
                          onClick={() =>
                            dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))
                          }
                        >
                          +
                        </button>
                      </div>

                      <div className="d-flex flex-column align-items-start align-items-sm-end gap-2">
                        <strong>${(item.price * item.quantity).toFixed(2)}</strong>
                        <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => handleRemoveItem(item.id, item.title)}>
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <aside className="checkout-card rounded-4 border p-4 shadow-sm bg-white col-lg-4">
            <h3 className="h5 fw-semibold mb-3">Checkout</h3>
            <div className="checkout-row d-flex justify-content-between mb-2">
              <span className="text-muted">Items</span>
              <span>{totalItems}</span>
            </div>
            <div className="checkout-row d-flex justify-content-between mb-3">
              <span className="text-muted">Total</span>
              <strong>${totalPrice.toFixed(2)}</strong>
            </div>
            <button type="button" className="btn btn-primary w-100" onClick={handleCheckout}>
              Complete checkout
            </button>
          </aside>
        </div>
      )}
    </section>
  )
}

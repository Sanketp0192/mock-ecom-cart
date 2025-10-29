import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ProductImage from './ProductImage'

function Cart({ cart, onUpdateCart, onRemoveFromCart }) {
  const [updatingItems, setUpdatingItems] = useState({})
  const navigate = useNavigate()

  const handleQuantityChange = async (itemId, newQty) => {
    setUpdatingItems(prev => ({ ...prev, [itemId]: true }))
    try {
      await onUpdateCart(itemId, newQty)
    } finally {
      setUpdatingItems(prev => ({ ...prev, [itemId]: false }))
    }
  }

  const handleRemoveItem = async (itemId) => {
    setUpdatingItems(prev => ({ ...prev, [itemId]: true }))
    try {
      await onRemoveFromCart(itemId)
    } finally {
      setUpdatingItems(prev => ({ ...prev, [itemId]: false }))
    }
  }

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="empty-cart">
        <h2>Your cart is empty</h2>
        <p>Add some products to get started!</p>
      </div>
    )
  }

  return (
    <div className="cart-container">
      <h1>Shopping Cart</h1>
      
      <div className="cart-items">
        {cart.items.map(item => (
          <div key={item.id} className="cart-item">
            <ProductImage 
              src={item.image}
              alt={item.name}
              className="cart-item-image"
            />
            <div className="cart-item-details">
              <h3 className="cart-item-name">{item.name}</h3>
              <div className="cart-item-price">${item.unitPrice}</div>
            </div>
            
            <div className="quantity-controls">
              <button
                className="quantity-btn"
                onClick={() => handleQuantityChange(item.id, item.qty - 1)}
                disabled={updatingItems[item.id]}
              >
                -
              </button>
              <input
                type="number"
                value={item.qty}
                onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
                className="quantity-input"
                min="1"
                disabled={updatingItems[item.id]}
              />
              <button
                className="quantity-btn"
                onClick={() => handleQuantityChange(item.id, item.qty + 1)}
                disabled={updatingItems[item.id]}
              >
                +
              </button>
            </div>
            
            <div className="cart-item-total">
              ${item.lineTotal}
            </div>
            
            <button
              className="remove-btn"
              onClick={() => handleRemoveItem(item.id)}
              disabled={updatingItems[item.id]}
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="cart-summary">
        <div className="summary-row">
          <span>Subtotal:</span>
          <span>${cart.subtotal}</span>
        </div>
        <div className="summary-row">
          <span>Tax:</span>
          <span>${cart.tax}</span>
        </div>
        <div className="summary-row summary-total">
          <span>Total:</span>
          <span>${cart.total}</span>
        </div>
        
        <button
          className="checkout-btn"
          onClick={() => navigate('/checkout')}
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  )
}

export default Cart
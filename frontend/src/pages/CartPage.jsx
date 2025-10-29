import React, { useState, useEffect } from 'react'
import Cart from '../components/Cart'

function CartPage({ onCartUpdate }) {
  const [cart, setCart] = useState({ items: [], subtotal: 0, tax: 0, total: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCart()
  }, [])

  const fetchCart = async () => {
    try {
      const response = await fetch('/api/cart')
      if (!response.ok) throw new Error('Failed to fetch cart')
      const data = await response.json()
      setCart(data)
    } catch (err) {
      console.error('Error fetching cart:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateCart = async (itemId, newQty) => {
    try {
      const response = await fetch(`/api/cart/${itemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ qty: newQty }),
      })

      if (!response.ok) throw new Error('Failed to update cart')
      
      const updatedCart = await response.json()
      setCart(updatedCart)
      await onCartUpdate()
    } catch (err) {
      console.error('Error updating cart:', err)
      alert('Failed to update cart. Please try again.')
    }
  }

  const handleRemoveFromCart = async (itemId) => {
    try {
      const response = await fetch(`/api/cart/${itemId}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to remove from cart')
      
      const updatedCart = await response.json()
      setCart(updatedCart)
      await onCartUpdate()
    } catch (err) {
      console.error('Error removing from cart:', err)
      alert('Failed to remove item from cart. Please try again.')
    }
  }

  if (loading) return <div className="loading">Loading cart...</div>

  return (
    <div className="container">
      <Cart
        cart={cart}
        onUpdateCart={handleUpdateCart}
        onRemoveFromCart={handleRemoveFromCart}
      />
    </div>
  )
}

export default CartPage
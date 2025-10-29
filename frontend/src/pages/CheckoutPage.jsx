import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Checkout from '../components/Checkout'
import Receipt from '../components/Receipt'

function CheckoutPage({ onCartUpdate }) {
  const [cart, setCart] = useState({ items: [], subtotal: 0, tax: 0, total: 0 })
  const [receipt, setReceipt] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

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

  const handleSubmitCheckout = async (formData) => {
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          cartItems: cart.items
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Checkout failed')
      }

      const receiptData = await response.json()
      setReceipt(receiptData)
      await onCartUpdate()
    } catch (err) {
      console.error('Error during checkout:', err)
      alert(err.message || 'Checkout failed. Please try again.')
      throw err
    }
  }

  const handleCloseReceipt = () => {
    setReceipt(null)
    navigate('/')
  }

  if (loading) return <div className="loading">Loading...</div>

  if (receipt) {
    return <Receipt receipt={receipt} onClose={handleCloseReceipt} />
  }

  return (
    <div className="container">
      <Checkout 
        cart={cart} 
        onSubmitCheckout={handleSubmitCheckout}
      />
    </div>
  )
}

export default CheckoutPage
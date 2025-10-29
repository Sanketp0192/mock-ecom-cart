import React, { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import ProductsPage from './pages/ProductsPage'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import './App.css'

function App() {
  const [cartCount, setCartCount] = useState(0)

  const updateCartCount = async () => {
    try {
      const response = await fetch('/api/cart')
      const cart = await response.json()
      setCartCount(cart.items.reduce((total, item) => total + item.qty, 0))
    } catch (error) {
      console.error('Error fetching cart count:', error)
    }
  }

  useEffect(() => {
    updateCartCount()
  }, [])

  return (
    <div className="app">
      <Navbar cartCount={cartCount} />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<ProductsPage onCartUpdate={updateCartCount} />} />
          <Route path="/cart" element={<CartPage onCartUpdate={updateCartCount} />} />
          <Route path="/checkout" element={<CheckoutPage onCartUpdate={updateCartCount} />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
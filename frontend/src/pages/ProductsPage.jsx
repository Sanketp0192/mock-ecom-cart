import React, { useState, useEffect } from 'react'
import ProductGrid from '../components/ProductGrid'

function ProductsPage({ onCartUpdate }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/products')
      if (!response.ok) throw new Error('Failed to fetch products')
      const data = await response.json()
      setProducts(data)
    } catch (err) {
      setError('Failed to load products. Please try again.')
      console.error('Error fetching products:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = async (productId) => {
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId, qty: 1 }),
      })

      if (!response.ok) throw new Error('Failed to add to cart')
      
      await onCartUpdate()
    } catch (err) {
      console.error('Error adding to cart:', err)
      alert('Failed to add item to cart. Please try again.')
    }
  }

  if (loading) return <div className="loading">Loading products...</div>
  if (error) return <div className="error">{error}</div>

  return (
    <div className="container">
      <h1>Our Products</h1>
      <p className="page-description">
        Discover our amazing collection of products
      </p>
      <ProductGrid 
        products={products} 
        onAddToCart={handleAddToCart}
      />
    </div>
  )
}

export default ProductsPage
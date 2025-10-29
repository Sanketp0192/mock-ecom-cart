import React, { useState } from 'react'
import ProductImage from './ProductImage'

function ProductGrid({ products, onAddToCart }) {
  const [addingProduct, setAddingProduct] = useState(null)

  const handleAddToCart = async (productId) => {
    setAddingProduct(productId)
    try {
      await onAddToCart(productId)
    } finally {
      setAddingProduct(null)
    }
  }

  return (
    <div className="products-grid">
      {products.map(product => (
        <div key={product.id} className="product-card">
          <ProductImage 
            src={product.image}
            alt={product.name}
            className="product-image"
          />
          <h3 className="product-name">{product.name}</h3>
          <p className="product-description">{product.description}</p>
          <div className="product-price">${product.price}</div>
          <button
            className="add-to-cart-btn"
            onClick={() => handleAddToCart(product.id)}
            disabled={addingProduct === product.id}
          >
            {addingProduct === product.id ? 'Adding...' : 'Add to Cart'}
          </button>
        </div>
      ))}
    </div>
  )
}

export default ProductGrid
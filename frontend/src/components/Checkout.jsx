import React, { useState } from 'react'

function Checkout({ cart, onSubmitCheckout }) {
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    setIsSubmitting(true)
    try {
      await onSubmitCheckout(formData)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="checkout-container">
      <h1>Checkout</h1>
      
      <div className="cart-summary" style={{ marginBottom: '2rem' }}>
        <h3>Order Summary</h3>
        {cart.items.map(item => (
          <div key={item.id} className="summary-row">
            <span>{item.name} × {item.qty}</span>
            <span>${item.lineTotal}</span>
          </div>
        ))}
        <div className="summary-row summary-total">
          <span>Total:</span>
          <span>${cart.total}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="checkout-form">
        <div className="form-group">
          <label htmlFor="name" className="form-label">Full Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`form-input ${errors.name ? 'error' : ''}`}
            placeholder="Enter your full name"
          />
          {errors.name && <div className="error">{errors.name}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="email" className="form-label">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`form-input ${errors.email ? 'error' : ''}`}
            placeholder="Enter your email"
          />
          {errors.email && <div className="error">{errors.email}</div>}
        </div>

        <button
          type="submit"
          className="submit-btn"
          disabled={isSubmitting || cart.items.length === 0}
        >
          {isSubmitting ? 'Processing...' : 'Complete Order'}
        </button>
      </form>
    </div>
  )
}

export default Checkout
import React from 'react'
import { Link, useLocation } from 'react-router-dom'

function Navbar({ cartCount }) {
  const location = useLocation()

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <div className="logo">Vibe Commerce</div>
        <div className="nav-links">
          <Link 
            to="/" 
            className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
          >
            Products
          </Link>
          <Link 
            to="/cart" 
            className={`nav-link ${location.pathname === '/cart' ? 'active' : ''}`}
          >
            Cart
            {cartCount > 0 && (
              <span className="cart-badge">{cartCount}</span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
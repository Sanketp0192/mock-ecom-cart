const express = require('express');
const Cart = require('../models/Cart');
const router = express.Router();

// GET /api/cart - Get cart contents
router.get('/', (req, res) => {
  Cart.getAllItems((err, cart) => {
    if (err) {
      console.error('Error fetching cart:', err);
      return res.status(500).json({ error: 'Failed to fetch cart' });
    }
    res.json(cart);
  });
});

// POST /api/cart - Add item to cart
router.post('/', (req, res) => {
  const { productId, qty = 1 } = req.body;

  if (!productId) {
    return res.status(400).json({ error: 'Product ID is required' });
  }

  if (qty < 1) {
    return res.status(400).json({ error: 'Quantity must be at least 1' });
  }

  Cart.addItem(productId, parseInt(qty), (err, cart) => {
    if (err) {
      console.error('Error adding to cart:', err);
      return res.status(500).json({ error: 'Failed to add item to cart' });
    }
    res.json(cart);
  });
});

// DELETE /api/cart/:id - Remove item from cart
router.delete('/:id', (req, res) => {
  const itemId = req.params.id;

  Cart.removeItem(itemId, (err, cart) => {
    if (err) {
      console.error('Error removing from cart:', err);
      return res.status(500).json({ error: 'Failed to remove item from cart' });
    }
    res.json(cart);
  });
});

// PUT /api/cart/:id - Update item quantity
router.put('/:id', (req, res) => {
  const itemId = req.params.id;
  const { qty } = req.body;

  if (!qty || qty < 0) {
    return res.status(400).json({ error: 'Valid quantity is required' });
  }

  Cart.updateItemQuantity(itemId, parseInt(qty), (err, cart) => {
    if (err) {
      console.error('Error updating cart:', err);
      return res.status(500).json({ error: 'Failed to update cart' });
    }
    res.json(cart);
  });
});

module.exports = router;
const express = require('express');
const Cart = require('../models/Cart');
const Receipt = require('../models/Receipt');
const router = express.Router();

// POST /api/checkout - Process checkout
router.post('/', (req, res) => {
  const { name, email } = req.body;

  // Validation
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  if (!/\S+@\S+\.\S+/.test(email)) {
    return res.status(400).json({ error: 'Valid email is required' });
  }

  // Get current cart
  Cart.getAllItems((err, cart) => {
    if (err) {
      console.error('Error fetching cart:', err);
      return res.status(500).json({ error: 'Failed to process checkout' });
    }

    if (!cart.items || cart.items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    // Create receipt
    const receiptData = {
      items: cart.items,
      total: cart.total,
      name,
      email
    };

    Receipt.create(receiptData, (err, receipt) => {
      if (err) {
        console.error('Error creating receipt:', err);
        return res.status(500).json({ error: 'Failed to process checkout' });
      }

      // Clear cart after successful checkout
      Cart.clearCart((clearErr) => {
        if (clearErr) {
          console.error('Error clearing cart:', clearErr);
        }

        res.json(receipt);
      });
    });
  });
});

module.exports = router;
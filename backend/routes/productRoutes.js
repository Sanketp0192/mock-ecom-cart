const express = require('express');
const Product = require('../models/Product');
const router = express.Router();

// GET /api/products - Get all products
router.get('/', (req, res) => {
  Product.getAll((err, products) => {
    if (err) {
      console.error('Error fetching products:', err);
      return res.status(500).json({ error: 'Failed to fetch products' });
    }
    res.json(products);
  });
});

// GET /api/products/:id - Get single product
router.get('/:id', (req, res) => {
  const productId = req.params.id;
  
  Product.findById(productId, (err, product) => {
    if (err) {
      console.error('Error fetching product:', err);
      return res.status(500).json({ error: 'Failed to fetch product' });
    }
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json(product);
  });
});

module.exports = router;
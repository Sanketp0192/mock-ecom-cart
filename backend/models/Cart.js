const db = require('../db/connect');
const { v4: uuidv4 } = require('uuid');

class Cart {
  static getAllItems(callback) {
    const sql = `
      SELECT ci.*, p.name, p.image 
      FROM cart_items ci 
      JOIN products p ON ci.productId = p.id
    `;
    
    db.all(sql, [], (err, rows) => {
      if (err) return callback(err);
      
      const subtotal = rows.reduce((sum, item) => sum + item.lineTotal, 0);
      const tax = subtotal * 0.1; // 10% tax
      const total = subtotal + tax;
      
      callback(null, {
        items: rows,
        subtotal: parseFloat(subtotal.toFixed(2)),
        tax: parseFloat(tax.toFixed(2)),
        total: parseFloat(total.toFixed(2))
      });
    });
  }

  static addItem(productId, qty, callback) {
    // First get product details
    const getProductSql = `SELECT * FROM products WHERE id = ?`;
    db.get(getProductSql, [productId], (err, product) => {
      if (err) return callback(err);
      if (!product) return callback(new Error('Product not found'));

      const unitPrice = product.price;
      const lineTotal = unitPrice * qty;

      // Check if item already in cart
      const checkSql = `SELECT * FROM cart_items WHERE productId = ?`;
      db.get(checkSql, [productId], (err, existingItem) => {
        if (err) return callback(err);

        if (existingItem) {
          // Update existing item
          const newQty = existingItem.qty + qty;
          const newLineTotal = unitPrice * newQty;
          
          const updateSql = `UPDATE cart_items SET qty = ?, lineTotal = ? WHERE productId = ?`;
          db.run(updateSql, [newQty, newLineTotal, productId], function(err) {
            if (err) return callback(err);
            Cart.getAllItems(callback);
          });
        } else {
          // Insert new item
          const newItemId = uuidv4();
          const insertSql = `INSERT INTO cart_items (id, productId, qty, unitPrice, lineTotal) VALUES (?, ?, ?, ?, ?)`;
          db.run(insertSql, [newItemId, productId, qty, unitPrice, lineTotal], function(err) {
            if (err) return callback(err);
            Cart.getAllItems(callback);
          });
        }
      });
    });
  }

  static removeItem(itemId, callback) {
    const sql = `DELETE FROM cart_items WHERE id = ?`;
    db.run(sql, [itemId], function(err) {
      if (err) return callback(err);
      Cart.getAllItems(callback);
    });
  }

  static updateItemQuantity(itemId, qty, callback) {
    if (qty <= 0) {
      return Cart.removeItem(itemId, callback);
    }

    const sql = `UPDATE cart_items SET qty = ?, lineTotal = unitPrice * ? WHERE id = ?`;
    db.run(sql, [qty, qty, itemId], function(err) {
      if (err) return callback(err);
      Cart.getAllItems(callback);
    });
  }

  static clearCart(callback) {
    const sql = `DELETE FROM cart_items`;
    db.run(sql, [], function(err) {
      if (err) return callback(err);
      callback(null, { message: 'Cart cleared' });
    });
  }
}

module.exports = Cart;
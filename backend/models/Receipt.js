const db = require('../db/connect');
const { v4: uuidv4 } = require('uuid');

class Receipt {
  static create(receiptData, callback) {
    const receiptId = `RCP-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const itemsJson = JSON.stringify(receiptData.items);
    
    const sql = `INSERT INTO receipts (receiptId, items, total, name, email) VALUES (?, ?, ?, ?, ?)`;
    
    db.run(sql, [
      receiptId,
      itemsJson,
      receiptData.total,
      receiptData.name,
      receiptData.email
    ], function(err) {
      if (err) return callback(err);
      
      callback(null, {
        receiptId,
        total: receiptData.total,
        timestamp: new Date().toISOString()
      });
    });
  }

  static findById(receiptId, callback) {
    const sql = `SELECT * FROM receipts WHERE receiptId = ?`;
    db.get(sql, [receiptId], callback);
  }
}

module.exports = Receipt;
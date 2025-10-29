const db = require('../db/connect');

class Product {
  static getAll(callback) {
    const sql = `SELECT * FROM products`;
    db.all(sql, [], callback);
  }

  static findById(id, callback) {
    const sql = `SELECT * FROM products WHERE id = ?`;
    db.get(sql, [id], callback);
  }
}

module.exports = Product;
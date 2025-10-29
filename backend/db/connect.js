const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Ensure db directory exists
const dbDir = path.join(__dirname);
const dbPath = path.join(dbDir, 'ecommerce.db');

console.log('📁 Database path:', dbPath);

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Error opening database:', err.message);
    console.error('Please make sure the "db" directory exists and is writable');
    process.exit(1);
  } else {
    console.log('✅ Connected to SQLite database');
    initializeDatabase();
  }
});

function initializeDatabase() {
  console.log('🔄 Initializing database tables...');

  db.serialize(() => {
    // 1. Create products table
    db.run(`CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      price REAL NOT NULL,
      description TEXT,
      image TEXT
    )`, function(err) {
      if (err) {
        console.error('❌ Error creating products table:', err);
      } else {
        console.log('✅ Products table created/verified');

        // 2. Create cart_items table
        db.run(`CREATE TABLE IF NOT EXISTS cart_items (
          id TEXT PRIMARY KEY,
          productId TEXT NOT NULL,
          qty INTEGER NOT NULL,
          unitPrice REAL NOT NULL,
          lineTotal REAL NOT NULL,
          FOREIGN KEY (productId) REFERENCES products (id)
        )`, function(err) {
          if (err) {
            console.error('❌ Error creating cart_items table:', err);
          } else {
            console.log('✅ Cart items table created/verified');

            // 3. Create receipts table
            db.run(`CREATE TABLE IF NOT EXISTS receipts (
              receiptId TEXT PRIMARY KEY,
              items TEXT NOT NULL,
              total REAL NOT NULL,
              name TEXT NOT NULL,
              email TEXT NOT NULL,
              timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
            )`, function(err) {
              if (err) {
                console.error('❌ Error creating receipts table:', err);
              } else {
                console.log('✅ Receipts table created/verified');
                insertMockProducts(); // Insert mock data after all tables exist
              }
            });
          }
        });
      }
    });
  });
}

// Updated insertMockProducts with Unsplash images + 8 products
function insertMockProducts() {
  console.log('📦 Inserting mock products...');

  const mockProducts = [
    {
      id: 'p1',
      name: 'Wireless Bluetooth Headphones',
      price: 199.99,
      description: 'High-quality wireless headphones with noise cancellation',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=200&fit=crop'
    },
    {
      id: 'p2',
      name: 'Smartphone Pro',
      price: 899.99,
      description: 'Latest smartphone with advanced camera and processing',
      image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&h=200&fit=crop'
    },
    {
      id: 'p3',
      name: 'Laptop Ultra',
      price: 1299.99,
      description: 'Powerful laptop for work and gaming',
      image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300&h=200&fit=crop'
    },
    {
      id: 'p4',
      name: 'Smart Watch',
      price: 299.99,
      description: 'Feature-rich smartwatch with health monitoring',
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=200&fit=crop'
    },
    {
      id: 'p5',
      name: 'Tablet Mini',
      price: 499.99,
      description: 'Compact tablet perfect for reading and media',
      image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=300&h=200&fit=crop'
    },
    {
      id: 'p6',
      name: 'Gaming Console',
      price: 399.99,
      description: 'Next-gen gaming console with 4K support',
      image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=300&h=200&fit=crop'
    },
    {
      id: 'p7',
      name: 'Digital Camera',
      price: 599.99,
      description: 'Professional camera with 4K video recording',
      image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=300&h=200&fit=crop'
    }
  ];

  let insertedCount = 0;
  const totalProducts = mockProducts.length;

  mockProducts.forEach(product => {
    db.run(
      `INSERT OR REPLACE INTO products (id, name, price, description, image) VALUES (?, ?, ?, ?, ?)`,
      [product.id, product.name, product.price, product.description, product.image],
      function(err) {
        if (err) {
          console.error(`❌ Error inserting product ${product.id}:`, err);
        } else {
          if (this.changes > 0) {
            insertedCount++;
            console.log(`✅ Inserted product: ${product.name}`);
          }
        }

        if (insertedCount === totalProducts) {
          console.log(`🎉 Successfully inserted ${insertedCount} mock products`);
          console.log('🚀 Database initialization complete!');
        }
      }
    );
  });
}

// Handle database errors
db.on('error', (err) => {
  console.error('💥 Database error:', err);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🔄 Closing database connection...');
  db.close((err) => {
    if (err) {
      console.error('❌ Error closing database:', err.message);
    } else {
      console.log('✅ Database connection closed.');
    }
    process.exit(0);
  });
});

module.exports = db;

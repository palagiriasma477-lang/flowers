import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'bouquet_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export const initDB = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Connected to MySQL database successfully!');

    // Users table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(150) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role ENUM('customer', 'admin') DEFAULT 'customer',
        phone VARCHAR(20),
        address TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // Categories table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        slug VARCHAR(100) UNIQUE NOT NULL,
        description TEXT,
        image_url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // Products table (Bouquets)
    await connection.query(`
      CREATE TABLE IF NOT EXISTS products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        category_id INT,
        name VARCHAR(150) NOT NULL,
        slug VARCHAR(150) UNIQUE,
        description TEXT,
        price DECIMAL(10, 2) NOT NULL,
        discounted_price DECIMAL(10, 2),
        image_url TEXT NOT NULL,
        flowers_included TEXT,
        stem_count INT DEFAULT 12,
        occasion VARCHAR(100) DEFAULT 'General',
        rating DECIMAL(2, 1) DEFAULT 4.9,
        review_count INT DEFAULT 18,
        stock INT DEFAULT 50,
        is_bestseller BOOLEAN DEFAULT FALSE,
        is_featured BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // Orders table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NULL,
        order_number VARCHAR(50) UNIQUE NOT NULL,
        customer_name VARCHAR(100) NOT NULL,
        customer_email VARCHAR(150) NOT NULL,
        customer_phone VARCHAR(20) NOT NULL,
        delivery_address TEXT NOT NULL,
        delivery_date DATE NOT NULL,
        delivery_slot VARCHAR(50) DEFAULT 'Morning (9 AM - 1 PM)',
        greeting_message TEXT,
        sender_name VARCHAR(100),
        total_amount DECIMAL(10, 2) NOT NULL,
        payment_method VARCHAR(50) DEFAULT 'Online / UPI',
        payment_status ENUM('paid', 'pending', 'failed') DEFAULT 'paid',
        order_status ENUM('placed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled') DEFAULT 'placed',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // Order items table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS order_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        order_id INT NOT NULL,
        product_id INT NULL,
        product_name VARCHAR(150) NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        quantity INT NOT NULL DEFAULT 1,
        custom_notes TEXT,
        FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // Custom bouquets configured by users
    await connection.query(`
      CREATE TABLE IF NOT EXISTS custom_bouquets (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NULL,
        flower_types JSON NOT NULL,
        wrapper_color VARCHAR(50) NOT NULL,
        ribbon_color VARCHAR(50) NOT NULL,
        stems INT NOT NULL,
        add_ons JSON,
        custom_message TEXT,
        calculated_price DECIMAL(10, 2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // Check and Seed Default Admin User
    const [existingAdmin] = await connection.query('SELECT id FROM users WHERE email = ?', ['admin@petalcraft.com']);
    if (existingAdmin.length === 0) {
      const hashedPass = await bcrypt.hash('admin123', 10);
      await connection.query(`
        INSERT INTO users (name, email, password, role, phone, address)
        VALUES (?, ?, ?, 'admin', '+91 93900 11965', 'Hyderabad Flower Market, Telangana')
      `, ['Admin Florist', 'admin@petalcraft.com', hashedPass]);
      console.log('🌱 Admin user seeded: admin@petalcraft.com (pass: admin123)');
    }

    // Check and Seed Categories
    const [existingCategories] = await connection.query('SELECT COUNT(*) as count FROM categories');
    if (existingCategories[0].count === 0) {
      const categories = [
        ['Rose Bouquets', 'rose-bouquets', 'Classic and romantic hand-tied rose bouquets in vibrant shades.', 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=600&q=80'],
        ['Lily Elegance', 'lily-elegance', 'Fragrant Asiatic and Oriental lilies crafted for celebrations.', 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=600&q=80'],
        ['Exotic Orchids', 'exotic-orchids', 'Long-lasting luxury purple and white orchid arrangements.', 'https://images.unsplash.com/photo-1525310072745-f49212b5ac6d?auto=format&fit=crop&w=600&q=80'],
        ['Carnation & Mixed', 'carnation-mixed', 'Joyful colorful carnations blended with baby breath and greenery.', 'https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?auto=format&fit=crop&w=600&q=80'],
        ['Luxury Arrangements', 'luxury-arrangements', 'Opulent oversized grand celebration floral bouquets and gift boxes.', 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=600&q=80']
      ];

      for (const cat of categories) {
        await connection.query('INSERT INTO categories (name, slug, description, image_url) VALUES (?, ?, ?, ?)', cat);
      }
      console.log('🌱 Default flower categories seeded!');
    }

    // Check and Seed Products
    const [existingProducts] = await connection.query('SELECT COUNT(*) as count FROM products');
    if (existingProducts[0].count === 0) {
      const bouquets = [
        [
          1,
          'Crimson Passion 24 Red Roses Bouquet',
          'crimson-passion-24-red-roses',
          '24 freshly plucked Dutch red roses wrapped in signature matte black paper and satin gold ribbon. Perfect for anniversaries and love expressions.',
          1499.00,
          1299.00,
          'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=800&q=80',
          '24 Premium Red Dutch Roses, Gypsophila fillers, Eucalyptus leaves',
          24,
          'Romance',
          4.9,
          142,
          50,
          1,
          1
        ],
        [
          1,
          'Blush Pink Romance 18 Roses',
          'blush-pink-romance-18-roses',
          'Soft pink avalanche roses paired with delicate white baby breath fillers in a pastel blush paper wrap.',
          1299.00,
          1099.00,
          'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80',
          '18 Soft Pink Roses, White Gypsophila, Italian Ruscus',
          18,
          'Birthday',
          4.8,
          98,
          40,
          1,
          1
        ],
        [
          2,
          'Serene White Oriental Lilies Bouquet',
          'serene-white-oriental-lilies',
          'Fragrant pure white Oriental lilies with multiple blooms per stem, arranged with seasonal foliage.',
          1699.00,
          1449.00,
          'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=800&q=80',
          '8 Stems Oriental White Lilies (16+ Buds), Ruscus Greens',
          16,
          'Anniversary',
          4.9,
          65,
          30,
          0,
          1
        ],
        [
          3,
          'Royal Purple Orchid Symphony',
          'royal-purple-orchid-symphony',
          'Stunning long-stemmed Thai purple dendrobium orchids wrapped in craft paper with a silk ribbon tie.',
          1399.00,
          1199.00,
          'https://images.unsplash.com/photo-1525310072745-f49212b5ac6d?auto=format&fit=crop&w=800&q=80',
          '12 Long Stem Thai Purple Orchids, Palm Greens',
          12,
          'Congratulations',
          4.9,
          83,
          45,
          1,
          1
        ],
        [
          4,
          'Sunset Sunshine Mixed Sunflower & Rose',
          'sunset-sunshine-mixed-bouquet',
          'Vibrant bright yellow sunflowers, peach roses, and yellow daisies radiating warmth and happiness.',
          1599.00,
          1349.00,
          'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?auto=format&fit=crop&w=800&q=80',
          '5 Golden Sunflowers, 10 Peach Roses, Solidago fillers',
          20,
          'Birthday',
          4.8,
          110,
          35,
          1,
          1
        ],
        [
          4,
          'Pastel Dream Carnations & Chrysanthemums',
          'pastel-dream-carnations',
          'Sweet pastel mixed carnations in pink, white and lavender hues with delicate green foliage.',
          999.00,
          849.00,
          'https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?auto=format&fit=crop&w=800&q=80',
          '15 Multi-shade Carnations, Button Chrysanthemums',
          18,
          'Congratulations',
          4.7,
          56,
          60,
          0,
          0
        ],
        [
          5,
          'Grand Imperial 50 Luxury Roses Box',
          'grand-imperial-50-luxury-roses',
          'An extravagant heart-stopping arrangement of 50 velvety red & white roses presented in a round velvet hatbox.',
          3499.00,
          2999.00,
          'https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=800&q=80',
          '50 Handpicked Premium Roses, Pearl pins, Luxury Box',
          50,
          'Anniversary',
          5.0,
          178,
          20,
          1,
          1
        ],
        [
          1,
          'Velvet Scarlet & Golden Ribbon 12 Roses',
          'velvet-scarlet-12-roses',
          'Classic dozen red roses with fresh eucalyptus sprigs in rustic eco-craft brown paper wrap.',
          899.00,
          749.00,
          'https://images.unsplash.com/photo-1548094878-84ced0f68c08?auto=format&fit=crop&w=800&q=80',
          '12 Scarlet Red Roses, Eucalyptus Greens',
          12,
          'Romance',
          4.8,
          215,
          80,
          1,
          0
        ],
        [
          2,
          'Pink Asiatic Lilies & Carnation Meadow',
          'pink-asiatic-lilies-carnation-meadow',
          'Fresh fragrant pink lilies blended with peach carnations and white statice for soothing elegance.',
          1449.00,
          1249.00,
          'https://images.unsplash.com/photo-1529636798458-92182e662485?auto=format&fit=crop&w=800&q=80',
          '6 Asiatic Pink Lilies, 10 Peach Carnations, Fern leaves',
          16,
          'Sympathy',
          4.7,
          42,
          25,
          0,
          0
        ],
        [
          5,
          'Enchanted Garden Mixed Wildflower Bouquet',
          'enchanted-garden-wildflower-bouquet',
          'Artisan florist pick including hydrangeas, lisianthus, spray roses, and scented lavender sprigs.',
          2199.00,
          1899.00,
          'https://images.unsplash.com/photo-1487070183336-b863922373d4?auto=format&fit=crop&w=800&q=80',
          'Blue Hydrangea, Pink Lisianthus, Spray Roses, Lavender',
          22,
          'Wedding',
          4.9,
          89,
          20,
          1,
          1
        ]
      ];

      for (const b of bouquets) {
        await connection.query(`
          INSERT INTO products (
            category_id, name, slug, description, price, discounted_price, image_url,
            flowers_included, stem_count, occasion, rating, review_count, stock, is_bestseller, is_featured
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, b);
      }
      console.log('🌱 Default bouquet products seeded!');
    }

    connection.release();
  } catch (error) {
    console.error('❌ Database initialization error:', error.message);
  }
};

export default pool;

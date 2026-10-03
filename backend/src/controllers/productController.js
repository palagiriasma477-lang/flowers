import pool from '../config/db.js';

// Get all bouquets with search, filter, and sorting
export const getProducts = async (req, res) => {
  try {
    const { category, occasion, minPrice, maxPrice, search, sort, featured, bestseller } = req.query;

    let query = `
      SELECT p.*, c.name as category_name, c.slug as category_slug 
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE 1=1
    `;
    const params = [];

    if (category && category !== 'all') {
      query += ` AND (c.slug = ? OR c.name = ?)`;
      params.push(category, category);
    }

    if (occasion && occasion !== 'all') {
      query += ` AND LOWER(p.occasion) = LOWER(?)`;
      params.push(occasion);
    }

    if (minPrice) {
      query += ` AND p.price >= ?`;
      params.push(Number(minPrice));
    }

    if (maxPrice) {
      query += ` AND p.price <= ?`;
      params.push(Number(maxPrice));
    }

    if (search) {
      query += ` AND (p.name LIKE ? OR p.description LIKE ? OR p.flowers_included LIKE ?)`;
      const searchWild = `%${search}%`;
      params.push(searchWild, searchWild, searchWild);
    }

    if (featured === 'true' || featured === '1') {
      query += ` AND p.is_featured = 1`;
    }

    if (bestseller === 'true' || bestseller === '1') {
      query += ` AND p.is_bestseller = 1`;
    }

    // Sort order
    if (sort === 'price_asc') {
      query += ` ORDER BY COALESCE(p.discounted_price, p.price) ASC`;
    } else if (sort === 'price_desc') {
      query += ` ORDER BY COALESCE(p.discounted_price, p.price) DESC`;
    } else if (sort === 'rating') {
      query += ` ORDER BY p.rating DESC, p.review_count DESC`;
    } else {
      query += ` ORDER BY p.is_bestseller DESC, p.id DESC`;
    }

    const [rows] = await pool.query(query, params);
    res.json({ success: true, count: rows.length, data: rows });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ success: false, message: 'Server error fetching bouquets' });
  }
};

// Get single bouquet details
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query(`
      SELECT p.*, c.name as category_name, c.slug as category_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.id = ?
    `, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Bouquet not found' });
    }

    res.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get all categories with product counts
export const getCategories = async (req, res) => {
  try {
    const [categories] = await pool.query(`
      SELECT c.*, COUNT(p.id) as product_count
      FROM categories c
      LEFT JOIN products p ON c.id = p.category_id
      GROUP BY c.id
      ORDER BY c.name ASC
    `);

    res.json({ success: true, data: categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Admin: Add new bouquet
export const createProduct = async (req, res) => {
  try {
    const {
      category_id,
      name,
      description,
      price,
      discounted_price,
      image_url,
      flowers_included,
      stem_count,
      occasion,
      stock,
      is_bestseller,
      is_featured
    } = req.body;

    if (!name || !price || !image_url) {
      return res.status(400).json({ success: false, message: 'Name, price, and image URL are required' });
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const [result] = await pool.query(`
      INSERT INTO products (
        category_id, name, slug, description, price, discounted_price, image_url,
        flowers_included, stem_count, occasion, stock, is_bestseller, is_featured
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      category_id || 1,
      name,
      slug,
      description || '',
      price,
      discounted_price || null,
      image_url,
      flowers_included || '',
      stem_count || 12,
      occasion || 'General',
      stock || 50,
      is_bestseller ? 1 : 0,
      is_featured ? 1 : 0
    ]);

    res.status(201).json({ success: true, message: 'Bouquet created successfully', productId: result.insertId });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ success: false, message: 'Failed to create bouquet' });
  }
};

// Admin: Update bouquet
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      category_id,
      description,
      price,
      discounted_price,
      image_url,
      flowers_included,
      stem_count,
      occasion,
      stock,
      is_bestseller,
      is_featured
    } = req.body;

    await pool.query(`
      UPDATE products SET
        name = COALESCE(?, name),
        category_id = COALESCE(?, category_id),
        description = COALESCE(?, description),
        price = COALESCE(?, price),
        discounted_price = ?,
        image_url = COALESCE(?, image_url),
        flowers_included = COALESCE(?, flowers_included),
        stem_count = COALESCE(?, stem_count),
        occasion = COALESCE(?, occasion),
        stock = COALESCE(?, stock),
        is_bestseller = COALESCE(?, is_bestseller),
        is_featured = COALESCE(?, is_featured)
      WHERE id = ?
    `, [
      name, category_id, description, price, discounted_price,
      image_url, flowers_included, stem_count, occasion, stock,
      is_bestseller, is_featured, id
    ]);

    res.json({ success: true, message: 'Bouquet updated successfully' });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ success: false, message: 'Failed to update bouquet' });
  }
};

// Admin: Delete bouquet
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM products WHERE id = ?', [id]);
    res.json({ success: true, message: 'Bouquet deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ success: false, message: 'Failed to delete bouquet' });
  }
};

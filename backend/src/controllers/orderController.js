import pool from '../config/db.js';

// Place new order
export const createOrder = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const {
      customer_name,
      customer_email,
      customer_phone,
      delivery_address,
      delivery_date,
      delivery_slot,
      greeting_message,
      sender_name,
      total_amount,
      payment_method,
      items
    } = req.body;

    if (!customer_name || !customer_email || !customer_phone || !delivery_address || !delivery_date || !items || items.length === 0) {
      await connection.rollback();
      return res.status(400).json({ success: false, message: 'Please provide all required delivery details and items' });
    }

    const orderNumber = 'PC-' + Date.now().toString().slice(-6) + Math.floor(100 + Math.random() * 900);
    const userId = req.user ? req.user.id : null;

    // Insert order
    const [orderResult] = await connection.query(`
      INSERT INTO orders (
        user_id, order_number, customer_name, customer_email, customer_phone,
        delivery_address, delivery_date, delivery_slot, greeting_message,
        sender_name, total_amount, payment_method, payment_status, order_status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'paid', 'placed')
    `, [
      userId,
      orderNumber,
      customer_name,
      customer_email,
      customer_phone,
      delivery_address,
      delivery_date,
      delivery_slot || 'Morning (9 AM - 1 PM)',
      greeting_message || '',
      sender_name || customer_name,
      total_amount,
      payment_method || 'Online Payment'
    ]);

    const orderId = orderResult.insertId;

    // Insert order items
    for (const item of items) {
      await connection.query(`
        INSERT INTO order_items (order_id, product_id, product_name, price, quantity, custom_notes)
        VALUES (?, ?, ?, ?, ?, ?)
      `, [
        orderId,
        item.id || null,
        item.name,
        item.price,
        item.quantity || 1,
        item.custom_notes || ''
      ]);

      // Reduce stock if product_id is provided
      if (item.id) {
        await connection.query('UPDATE products SET stock = GREATEST(0, stock - ?) WHERE id = ?', [item.quantity || 1, item.id]);
      }
    }

    await connection.commit();

    res.status(201).json({
      success: true,
      message: 'Order placed successfully! Fresh blooms are being prepared.',
      orderNumber,
      orderId
    });
  } catch (error) {
    await connection.rollback();
    console.error('Error placing order:', error);
    res.status(500).json({ success: false, message: 'Failed to place order' });
  } finally {
    connection.release();
  }
};

// Get orders
export const getOrders = async (req, res) => {
  try {
    let query = `
      SELECT o.*, 
        COUNT(oi.id) as total_items
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
    `;
    const params = [];

    // If not admin, only fetch current user's orders
    if (req.user.role !== 'admin') {
      query += ` WHERE o.user_id = ? OR o.customer_email = ?`;
      params.push(req.user.id, req.user.email);
    }

    query += ` GROUP BY o.id ORDER BY o.created_at DESC`;

    const [rows] = await pool.query(query, params);
    res.json({ success: true, count: rows.length, data: rows });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get single order with items
export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const [orders] = await pool.query('SELECT * FROM orders WHERE id = ? OR order_number = ?', [id, id]);

    if (orders.length === 0) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const order = orders[0];
    const [items] = await pool.query('SELECT * FROM order_items WHERE order_id = ?', [order.id]);

    res.json({ success: true, data: { ...order, items } });
  } catch (error) {
    console.error('Error fetching order detail:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Admin: Update order delivery status
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { order_status, payment_status } = req.body;

    await pool.query(`
      UPDATE orders SET
        order_status = COALESCE(?, order_status),
        payment_status = COALESCE(?, payment_status)
      WHERE id = ?
    `, [order_status, payment_status, id]);

    res.json({ success: true, message: 'Order status updated successfully' });
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ success: false, message: 'Failed to update order' });
  }
};

// Admin: Analytics & Stats
export const getAdminStats = async (req, res) => {
  try {
    const [revenueRow] = await pool.query(`SELECT SUM(total_amount) as total_revenue, COUNT(*) as total_orders FROM orders WHERE payment_status = 'paid'`);
    const [productCountRow] = await pool.query(`SELECT COUNT(*) as total_products FROM products`);
    const [recentOrders] = await pool.query(`SELECT * FROM orders ORDER BY created_at DESC LIMIT 5`);

    res.json({
      success: true,
      stats: {
        totalRevenue: revenueRow[0].total_revenue || 0,
        totalOrders: revenueRow[0].total_orders || 0,
        totalProducts: productCountRow[0].total_products || 0,
        recentOrders
      }
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

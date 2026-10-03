import express from 'express';
import {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  getAdminStats
} from '../controllers/orderController.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Customer or guest can place an order
router.post('/', (req, res, next) => {
  // Optional token check for guest checkout vs logged in
  const authHeader = req.headers['authorization'];
  if (authHeader) {
    return authenticateToken(req, res, next);
  }
  next();
}, createOrder);

// User or admin orders
router.get('/', authenticateToken, getOrders);
router.get('/stats', authenticateToken, requireAdmin, getAdminStats);
router.get('/:id', getOrderById);
router.patch('/:id/status', authenticateToken, requireAdmin, updateOrderStatus);

export default router;

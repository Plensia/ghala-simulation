const express = require('express');
const Order = require('../models/Order');
const PaymentService = require('../services/PaymentService');
const authenticateToken = require('../middleware/auth');

const router = express.Router();

// Get all orders for merchant
router.get('/', authenticateToken, async (req, res) => {
  try {
    const orders = await Order.find({ merchantId: req.merchant.id })
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new order
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { customerName, customerPhone, items, total, paymentMethod } = req.body;
    
    const order = new Order({
      merchantId: req.merchant.id,
      customerName,
      customerPhone,
      items,
      total,
      paymentMethod
    });
    
    await order.save();
    
    // Start payment simulation
    PaymentService.simulatePaymentConfirmation(order._id);
    
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Manually trigger payment confirmation
router.post('/:id/confirm-payment', authenticateToken, async (req, res) => {
  try {
    const orderId = req.params.id;
    const order = await Order.findById(orderId);
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    if (order.merchantId.toString() !== req.merchant.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    
    // Trigger payment confirmation
    PaymentService.simulatePaymentConfirmation(orderId);
    
    res.json({ message: 'Payment confirmation triggered' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
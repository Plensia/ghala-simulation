const express = require('express');
const Merchant = require('../models/Merchant');
const authenticateToken = require('../middleware/auth');

const router = express.Router();

// Get merchant profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const merchant = await Merchant.findById(req.merchant.id).select('-password');
    res.json(merchant);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update payment method
router.put('/payment-method', authenticateToken, async (req, res) => {
  try {
    const { type, config } = req.body;
    
    const merchant = await Merchant.findByIdAndUpdate(
      req.merchant.id,
      { paymentMethod: { type, config } },
      { new: true }
    ).select('-password');
    
    res.json(merchant);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
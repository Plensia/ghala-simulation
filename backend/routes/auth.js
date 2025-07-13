const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Merchant = require('../models/Merchant');

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if merchant exists
    const existingMerchant = await Merchant.findOne({ email });
    if (existingMerchant) {
      return res.status(400).json({ error: 'Merchant already exists' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create merchant
    const merchant = new Merchant({
      name,
      email,
      password: hashedPassword
    });
    
    await merchant.save();
    
    // Generate token
    const token = jwt.sign({ id: merchant._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    
    res.status(201).json({
      token,
      merchant: {
        id: merchant._id,
        name: merchant.name,
        email: merchant.email
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find merchant
    const merchant = await Merchant.findOne({ email });
    if (!merchant) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Check password
    const validPassword = await bcrypt.compare(password, merchant.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Generate token
    const token = jwt.sign({ id: merchant._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    
    res.json({
      token,
      merchant: {
        id: merchant._id,
        name: merchant.name,
        email: merchant.email
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
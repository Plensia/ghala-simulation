const jwt = require('jsonwebtoken');
const Merchant = require('../models/Merchant');

const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'Access token required' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const merchant = await Merchant.findById(decoded.id);
    
    if (!merchant) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    
    req.merchant = merchant;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

module.exports = authenticateToken;
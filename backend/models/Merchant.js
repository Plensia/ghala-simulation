const mongoose = require('mongoose');

const merchantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  paymentMethod: {
    type: { type: String, enum: ['mobile', 'card', 'bank'] },
    config: mongoose.Schema.Types.Mixed
  },
  commissionRate: { type: Number, default: 0.05 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Merchant', merchantSchema);
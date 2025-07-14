// backend/seed.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Merchant = require('./models/Merchant');
const Order = require('./models/Order');
require('dotenv').config();

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  // Clear existing data
  await Merchant.deleteMany({});
  await Order.deleteMany({});

  // Create sample merchant
  const password = await bcrypt.hash('password', 10);
  const merchant = new Merchant({
    name: 'Demo Merchant',
    email: 'demo@merchant.com',
    password,
    paymentMethod: {
      type: 'mobile',
      config: { businessNumber: '123456', apiKey: 'sample-key' }
    },
    commissionRate: 0.05
  });
  await merchant.save();

  // Create sample orders
  const orders = [
    {
      merchantId: merchant._id,
      customerName: 'John Doe',
      customerPhone: '255712345678',
      items: [
        { name: 'Wired Headphones', quantity: 1, price: 15000 },
        { name: 'Phone Case', quantity: 2, price: 15000 }
      ],
      total: 45000,
      status: 'paid',
      paymentMethod: 'mobile',
      createdAt: new Date(Date.now() - 86400000),
      updatedAt: new Date(Date.now() - 86400000)
    },
    {
      merchantId: merchant._id,
      customerName: 'Jane Smith',
      customerPhone: '255713456789',
      items: [
        { name: 'Laptop Stand', quantity: 1, price: 20000 }
      ],
      total: 20000,
      status: 'pending',
      paymentMethod: 'mobile',
      createdAt: new Date(Date.now() - 3600000),
      updatedAt: new Date(Date.now() - 3600000)
    },
    {
      merchantId: merchant._id,
      customerName: 'Bob Johnson',
      customerPhone: '255714567890',
      items: [
        { name: 'Coffee Mug', quantity: 3, price: 8000 }
      ],
      total: 24000,
      status: 'failed',
      paymentMethod: 'mobile',
      createdAt: new Date(Date.now() - 7200000),
      updatedAt: new Date(Date.now() - 7200000)
    }
  ];

  await Order.insertMany(orders);

  console.log('✅ Seed data inserted!');
  mongoose.disconnect();
}

seed().catch(err => {
  console.error('❌ Seed error:', err);
  mongoose.disconnect();
});

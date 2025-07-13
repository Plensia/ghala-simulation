const Order = require('../models/Order');

class PaymentService {
  static async simulatePaymentConfirmation(orderId) {
    console.log(`Starting payment simulation for order: ${orderId}`);
    
    setTimeout(async () => {
      try {
        const order = await Order.findById(orderId);
        if (order && order.status === 'pending') {
          // 80% success rate
          const success = Math.random() > 0.2;
          order.status = success ? 'paid' : 'failed';
          order.updatedAt = new Date();
          await order.save();
          console.log(`Order ${orderId} status updated to: ${order.status}`);
        }
      } catch (error) {
        console.error('Payment simulation error:', error);
      }
    }, 5000);
  }
}

module.exports = PaymentService;
const API_BASE_URL = 'http://localhost:5000/api';

export const apiService = {
  // Orders API
  async getOrders(token) {
    const res = await fetch(`${API_BASE_URL}/orders`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    if (!res.ok) throw new Error('Failed to fetch orders');
    return await res.json();
  },

  async createOrder(orderData, token) {
    const res = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(orderData)
    });
    if (!res.ok) throw new Error('Failed to create order');
    return await res.json();
  },

  async updateOrderStatus(orderId, status, token) {
    // Assuming you want to confirm payment
    const res = await fetch(`${API_BASE_URL}/orders/${orderId}/confirm-payment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    if (!res.ok) throw new Error('Failed to update order status');
    return await res.json();
  },

  async simulatePayment(orderId, token) {
    // This will trigger payment confirmation in backend
    return this.updateOrderStatus(orderId, 'paid', token);
  },

  // Merchant Settings API
  async getMerchantSettings(token) {
    const res = await fetch(`${API_BASE_URL}/merchants/profile`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    if (!res.ok) throw new Error('Failed to fetch merchant settings');
    return await res.json();
  },

  async updateMerchantSettings(settings, token) {
    const res = await fetch(`${API_BASE_URL}/merchants/payment-method`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(settings)
    });
    if (!res.ok) throw new Error('Failed to update merchant settings');
    return await res.json();
  }
};
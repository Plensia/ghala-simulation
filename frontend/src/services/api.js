import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
};

export const merchantAPI = {
  getProfile: () => api.get('/merchants/profile'),
  updatePaymentMethod: (paymentMethod) => api.put('/merchants/payment-method', paymentMethod),
};

export const orderAPI = {
  getOrders: () => api.get('/orders'),
  createOrder: (orderData) => api.post('/orders', orderData),
  confirmPayment: (orderId) => api.post(`/orders/${orderId}/confirm-payment`),
};

export default api;
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/merchants/login', credentials),
  register: (userData) => api.post('/merchants/register', userData),
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};

// Merchant API
export const merchantAPI = {
  getProfile: () => api.get('/merchants/profile'),
  updatePaymentMethod: (data) => api.put('/merchants/payment-method', data),
  getPaymentMethod: () => api.get('/merchants/payment-method'),
};

// Orders API
export const ordersAPI = {
  getOrders: () => api.get('/orders'),
  createOrder: (orderData) => api.post('/orders', orderData),
  updateOrder: (orderId, data) => api.put(`/orders/${orderId}`, data),
  deleteOrder: (orderId) => api.delete(`/orders/${orderId}`),
  confirmPayment: (orderId) => api.post(`/orders/${orderId}/confirm-payment`),
  getOrderStats: () => api.get('/orders/stats'),
};

// Utility functions
export const getToken = () => localStorage.getItem('token');
export const getUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const setAuthData = (token, user) => {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
};

export const isAuthenticated = () => {
  return !!getToken();
};

export default api;
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

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

export const authAPI = {
  login: (credentials) => Promise.resolve({ data: { token: 'mock-token', merchant: { businessName: 'Test Merchant', email: 'test@ghala.com' } } }),
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};

export const ordersAPI = {
  getOrders: () => Promise.resolve({
    data: [
      { id: 1, product: 'Magic Mug', total: 10.99, status: 'pending', timestamp: new Date().toISOString() },
      { id: 2, product: 'Dream Pillow', total: 15.49, status: 'paid', timestamp: new Date().toISOString() },
    ],
  }),
  updateOrder: (orderId, data) => {
    console.log(`Updating order ${orderId} with ${JSON.stringify(data)}`);
    return Promise.resolve({ data: { ...data, id: orderId } });
  },
};

export default api;
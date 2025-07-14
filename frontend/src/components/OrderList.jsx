import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { useAuth } from '../context/AuthContext';

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const token = user?.token;

  useEffect(() => {
    if (token) {
      loadOrders();
    }
    // eslint-disable-next-line
  }, [token]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const ordersData = await apiService.getOrders(token);
      setOrders(ordersData);
    } catch (err) {
      setError('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const simulatePayment = async (orderId) => {
    try {
      setOrders(prev => 
        prev.map(order => 
          order.id === orderId 
            ? { ...order, status: 'processing' }
            : order
        )
      );
      await apiService.simulatePayment(orderId, token);
      setTimeout(() => {
        loadOrders();
      }, 1000);
    } catch (err) {
      setError('Failed to simulate payment');
    }
  };

  const createSampleOrder = async () => {
    try {
      // Realistic sample products
      const products = [
        { name: 'Laptop Stand', price: 20000 },
        { name: 'Wired Headphones', price: 15000 },
        { name: 'Coffee Mug', price: 8000 },
        { name: 'Phone Case', price: 15000 }
      ];
      const item = products[Math.floor(Math.random() * products.length)];
      const quantity = Math.floor(Math.random() * 3) + 1;
      const total = item.price * quantity;
      const sampleOrder = {
        customerName: `Customer ${Date.now()}`,
        customerPhone: `255${Math.floor(Math.random() * 1000000000)}`,
        items: [
          {
            name: item.name,
            quantity,
            price: item.price
          }
        ],
        total,
        paymentMethod: 'mobile'
      };
      await apiService.createOrder(sampleOrder, token);
      loadOrders();
    } catch (err) {
      setError('Failed to create sample order');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return '⏳';
      case 'processing':
        return '⚡';
      case 'paid':
        return '✅';
      case 'failed':
        return '❌';
      default:
        return '❓';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-brand-blue">Customer Orders</h2>
        <button
          onClick={createSampleOrder}
          className="bg-brand-green text-brand-black px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
        >
          Create Sample Order
        </button>
      </div>

      {/* Order Statistics - moved above orders list and improved UI */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-3 rounded-lg shadow border border-blue-200 flex flex-col items-center">
          <div className="text-xl mb-1">📦</div>
          <div className="text-xs font-medium text-blue-700">Total Orders</div>
          <div className="text-lg font-bold text-blue-900 mt-0.5">{orders.length}</div>
        </div>
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-3 rounded-lg shadow border border-yellow-200 flex flex-col items-center">
          <div className="text-xl mb-1">⏳</div>
          <div className="text-xs font-medium text-yellow-700">Pending</div>
          <div className="text-lg font-bold text-yellow-900 mt-0.5">{orders.filter(o => o.status === 'pending').length}</div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-3 rounded-lg shadow border border-green-200 flex flex-col items-center">
          <div className="text-xl mb-1">✅</div>
          <div className="text-xs font-medium text-green-700">Paid</div>
          <div className="text-lg font-bold text-green-900 mt-0.5">{orders.filter(o => o.status === 'paid').length}</div>
        </div>
        <div className="bg-gradient-to-br from-red-50 to-red-100 p-3 rounded-lg shadow border border-red-200 flex flex-col items-center">
          <div className="text-xl mb-1">❌</div>
          <div className="text-xs font-medium text-red-700">Failed</div>
          <div className="text-lg font-bold text-red-900 mt-0.5">{orders.filter(o => o.status === 'failed').length}</div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      {orders.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg mb-4">No orders found</div>
          <p className="text-gray-400">Create a sample order to get started</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Items
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{order.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {order.customerName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {order.customerEmail}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {order.items.map((item, index) => (
                          <div key={index} className="mb-1">
                            {item.name} x{item.quantity}
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      TSh {order.total.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        <span className="mr-1">{getStatusIcon(order.status)}</span>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {order.status === 'pending' && (
                        <button
                          onClick={() => simulatePayment(order.id)}
                          className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700 transition-colors"
                        >
                          Simulate Payment
                        </button>
                      )}
                      {order.status === 'processing' && (
                        <span className="text-blue-600 text-xs">Processing...</span>
                      )}
                      {(order.status === 'paid' || order.status === 'failed') && (
                        <span className="text-gray-400 text-xs">Complete</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderList;
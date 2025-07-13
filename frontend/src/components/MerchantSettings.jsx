import React, { useState, useEffect } from 'react';
import { merchantAPI } from '../services/api';

const MerchantSettings = () => {
  const [paymentMethod, setPaymentMethod] = useState({
    type: 'mobile',
    config: {}
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadMerchantProfile();
  }, []);

  const loadMerchantProfile = async () => {
    try {
      const response = await merchantAPI.getProfile();
      if (response.data.paymentMethod) {
        setPaymentMethod(response.data.paymentMethod);
      }
    } catch (error) {
      console.error('Error loading merchant profile:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      await merchantAPI.updatePaymentMethod(paymentMethod);
      setMessage('Payment method updated successfully!');
    } catch (error) {
      setMessage('Error updating payment method');
    } finally {
      setLoading(false);
    }
  };

  const handleConfigChange = (field, value) => {
    setPaymentMethod({
      ...paymentMethod,
      config: {
        ...paymentMethod.config,
        [field]: value
      }
    });
  };

  const renderConfigFields = () => {
    switch (paymentMethod.type) {
      case 'mobile':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Provider
              </label>
              <select
                value={paymentMethod.config.provider || ''}
                onChange={(e) => handleConfigChange('provider', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Provider</option>
                <option value="M-Pesa">M-Pesa</option>
                <option value="Airtel Money">Airtel Money</option>
                <option value="Tigo Pesa">Tigo Pesa</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="text"
                placeholder="+255123456789"
                value={paymentMethod.config.phoneNumber || ''}
                onChange={(e) => handleConfigChange('phoneNumber', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        );
      case 'card':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gateway
              </label>
              <select
                value={paymentMethod.config.gateway || ''}
                onChange={(e) => handleConfigChange('gateway', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Gateway</option>
                <option value="Stripe">Stripe</option>
                <option value="Paystack">Paystack</option>
                <option value="Flutterwave">Flutterwave</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Merchant ID
              </label>
              <input
                type="text"
                placeholder="merchant_123456"
                value={paymentMethod.config.merchantId || ''}
                onChange={(e) => handleConfigChange('merchantId', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                API Key
              </label>
              <input
                type="password"
                placeholder="pk_test_..."
                value={paymentMethod.config.apiKey || ''}
                onChange={(e) => handleConfigChange('apiKey', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        );
      case 'bank':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bank Name
              </label>
              <select
                value={paymentMethod.config.bankName || ''}
                onChange={(e) => handleConfigChange('bankName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Bank</option>
                <option value="CRDB Bank">CRDB Bank</option>
                <option value="NMB Bank">NMB Bank</option>
                <option value="Stanbic Bank">Stanbic Bank</option>
                <option value="NBC Bank">NBC Bank</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Account Number
              </label>
              <input
                type="text"
                placeholder="1234567890"
                value={paymentMethod.config.accountNumber || ''}
                onChange={(e) => handleConfigChange('accountNumber', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Account Name
              </label>
              <input
                type="text"
                placeholder="Your Business Name"
                value={paymentMethod.config.accountName || ''}
                onChange={(e) => handleConfigChange('accountName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment Method Settings</h2>
      
      {message && (
        <div className={`mb-4 p-3 rounded ${
          message.includes('successfully') 
            ? 'bg-green-100 text-green-700' 
            : 'bg-red-100 text-red-700'
        }`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Payment Method Type
          </label>
          <select
            value={paymentMethod.type}
            onChange={(e) => setPaymentMethod({
              type: e.target.value,
              config: {}
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="mobile">Mobile Money</option>
            <option value="card">Card Payment</option>
            <option value="bank">Bank Transfer</option>
          </select>
        </div>
        
        {renderConfigFields()}
        
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {loading ? 'Updating...' : 'Update Payment Method'}
        </button>
      </form>
    </div>
  );
};

export default MerchantSettings;
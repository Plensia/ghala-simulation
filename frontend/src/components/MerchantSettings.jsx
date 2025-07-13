// components/MerchantSettings.jsx
import React, { useState } from 'react';
import { updatePaymentMethod } from '../services/api';

const MerchantSettings = () => {
  const [paymentMethod, setPaymentMethod] = useState({
    type: 'mobile',
    config: {}
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updatePaymentMethod(paymentMethod);
      alert('Payment method updated successfully!');
    } catch (error) {
      alert('Error updating payment method');
    }
  };

  const renderConfigFields = () => {
    switch (paymentMethod.type) {
      case 'mobile':
        return (
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Provider (e.g., M-Pesa)"
              className="w-full p-2 border rounded"
              value={paymentMethod.config.provider || ''}
              onChange={(e) => setPaymentMethod({
                ...paymentMethod,
                config: { ...paymentMethod.config, provider: e.target.value }
              })}
            />
            <input
              type="text"
              placeholder="Phone Number"
              className="w-full p-2 border rounded"
              value={paymentMethod.config.phoneNumber || ''}
              onChange={(e) => setPaymentMethod({
                ...paymentMethod,
                config: { ...paymentMethod.config, phoneNumber: e.target.value }
              })}
            />
          </div>
        );
      case 'card':
        return (
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Gateway (e.g., Stripe)"
              className="w-full p-2 border rounded"
              value={paymentMethod.config.gateway || ''}
              onChange={(e) => setPaymentMethod({
                ...paymentMethod,
                config: { ...paymentMethod.config, gateway: e.target.value }
              })}
            />
            <input
              type="text"
              placeholder="Merchant ID"
              className="w-full p-2 border rounded"
              value={paymentMethod.config.merchantId || ''}
              onChange={(e) => setPaymentMethod({
                ...paymentMethod,
                config: { ...paymentMethod.config, merchantId: e.target.value }
              })}
            />
          </div>
        );
      case 'bank':
        return (
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Bank Name"
              className="w-full p-2 border rounded"
              value={paymentMethod.config.bankName || ''}
              onChange={(e) => setPaymentMethod({
                ...paymentMethod,
                config: { ...paymentMethod.config, bankName: e.target.value }
              })}
            />
            <input
              type="text"
              placeholder="Account Number"
              className="w-full p-2 border rounded"
              value={paymentMethod.config.accountNumber || ''}
              onChange={(e) => setPaymentMethod({
                ...paymentMethod,
                config: { ...paymentMethod.config, accountNumber: e.target.value }
              })}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Payment Method Settings</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Payment Method</label>
          <select
            value={paymentMethod.type}
            onChange={(e) => setPaymentMethod({
              type: e.target.value,
              config: {}
            })}
            className="w-full p-2 border rounded"
          >
            <option value="mobile">Mobile Money</option>
            <option value="card">Card Payment</option>
            <option value="bank">Bank Transfer</option>
          </select>
        </div>
        
        {renderConfigFields()}
        
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Update Payment Method
        </button>
      </form>
    </div>
  );
};

export default MerchantSettings;
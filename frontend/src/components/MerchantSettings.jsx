import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const MerchantSettings = () => {
  const { user } = useAuth();
  const [paymentMethod, setPaymentMethod] = useState({ type: 'mobile', label: '', provider: '', config: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Saving payment method:', paymentMethod);
    alert('Payment method saved! (Mock)');
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-display text-indigo-800">Craft Your Settings</h1>
      <div className="card">
        <h2 className="text-xl font-medium text-gray-700 mb-4">Payment Configuration</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Payment Type</label>
            <select
              value={paymentMethod.type}
              onChange={(e) => setPaymentMethod({ ...paymentMethod, type: e.target.value })}
              className="input-field"
            >
              <option value="mobile">Mobile</option>
              <option value="card">Card</option>
              <option value="bank">Bank</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Label</label>
            <input
              type="text"
              value={paymentMethod.label}
              onChange={(e) => setPaymentMethod({ ...paymentMethod, label: e.target.value })}
              className="input-field"
              placeholder="e.g., Personal Account"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Provider</label>
            <input
              type="text"
              value={paymentMethod.provider}
              onChange={(e) => setPaymentMethod({ ...paymentMethod, provider: e.target.value })}
              className="input-field"
              placeholder="e.g., M-Pesa"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Config Details</label>
            <textarea
              value={paymentMethod.config}
              onChange={(e) => setPaymentMethod({ ...paymentMethod, config: e.target.value })}
              className="input-field h-24"
              placeholder="e.g., Phone number or account details"
              required
            />
          </div>
          <button type="submit" className="btn-primary">Save Settings</button>
        </form>
      </div>
    </div>
  );
};

export default MerchantSettings;
import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';

const MerchantSettings = () => {
  const [paymentMethod, setPaymentMethod] = useState('mobile');
  const [formData, setFormData] = useState({
    label: '',
    provider: '',
    config: {}
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [currentSettings, setCurrentSettings] = useState(null);

  useEffect(() => {
    loadCurrentSettings();
  }, []);

  const loadCurrentSettings = async () => {
    try {
      const settings = await apiService.getMerchantSettings();
      if (settings) {
        setCurrentSettings(settings);
        setPaymentMethod(settings.paymentMethod);
        setFormData({
          label: settings.label || '',
          provider: settings.provider || '',
          config: settings.config || {}
        });
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  };

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
    setFormData({
      label: '',
      provider: '',
      config: {}
    });
  };

  const handleConfigChange = (key, value) => {
    setFormData(prev => ({
      ...prev,
      config: {
        ...prev.config,
        [key]: value
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const settingsData = {
        paymentMethod,
        label: formData.label,
        provider: formData.provider,
        config: formData.config
      };

      await apiService.updateMerchantSettings(settingsData);
      setMessage('Settings updated successfully!');
      setCurrentSettings(settingsData);
    } catch (error) {
      setMessage('Failed to update settings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderPaymentMethodFields = () => {
    switch (paymentMethod) {
      case 'mobile':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Provider
    <div className="max-w-2xl mx-auto">
      <div className="bg-logo-cream rounded-lg shadow-sm border border-logo-gold p-6">
        <h2 className="text-2xl font-bold text-logo-deeporange mb-6">Merchant Payment Settings</h2>

        {/* Current Settings Display */}
        {currentSettings && (
          <div className="mb-6 p-4 bg-logo-teal rounded-lg border border-logo-gold">
            <h3 className="font-semibold text-logo-cream mb-2">Current Settings</h3>
            <div className="text-sm text-logo-cream">
              <p><strong>Payment Method:</strong> {currentSettings.paymentMethod}</p>
              <p><strong>Provider:</strong> {currentSettings.provider}</p>
              <p><strong>Label:</strong> {currentSettings.label}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Payment Method Selection */}
          <div>
            <label className="block text-sm font-medium text-logo-gold mb-3">
              Payment Method
            </label>
            <div className="grid grid-cols-3 gap-3">
              {['mobile', 'card', 'bank'].map((method) => (
                <button
                  key={method}
                  type="button"
                  onClick={() => handlePaymentMethodChange(method)}
                  className={`p-3 rounded-md border-2 transition-colors font-bold ${
                    paymentMethod === method
                      ? 'border-logo-orange bg-logo-gold text-logo-deeporange'
                      : 'border-logo-gold bg-logo-cream text-logo-gold hover:border-logo-orange'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-lg mb-1">
                      {method === 'mobile' && '\ud83d\udcf1'}
                      {method === 'card' && '\ud83d\udcb3'}
                      {method === 'bank' && '\ud83c\udfe6'}
                    </div>
                    <div className="text-sm font-medium capitalize">{method}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Label Field */}
          <div>
            <label className="block text-sm font-medium text-logo-gold mb-2">
              Payment Method Label
            </label>
            <input
              type="text"
              value={formData.label}
              onChange={(e) => setFormData(prev => ({...prev, label: e.target.value}))}
              className="w-full px-3 py-2 border border-logo-gold rounded-md focus:outline-none focus:ring-2 focus:ring-logo-orange"
              placeholder="Enter a label for this payment method"
              required
            />
          </div>

          {/* Payment Method Specific Fields */}
          {renderPaymentMethodFields()}

          {/* Message Display */}
          {message && (
            <div className={`p-4 rounded-md font-bold ${
              message.includes('success') 
                ? 'bg-logo-gold border border-logo-orange text-logo-cream'
                : 'bg-logo-deeporange border border-logo-orange text-logo-cream'
            }`}>
              {message}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-logo-orange text-logo-cream py-3 px-4 rounded-md hover:bg-logo-gold focus:outline-none focus:ring-2 focus:ring-logo-orange focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-bold"
          >
            {loading ? 'Saving...' : 'Save Settings'}
          </button>
        </form>
      </div>
    </div>
          </div>
        );

      case 'bank':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Bank Name</label>
              <input
                type="text"
                value={formData.config.bankName || ''}
                onChange={(e) => handleConfigChange('bankName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter bank name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Account Number</label>
              <input
                type="text"
                value={formData.config.accountNumber || ''}
                onChange={(e) => handleConfigChange('accountNumber', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter account number"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Routing Number</label>
              <input
                type="text"
                value={formData.config.routingNumber || ''}
                onChange={(e) => handleConfigChange('routingNumber', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter routing number"
                required
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Merchant Payment Settings</h2>
        {/* Current Settings Display */}
        {currentSettings && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-700 mb-2">Current Settings</h3>
            <div className="text-sm text-gray-600">
              <p><strong>Payment Method:</strong> {currentSettings.paymentMethod}</p>
              <p><strong>Provider:</strong> {currentSettings.provider}</p>
              <p><strong>Label:</strong> {currentSettings.label}</p>
            </div>
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Payment Method Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Payment Method
            </label>
            <div className="grid grid-cols-3 gap-3">
              {['mobile', 'card', 'bank'].map((method) => (
                <button
                  key={method}
                  type="button"
                  onClick={() => handlePaymentMethodChange(method)}
                  className={`p-3 rounded-md border-2 transition-colors ${
                    paymentMethod === method
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-lg mb-1">
                      {method === 'mobile' && '📱'}
                      {method === 'card' && '💳'}
                      {method === 'bank' && '🏦'}
                    </div>
                    <div className="text-sm font-medium capitalize">{method}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
          {/* Label Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Payment Method Label
            </label>
            <input
              type="text"
              value={formData.label}
              onChange={(e) => setFormData(prev => ({...prev, label: e.target.value}))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter a label for this payment method"
              required
            />
          </div>
          {/* Payment Method Specific Fields */}
          {renderPaymentMethodFields()}
          {/* Message Display */}
          {message && (
            <div className={`p-4 rounded-md ${
              message.includes('success') 
                ? 'bg-green-50 border border-green-200 text-green-700'
                : 'bg-red-50 border border-red-200 text-red-700'
            }`}>
              {message}
            </div>
          )}
          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Saving...' : 'Save Settings'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default MerchantSettings;
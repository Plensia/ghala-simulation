import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  Smartphone, 
  Building, 
  Save, 
  AlertCircle, 
  CheckCircle,
  Settings
} from 'lucide-react';
import { merchantAPI } from '../services/api';

const MerchantSettings = () => {
  const [paymentMethod, setPaymentMethod] = useState({
    type: 'mobile',
    config: {}
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadPaymentMethod();
  }, []);

  const loadPaymentMethod = async () => {
    try {
      setLoading(true);
      const response = await merchantAPI.getPaymentMethod();
      if (response.data.paymentMethod) {
        setPaymentMethod(response.data.paymentMethod);
      }
    } catch (error) {
      console.error('Error loading payment method:', error);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    switch (paymentMethod.type) {
      case 'mobile':
        if (!paymentMethod.config.provider) {
          newErrors.provider = 'Provider is required';
        }
        if (!paymentMethod.config.phoneNumber) {
          newErrors.phoneNumber = 'Phone number is required';
        } else if (!/^\+?[\d\s-()]+$/.test(paymentMethod.config.phoneNumber)) {
          newErrors.phoneNumber = 'Invalid phone number format';
        }
        break;
      case 'card':
        if (!paymentMethod.config.gateway) {
          newErrors.gateway = 'Gateway is required';
        }
        if (!paymentMethod.config.merchantId) {
          newErrors.merchantId = 'Merchant ID is required';
        }
        if (!paymentMethod.config.apiKey) {
          newErrors.apiKey = 'API Key is required';
        }
        break;
      case 'bank':
        if (!paymentMethod.config.bankName) {
          newErrors.bankName = 'Bank name is required';
        }
        if (!paymentMethod.config.accountNumber) {
          newErrors.accountNumber = 'Account number is required';
        }
        if (!paymentMethod.config.routingNumber) {
          newErrors.routingNumber = 'Routing number is required';
        }
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setMessage({ type: 'error', text: 'Please fix the errors below' });
      return;
    }

    try {
      setSaving(true);
      setMessage({ type: '', text: '' });
      
      await merchantAPI.updatePaymentMethod(paymentMethod);
      
      setMessage({ type: 'success', text: 'Payment method updated successfully!' });
      
      // Clear message after 3 seconds
      setTimeout(() => {
        setMessage({ type: '', text: '' });
      }, 3000);
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.error || 'Failed to update payment method' 
      });
    } finally {
      setSaving(false);
    }
  };

  const handleConfigChange = (field, value) => {
    setPaymentMethod({
      ...paymentMethod,
      config: { ...paymentMethod.config, [field]: value }
    });
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const paymentTypes = [
    { id: 'mobile', label: 'Mobile Money', icon: Smartphone, description: 'M-Pesa, Airtel Money, etc.' },
    { id: 'card', label: 'Card Payment', icon: CreditCard, description: 'Credit/Debit cards via gateway' },
    { id: 'bank', label: 'Bank Transfer', icon: Building, description: 'Direct bank transfers' },
  ];

  const renderConfigFields = () => {
    switch (paymentMethod.type) {
      case 'mobile':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Provider *
              </label>
              <select
                value={paymentMethod.config.provider || ''}
                onChange={(e) => handleConfigChange('provider', e.target.value)}
                className={`select-field ${errors.provider ? 'border-red-500' : ''}`}
              >
                <option value="">Select provider</option>
                <option value="M-Pesa">M-Pesa</option>
                <option value="Airtel Money">Airtel Money</option>
                <option value="Tigo Pesa">Tigo Pesa</option>
                <option value="Halopesa">Halopesa</option>
              </select>
              {errors.provider && (
                <p className="text-red-500 text-sm mt-1">{errors.provider}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number *
              </label>
              <input
                type="text"
                value={paymentMethod.config.phoneNumber || ''}
                onChange={(e) => handleConfigChange('phoneNumber', e.target.value)}
                className={`input-field ${errors.phoneNumber ? 'border-red-500' : ''}`}
                placeholder="+255 123 456 789"
              />
              {errors.phoneNumber && (
                <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                PIN (Optional)
              </label>
              <input
                type="password"
                value={paymentMethod.config.pin || ''}
                onChange={(e) => handleConfigChange('pin', e.target.value)}
                className="input-field"
                placeholder="Enter PIN for automatic payments"
              />
            </div>
          </div>
        );
        
      case 'card':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Gateway *
              </label>
              <select
                value={paymentMethod.config.gateway || ''}
                onChange={(e) => handleConfigChange('gateway', e.target.value)}
                className={`select-field ${errors.gateway ? 'border-red-500' : ''}`}
              >
                <option value="">Select gateway</option>
                <option value="Stripe">Stripe</option>
                <option value="PayPal">PayPal</option>
                <option value="Flutterwave">Flutterwave</option>
                <option value="Paystack">Paystack</option>
              </select>
              {errors.gateway && (
                <p className="text-red-500 text-sm mt-1">{errors.gateway}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Merchant ID *
              </label>
              <input
                type="text"
                value={paymentMethod.config.merchantId || ''}
                onChange={(e) => handleConfigChange('merchantId', e.target.value)}
                className={`input-field ${errors.merchantId ? 'border-red-500' : ''}`}
                placeholder="Enter merchant ID"
              />
              {errors.merchantId && (
                <p className="text-red-500 text-sm mt-1">{errors.merchantId}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                API Key *
              </label>
              <input
                type="password"
                value={paymentMethod.config.apiKey || ''}
                onChange={(e) => handleConfigChange('apiKey', e.target.value)}
                className={`input-field ${errors.apiKey ? 'border-red-500' : ''}`}
                placeholder="Enter API key"
              />
              {errors.apiKey && (
                <p className="text-red-500 text-sm mt-1">{errors.apiKey}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Webhook URL (Optional)
              </label>
              <input
                type="url"
                value={paymentMethod.config.webhookUrl || ''}
                onChange={(e) => handleConfigChange('webhookUrl', e.target.value)}
                className="input-field"
                placeholder="https://your-domain.com/webhooks"
              />
            </div>
          </div>
        );
        
      case 'bank':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bank Name *
              </label>
              <select
                value={paymentMethod.config.bankName || ''}
                onChange={(e) => handleConfigChange('bankName', e.target.value)}
                className={`select-field ${errors.bankName ? 'border-red-500' : ''}`}
              >
                <option value="">Select bank</option>
                <option value="CRDB Bank">CRDB Bank</option>
                <option value="NMB Bank">NMB Bank</option>
                <option value="NBC Bank">NBC Bank</option>
                <option value="Stanbic Bank">Stanbic Bank</option>
                <option value="Azania Bank">Azania Bank</option>
              </select>
              {errors.bankName && (
                <p className="text-red-500 text-sm mt-1">{errors.bankName}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Account Number *
              </label>
              <input
                type="text"
                value={paymentMethod.config.accountNumber || ''}
                onChange={(e) => handleConfigChange('accountNumber', e.target.value)}
                className={`input-field ${errors.accountNumber ? 'border-red-500' : ''}`}
                placeholder="Enter account number"
              />
              {errors.accountNumber && (
                <p className="text-red-500 text-sm mt-1">{errors.accountNumber}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Routing Number *
              </label>
              <input
                type="text"
                value={paymentMethod.config.routingNumber || ''}
                onChange={(e) => handleConfigChange('routingNumber', e.target.value)}
                className={`input-field ${errors.routingNumber ? 'border-red-500' : ''}`}
                placeholder="Enter routing number"
              />
              {errors.routingNumber && (
                <p className="text-red-500 text-sm mt-1">{errors.routingNumber}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Account Holder Name
              </label>
              <input
                type="text"
                value={paymentMethod.config.accountHolderName || ''}
                onChange={(e) => handleConfigChange('accountHolderName', e.target.value)}
                className="input-field"
                placeholder="Enter account holder name"
              />
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="card">
        <div className="p-6 border-b">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Settings className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Payment Settings</h2>
              <p className="text-gray-600">Configure your payment method for receiving payments</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          {/* Payment Method Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Payment Method Type
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {paymentTypes.map((type) => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => setPaymentMethod({ type: type.id, config: {} })}
                  className={`p-4 border-2 rounded-lg text-left transition-all ${
                    paymentMethod.type === type.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-3 mb-2">
                    <type.icon className={`w-5 h-5 ${
                      paymentMethod.type === type.id ? 'text-blue-600' : 'text-gray-400'
                    }`} />
                    <span className={`font-medium ${
                      paymentMethod.type === type.id ? 'text-blue-600' : 'text-gray-900'
                    }`}>
                      {type.label}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">{type.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Configuration Fields */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {paymentTypes.find(t => t.id === paymentMethod.type)?.label} Configuration
            </h3>
            {renderConfigFields()}
          </div>

          {/* Message */}
          {message.text && (
            <div className={`flex items-center space-x-2 p-4 rounded-lg ${
              message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
            }`}>
              {message.type === 'success' ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <AlertCircle className="w-5 h-5" />
              )}
              <span>{message.text}</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={saving}
            className="btn-primary w-full flex items-center justify-center space-x-2"
          >
            {saving ? (
              <div className="spinner"></div>
            ) : (
              <>
                <Save className="w-5 h-5" />
                <span>Save Payment Method</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default MerchantSettings;
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import MerchantSettings from '../components/MerchantSettings';
import OrderList from '../components/OrderList';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('orders');

  const tabs = [
    { id: 'orders', label: 'Orders', icon: '📋' },
    { id: 'settings', label: 'Merchant Settings', icon: '⚙️' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-brand-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <img src="/shop-local-logo.png" alt="Shop Local Logo" className="h-10 w-auto mr-3" style={{filter: 'drop-shadow(0 2px 4px #0055FF)'}} />
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-brand-darkgray">Welcome, {user?.name}</span>
              <button
                onClick={logout}
                className="bg-brand-blue text-brand-white px-4 py-2 rounded-md hover:bg-brand-darkgray transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'orders' && <OrderList />}
        {activeTab === 'settings' && <MerchantSettings />}
      </main>
    </div>
  );
};

export default Dashboard;
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
      <header className="bg-logo-cream shadow-sm border-b border-logo-gold">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <img src="/logo.svg" alt="Shop Local Logo" className="h-12 w-auto mr-3" style={{filter: 'drop-shadow(0 2px 4px #4ad9c3)'}} />
          </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-logo-deeporange font-semibold">Welcome, {user?.name}</span>
              <button
                onClick={logout}
                className="bg-logo-cream text-logo-gold border-2 border-logo-orange px-4 py-2 rounded-md hover:border-logo-orange transition-colors font-bold"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-logo-cream border-b border-logo-gold">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-bold text-sm transition-colors bg-logo-cream text-logo-gold ${
                  activeTab === tab.id
                    ? 'border-logo-orange'
                    : 'border-logo-gold hover:border-logo-orange'
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-logo-cream">
        {activeTab === 'orders' && <OrderList />}
        {activeTab === 'settings' && <MerchantSettings />}
      </main>
    </div>
  );
};

export default Dashboard;
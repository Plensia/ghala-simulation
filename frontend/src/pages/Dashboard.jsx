import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import MerchantSettings from '../components/MerchantSettings';
import OrderList from '../components/OrderList';
import { ClipboardDocumentListIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('orders');

  const tabs = [
    { id: 'orders', label: 'Orders', icon: <ClipboardDocumentListIcon className="h-6 w-6" /> },
    { id: 'settings', label: 'Merchant Settings', icon: <Cog6ToothIcon className="h-6 w-6" /> }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="relative group flex flex-col items-center bg-logo-cream border-r border-logo-gold py-6 transition-all duration-300 w-16 hover:w-48 z-10">
        <div className="mb-8 flex flex-col items-center w-full">
          <img src="/logo.svg" alt="Shop Local Logo" className="h-12 w-auto mb-2" style={{filter: 'drop-shadow(0 2px 4px #4ad9c3)'}} />
        </div>
        <nav className="flex-1 w-full">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center w-full px-4 py-3 my-1 rounded-md font-bold text-sm transition-all duration-200 bg-logo-cream text-logo-gold border-l-4 ${
                activeTab === tab.id
                  ? 'border-logo-orange text-logo-deeporange bg-orange-50'
                  : 'border-transparent hover:border-logo-orange hover:bg-logo-cream'
              } group-hover:justify-start justify-center`}
            >
              <span className="flex items-center justify-center mr-2">{tab.icon}</span>
              <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center">{tab.label}</span>
            </button>
          ))}
        </nav>
        <div className="mt-auto w-full px-4">
          <span className="block text-xs text-logo-deeporange font-semibold mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">Welcome, {user?.name}</span>
          <button
            onClick={logout}
            className="w-full bg-logo-cream text-logo-gold border-2 border-logo-orange px-4 py-2 rounded-md hover:border-logo-orange transition-colors font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-logo-cream">
        {activeTab === 'orders' && <OrderList />}
        {activeTab === 'settings' && <MerchantSettings />}
      </main>
    </div>
  );
};

export default Dashboard;
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import MerchantSettings from '../components/MerchantSettings';
import OrderList from '../components/OrderList';
import Sidebar from '../components/Sidebar.jsx';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('orders');

  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} collapsed={collapsed} setCollapsed={setCollapsed} />
      <main className={`flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-logo-cream transition-all duration-300 ${collapsed ? 'ml-16' : 'ml-48'}`}>
        {activeTab === 'orders' && <OrderList />}
        {activeTab === 'settings' && <MerchantSettings />}
      </main>
    </div>
  );
};

export default Dashboard;
import React, { useState } from 'react';
import { LucideStar, LucideShoppingCart, LucideSettings, LucideMenu, LucideX, LucideCheckCircle } from 'lucide-react';
import Dashboard from './pages/Dashboard.jsx'; // Placeholder for OrderList
import MerchantSettings from './components/MerchantSettings.jsx';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ordersAPI } from './services/api';

const AppContent = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('orders');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    { id: 'orders', name: 'Order Tales', icon: LucideShoppingCart },
    { id: 'settings', name: 'Craft Settings', icon: LucideSettings },
  ];

  const renderContent = () => {
    if (!user) return <Login />;
    switch (activeTab) {
      case 'orders': return <Dashboard />;
      case 'settings': return <MerchantSettings />;
      default: return <Dashboard />;
    }
  };

  const simulatePayment = async () => {
    const orders = await ordersAPI.getOrders();
    const pendingOrder = orders.find(o => o.status === 'pending');
    if (pendingOrder) {
      setTimeout(() => {
        ordersAPI.updateOrder(pendingOrder.id, { status: 'paid' });
        alert(`Payment confirmed for order #${pendingOrder.id}!`);
      }, 5000);
    } else {
      alert('No pending orders to simulate payment for.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 text-gray-900 font-display">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white/90 backdrop-blur-md shadow-xl transform transition-all duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-indigo-200">
          <h1 className="text-xl font-bold text-indigo-800">Ghala Tales</h1>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden text-indigo-600 hover:text-indigo-800">
            <LucideX className="w-6 h-6" />
          </button>
        </div>
        <nav className="mt-6">
          {navigation.map((item) => (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
              className={`w-full flex items-center px-6 py-3 text-left hover:bg-indigo-50 ${activeTab === item.id ? 'bg-purple-100 text-indigo-700' : 'text-gray-700'}`}
            >
              <item.icon className="w-5 h-5 mr-3 text-indigo-500" />
              {item.name}
            </button>
          ))}
        </nav>
        {user && (
          <div className="absolute bottom-4 w-full px-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-indigo-200 rounded-full flex items-center justify-center">
                <LucideStar className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <p className="text-sm font-medium">{user.businessName || 'Storyteller'}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
            </div>
            <button onClick={logout} className="w-full bg-red-100 text-red-700 px-4 py-2 rounded-md hover:bg-red-200 transition-colors">
              Sign Out
            </button>
          </div>
        )}
      </div>
      <div className={`flex-1 transition-all duration-300 ${user ? 'md:pl-64' : ''}`}>
        <div className="bg-white/95 backdrop-blur-sm shadow-md border-b border-indigo-100">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6">
            <button onClick={() => setSidebarOpen(true)} className="md:hidden text-indigo-600 hover:text-indigo-800">
              <LucideMenu className="w-6 h-6" />
            </button>
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-indigo-800">
                {user?.businessName || 'Welcome to Ghala Tales'}
              </span>
            </div>
          </div>
        </div>
        <main className="p-6 sm:p-8 lg:p-10 animate-fadeIn">
          {renderContent()}
          {user && (
            <button onClick={simulatePayment} className="btn-primary mt-6 flex items-center">
              <LucideCheckCircle className="w-4 h-4 mr-2" />
              Simulate Payment
            </button>
          )}
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
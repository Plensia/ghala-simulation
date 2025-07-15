import React from 'react';
import { ClipboardDocumentListIcon, Cog6ToothIcon, PowerIcon, HomeIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ activeTab, setActiveTab, collapsed, setCollapsed }) => {
  const { user, logout } = useAuth();

  const tabs = [
    { id: 'orders', label: 'Orders', icon: <ClipboardDocumentListIcon className="h-6 w-6" /> },
    { id: 'settings', label: 'Merchant Settings', icon: <Cog6ToothIcon className="h-6 w-6" /> }
  ];

  return (
 
    <aside className={`fixed left-0 top-0 bg-white border-r shadow-md z-50 transition-all duration-300 ${collapsed ? 'w-16' : 'w-48'} flex flex-col`}>
      {/* Header */}
      <div className="p-4 border-b border-logo-gold flex items-center justify-between">
        { !collapsed && (
          <div className="flex items-center gap-3">
            <img src="/shop-local-logo.png" alt="Logo" className="h-10 w-auto" />
            <div>
              <h2 className="font-semibold text-logo-gold text-sm">Dashboard</h2>
              <p className="text-xs text-logo-deeporange">Shop Local</p>
            </div>
          </div>
        )}
        <button
          className="p-1 rounded-lg hover:bg-logo-orange hover:text-white transition-all duration-200"
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <Bars3Icon className="w-4 h-4" /> : <XMarkIcon className="w-4 h-4" />}
        </button>
      </div>
      {/* Merchant Info */}
      { !collapsed && user && (
        <div className="p-4 border-b border-logo-gold">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-logo-cream rounded-full flex items-center justify-center">
              <HomeIcon className="w-5 h-5 text-logo-gold" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-logo-gold truncate text-sm">{user.name || 'Merchant'}</p>
              <p className="text-xs text-gray-500 truncate">{user.email || 'email@domain.com'}</p>
            </div>
          </div>
        </div>
      )}
      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 group w-full
              ${activeTab === tab.id
                ? 'bg-logo-orange text-logo-cream shadow'
                : 'hover:bg-logo-cream text-logo-gold hover:text-logo-orange'}
            `}
          >
            {tab.icon}
            {!collapsed && (
              <div>
                <p className="font-medium text-sm">{tab.label}</p>
                {/* You can add a description here if needed */}
              </div>
            )}
          </button>
        ))}
      </nav>
      {/* Footer */}
      <div className="p-4 border-t border-logo-gold">
        <button
          onClick={logout}
          className={`flex items-center gap-3 w-full justify-start hover:bg-red-50 hover:text-red-500 transition-all duration-200 ${collapsed ? 'justify-center' : ''}`}
        >
          <PowerIcon className="w-4 h-4" />
          {!collapsed && <span className="text-sm">Sign out</span>}
        </button>
        {!collapsed && (
          <div className="mt-3 p-2 bg-logo-cream rounded-lg">
            <div className="flex items-center gap-2 text-xs text-logo-gold">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span>All systems online</span>
            </div>
          </div>
        )}
      </div>
    </aside>
    
  );
};

export default Sidebar;

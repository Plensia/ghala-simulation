import React from 'react';
import { AuthProvider } from './context/AuthContext';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './pages/Dashboard';
import { useAuth } from './context/AuthContext';
import './App.css';

function AppContent() {
  const { user, loading } = useAuth();
  const [showRegister, setShowRegister] = React.useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (showRegister) {
    return <Register onRegistered={() => setShowRegister(false)} />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {user ? <Dashboard /> : <>
        <Login />
        <div className="text-center mt-4">
          <button className="text-blue-600 underline" onClick={() => setShowRegister(true)}>
            New merchant? Register here
          </button>
        </div>
      </>}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
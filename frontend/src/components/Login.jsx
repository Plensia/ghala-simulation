import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
const Login = ({ setShowRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);
    
    if (!result.success) {
      setError(result.error || 'Login failed');
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-md w-full bg-brand-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <img src="/logo 2.svg" alt="Shop Local Logo" className="mx-auto mb-2" style={{height: '120px', width: 'auto'}} />
            <p className="text-logo-deeporange  font-semibold text-lg">Sign in to manage your commerce platform</p>
          </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter your email"
            required
          />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your password"
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
              {error}
            </div>
          )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-logo-orange text-logo-cream py-3 px-4 rounded-md hover:bg-logo-gold focus:outline-none focus:ring-2 focus:ring-logo-orange focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-bold"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
        </form>

        <div className="mt-6 text-center">
          <button type="button" className="text-logo-orange font-semibold hover:underline" onClick={() => setShowRegister(true)}>
            Don't have an account? Register here
          </button>
        </div>
      </div>
    </div>
   );
};
};
export default Login;
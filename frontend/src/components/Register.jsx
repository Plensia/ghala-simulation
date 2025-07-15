import React, { useState } from 'react';

const Register = ({ onRegistered }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Registration failed');
      } else {
        setSuccess('Registration successful! You can now log in.');
        setName(''); setEmail(''); setPassword('');
        if (onRegistered) onRegistered();
      }
    } catch {
      setError('Network error');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-logo-cream">
      <div className="max-w-md w-full bg-logo-cream rounded-lg shadow-lg p-8 border border-logo-gold">
        <div className="text-center mb-8">
          <img src="/logo 2.svg" alt="Shop Local Logo" className="mx-auto mb-2" style={{height: '60px', width: 'auto'}} />
          <h1 className="text-3xl font-bold text-logo-deeporange mb-2">Merchant Registration</h1>
          <p className="text-logo-deeporange font-bold">Sign up to start using the platform</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-logo-gold mb-2">Name</label>
            <input id="name" type="text" value={name} onChange={e => setName(e.target.value)} className="w-full px-3 py-2 border border-logo-gold rounded-md focus:outline-none focus:ring-2 focus:ring-logo-orange" placeholder="Enter your name" required />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-logo-gold mb-2">Email</label>
            <input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-3 py-2 border border-logo-gold rounded-md focus:outline-none focus:ring-2 focus:ring-logo-orange" placeholder="Enter your email" required />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-logo-gold mb-2">Password</label>
            <input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full px-3 py-2 border border-logo-gold rounded-md focus:outline-none focus:ring-2 focus:ring-logo-orange" placeholder="Enter your password" required />
          </div>
          {error && <div className="bg-logo-deeporange border border-logo-orange text-logo-cream px-4 py-3 rounded-md">{error}</div>}
          {success && <div className="bg-logo-gold border border-logo-orange text-logo-cream px-4 py-3 rounded-md">{success}</div>}
          <button type="submit" disabled={loading} className="w-full bg-logo-orange text-logo-cream py-3 px-4 rounded-md hover:bg-logo-gold focus:outline-none focus:ring-2 focus:ring-logo-orange focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-bold">{loading ? 'Registering...' : 'Register'}</button>
        </form>
      </div>
    </div>
  );
};

export default Register;

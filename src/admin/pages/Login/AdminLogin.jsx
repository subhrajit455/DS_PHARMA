import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAdminStore from '../../context/useAdminStore';
import { toast } from 'react-hot-toast';
import { USERS } from '../../../data/userData';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const login = useAdminStore((state) => state.login);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));

      const user = USERS.find(u => u.email === email && u.password === password);

      if (user && user.role === 'admin') {
        const dummyToken = 'admin-jwt-token-' + Date.now();
        login(user, dummyToken);
        toast.success(`Welcome back, ${user.name}!`);
        navigate('/admin/dashboard');
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      toast.error(error.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Admin Login</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input 
              type="email" 
              className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none" 
              placeholder="admin@test.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input 
              type="password" 
              className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none" 
              placeholder="admin" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-slate-800 text-white py-2 rounded hover:bg-slate-700 transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
          <p className="mt-4 text-xs text-center text-gray-500">
            Hint: demo@dspharma.com / demo123 (Admin)
          </p>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, Shield, User } from 'lucide-react';
import { motion } from 'motion/react';

export const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'Admin' | 'Employee'>('Admin');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, role }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('user', JSON.stringify({ ...data.user, role: data.role }));
        if (data.role === 'Admin') {
          navigate('/admin/dashboard');
        } else {
          navigate('/employee/dashboard');
        }
      } else {
        setError(data.message || 'Invalid credentials');
      }
    } catch (err) {
      setError('Connection failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f2f2f2] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-[20px] shadow-xl overflow-hidden"
      >
        <div className="bg-[#e75480] p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
            <LogIn className="text-white" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-white">Welcome Back</h1>
          <p className="text-white/80 text-sm mt-2">Login to manage your workspace</p>
        </div>

        <form onSubmit={handleLogin} className="p-8 space-y-6">
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm border border-red-100">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Role</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setRole('Admin')}
                className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all ${
                  role === 'Admin' 
                    ? 'border-[#e75480] bg-[#e75480]/5 text-[#e75480]' 
                    : 'border-gray-100 text-gray-400 hover:border-gray-200'
                }`}
              >
                <Shield size={18} />
                <span className="font-medium">Admin</span>
              </button>
              <button
                type="button"
                onClick={() => setRole('Employee')}
                className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all ${
                  role === 'Employee' 
                    ? 'border-[#e75480] bg-[#e75480]/5 text-[#e75480]' 
                    : 'border-gray-100 text-gray-400 hover:border-gray-200'
                }`}
              >
                <User size={18} />
                <span className="font-medium">Employee</span>
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">
              {role === 'Admin' ? 'Username' : 'Email Address'}
            </label>
            <input
              type={role === 'Admin' ? 'text' : 'email'}
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-[#e75480] focus:border-transparent outline-none transition-all"
              placeholder={role === 'Admin' ? 'admin' : 'employee@company.com'}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-[#e75480] focus:border-transparent outline-none transition-all"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#e75480] text-white p-4 rounded-xl font-bold shadow-lg hover:bg-[#d6436e] active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

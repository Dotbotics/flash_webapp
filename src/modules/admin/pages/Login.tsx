/**
 * ADMIN/LOGIN.TSX
 * 
 * What it does:
 * The login page for the admin dashboard.
 * 
 * Why it exists:
 * To protect the admin interface from unauthorized access.
 * 
 * How it works:
 * - Uses React state (useState) to track the username and password.
 * - Communicates with the backend to verify credentials.
 * - Stores a "fake" admin token in local storage on successful login.
 * 
 * Connections:
 * - Depends on 'src/lib/auth.ts' for login logic.
 * 
 * Module: Admin / Pages
 */

import { useState, FormEvent } from 'react';
import { motion } from 'motion/react';
import { Zap } from 'lucide-react';

interface AdminLoginProps {
  onLogin: (u: string, p: string) => Promise<boolean>;
}

/**
 * AdminLogin Component
 * 
 * Provides a secure login interface for the admin dashboard.
 * Uses hardcoded credentials for demonstration purposes.
 */
export const AdminLogin = ({ onLogin }: AdminLoginProps) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLoginSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsLoading(true);
    
    const success = await onLogin(username, password);
    
    setIsLoading(false);
    if (!success) {
      setLoginError('Invalid username or password');
    }
  };

  return (
    <div className="pt-20 min-h-screen bg-[#eeeae9] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white rounded-3xl p-12 shadow-xl"
      >
        {/* Admin Branding */}
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 bg-[#fb5b15] rounded-2xl flex items-center justify-center">
            <Zap className="text-white w-10 h-10" />
          </div>
        </div>
        
        <h2 className="text-3xl font-bold text-center mb-8">Admin Login</h2>
        
        {/* Login Form */}
        <form onSubmit={handleLoginSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-[#262626]/60 mb-2">Username</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-6 py-4 rounded-2xl bg-[#eeeae9] border-none focus:ring-2 focus:ring-[#fb5b15] outline-none"
              placeholder="Admin"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-[#262626]/60 mb-2">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-6 py-4 rounded-2xl bg-[#eeeae9] border-none focus:ring-2 focus:ring-[#fb5b15] outline-none"
              placeholder="••••••••"
              required
            />
          </div>
          
          {/* Error Message */}
          {loginError && (
            <p className="text-red-500 text-sm font-bold text-center">{loginError}</p>
          )}
          
          <button 
            type="submit"
            disabled={isLoading}
            className={`w-full py-4 bg-[#fb5b15] text-white font-bold rounded-2xl hover:shadow-lg transition-all ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

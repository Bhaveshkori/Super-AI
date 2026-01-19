
import React, { useState } from 'react';
import { User, UserRole, PlanType, BadgeType } from '../types';
import { OWNER_EMAILS } from '../constants';

interface AuthProps {
  onLogin: (user: User) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Determine role based on hardcoded emails
    let role = UserRole.USER;
    // Fix: Updated BadgeType reference from BLUE_VERIFIED to FREE_VERIFIED
    let badge = BadgeType.FREE_VERIFIED;
    let plan = PlanType.FREE;

    if (OWNER_EMAILS.includes(email.toLowerCase())) {
      role = UserRole.OWNER;
      badge = BadgeType.OWNER;
      plan = PlanType.PRO;
    }

    const mockUser: User = {
      id: Math.random().toString(36).substring(7),
      firstName: isLogin ? 'User' : firstName,
      lastName: isLogin ? '' : lastName,
      email: email,
      role: role,
      plan: plan,
      badge: badge,
      createdAt: new Date().toISOString()
    };

    onLogin(mockUser);
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 blur-[150px] -z-10 rounded-full"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/10 blur-[150px] -z-10 rounded-full"></div>
      
      <div className="w-full max-w-md bg-white/[0.03] border border-white/5 p-10 rounded-[40px] shadow-2xl backdrop-blur-xl">
        <div className="text-center mb-10">
          <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center font-bold text-2xl mx-auto mb-4">S</div>
          <h2 className="text-3xl font-bold tracking-tight">{isLogin ? 'Welcome Back' : 'Join Super AI'}</h2>
          <p className="text-gray-400 mt-2">{isLogin ? 'Enter your credentials to continue' : 'Compare the world\'s best AI models'}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest block mb-1.5 ml-1">First Name</label>
                <input 
                  type="text" 
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-all" 
                  placeholder="John"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest block mb-1.5 ml-1">Last Name</label>
                <input 
                  type="text" 
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-all" 
                  placeholder="Doe"
                  required
                />
              </div>
            </div>
          )}
          <div>
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest block mb-1.5 ml-1">Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-all" 
              placeholder="name@email.com"
              required
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest block mb-1.5 ml-1">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-all" 
              placeholder="••••••••"
              required
            />
          </div>

          {isLogin && (
            <div className="text-right">
              <button type="button" className="text-xs font-semibold text-blue-400 hover:text-blue-300">Forgot password?</button>
            </div>
          )}

          <button 
            type="submit" 
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 rounded-2xl font-bold text-lg mt-4 transition-all active:scale-[0.98]"
          >
            {isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-gray-400">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-white font-bold hover:text-blue-400"
          >
            {isLogin ? 'Sign up' : 'Sign in'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;

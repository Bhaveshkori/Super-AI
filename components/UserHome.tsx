
import React from 'react';
import { Link } from 'react-router-dom';
import { User, UserRole, PlanType, BadgeType } from '../types';

interface UserHomeProps {
  user: User;
  onLogout: () => void;
}

const UserHome: React.FC<UserHomeProps> = ({ user, onLogout }) => {
  const getBadgeIcon = (badge: BadgeType) => {
    switch (badge) {
      case BadgeType.OWNER: return <span title="Owner" className="text-green-400">●</span>;
      case BadgeType.PAID_PRO: return <span title="Pro Member" className="text-yellow-400">●</span>;
      case BadgeType.GRANTED_PRO: return <span title="Verified Pro" className="text-white">●</span>;
      case BadgeType.FREE_VERIFIED: return <span title="Free User" className="text-blue-400">●</span>;
      default: return null;
    }
  };

  const isOwner = user.role === UserRole.OWNER || user.role === UserRole.COOWNER;

  return (
    <div className="min-h-screen bg-gray-950 text-white selection:bg-blue-500/30">
      {/* App Bar */}
      <nav className="border-b border-white/5 px-6 h-16 flex items-center justify-between sticky top-0 bg-gray-950/80 backdrop-blur-md z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center font-bold">S</div>
          <span className="font-bold tracking-tight">Super AI</span>
        </div>
        <div className="flex items-center gap-6">
          {isOwner && (
            <Link to="/admin" className="text-sm font-medium text-blue-400 hover:text-blue-300">
              Admin Panel
            </Link>
          )}
          <button onClick={onLogout} className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
            Logout
          </button>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto py-12 px-6">
        <div className="bg-white/[0.03] border border-white/5 rounded-[40px] p-10 mb-12 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-600/10 blur-[80px] rounded-full"></div>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">Welcome, {user.firstName}!</h1>
              <div className="flex items-center gap-3">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${user.plan === PlanType.PRO ? 'bg-yellow-500 text-black' : 'bg-white/10 text-gray-400'}`}>
                  {user.plan} Plan
                </span>
                <div className="flex items-center gap-1.5 text-sm text-gray-400">
                  {getBadgeIcon(user.badge)}
                  <span>{user.badge} Status</span>
                </div>
              </div>
            </div>
            {user.plan === PlanType.FREE && (
              <Link to="/upgrade" className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 px-8 rounded-2xl text-center shadow-lg transition-all active:scale-[0.98]">
                Upgrade to Pro
              </Link>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <Link to="/compare" className="group p-8 rounded-3xl bg-blue-600/10 border border-blue-500/20 hover:border-blue-500 transition-all flex flex-col gap-4">
              <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">🤖</div>
              <div>
                <h3 className="text-xl font-bold mb-1">Compare AI</h3>
                <p className="text-gray-400 text-sm">Input one prompt, see five different AI results side-by-side.</p>
              </div>
            </Link>
            <div className="group p-8 rounded-3xl bg-white/5 border border-white/5 hover:border-white/20 transition-all flex flex-col gap-4 opacity-70">
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-2xl">🖼️</div>
              <div>
                <h3 className="text-xl font-bold mb-1">Image Generation</h3>
                <p className="text-gray-400 text-sm">Create stunning visuals directly from text descriptions (Pro Feature).</p>
              </div>
            </div>
          </div>
        </div>

        <section>
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-blue-600 rounded-full"></span>
            Recent Updates
          </h2>
          <div className="space-y-4">
            {[
              { date: 'Today', title: 'Gemini 2.5 Flash Lite added', tag: 'NEW' },
              { date: 'Yesterday', title: 'Improved multi-pane response latency', tag: 'UPDATE' },
              { date: '2 days ago', title: 'DeepSeek model integrated for technical tasks', tag: 'NEW' }
            ].map((update, i) => (
              <div key={i} className="flex items-center justify-between p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                <div className="flex gap-4 items-center">
                  <span className="text-xs font-mono text-gray-500">{update.date}</span>
                  <span className="font-medium">{update.title}</span>
                </div>
                <span className="text-[10px] font-bold bg-blue-600/20 text-blue-400 px-2 py-0.5 rounded uppercase">{update.tag}</span>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default UserHome;


import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, UserRole, PlanType, BadgeType } from '../types';

interface AdminDashboardProps {
  user: User;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'payments'>('overview');

  const stats = [
    { label: 'Total Users', value: '1,284', change: '+12%', icon: '👥' },
    { label: 'Total Revenue', value: '₹42,390', change: '+8%', icon: '💰' },
    { label: 'Pro Members', value: '342', change: '+15%', icon: '⭐' },
    { label: 'Active Today', value: '89', change: '-2%', icon: '🔥' }
  ];

  const mockUsers: Partial<User>[] = [
    { id: '1', firstName: 'Rahul', lastName: 'Kumar', email: 'rahul@gmail.com', plan: PlanType.PRO, badge: BadgeType.PAID_PRO },
    // Fix: Updated BadgeType reference from BLUE_VERIFIED to FREE_VERIFIED
    { id: '2', firstName: 'Priya', lastName: 'Sharma', email: 'priya@outlook.com', plan: PlanType.FREE, badge: BadgeType.FREE_VERIFIED },
    { id: '3', firstName: 'Arjun', lastName: 'V', email: 'arjun@proton.me', plan: PlanType.PRO, badge: BadgeType.GRANTED_PRO },
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 border-r border-white/5 bg-black/40 p-6 space-y-8">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center font-bold">S</div>
          <span className="font-bold tracking-tight">Super AI Admin</span>
        </div>
        
        <nav className="space-y-2">
          {[
            { id: 'overview', label: 'Overview', icon: '📊' },
            { id: 'users', label: 'User Management', icon: '👥' },
            { id: 'payments', label: 'Payment Requests', icon: '💳' }
          ].map(item => (
            <button 
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${activeTab === item.id ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
            >
              <span>{item.icon}</span>
              {item.label}
            </button>
          ))}
          <Link to="/home" className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold text-gray-400 hover:bg-white/5 hover:text-white transition-all mt-8">
            <span>🏠</span> Back to App
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold capitalize">{activeTab}</h1>
            <p className="text-gray-500 text-sm">Welcome back, {user.firstName}. You have full access.</p>
          </div>
          <div className="flex gap-4">
             <button className="bg-white/5 hover:bg-white/10 p-3 rounded-2xl transition-all">🔔</button>
             <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold">BK</div>
          </div>
        </header>

        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, i) => (
                <div key={i} className="p-6 rounded-[32px] bg-white/[0.03] border border-white/5">
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-2xl">{stat.icon}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${stat.change.startsWith('+') ? 'bg-green-500/20 text-green-400' : 'bg-rose-500/20 text-rose-400'}`}>
                      {stat.change}
                    </span>
                  </div>
                  <div className="text-2xl font-bold mb-1">{stat.value}</div>
                  <div className="text-gray-500 text-xs font-medium">{stat.label}</div>
                </div>
              ))}
            </div>

            <div className="p-8 rounded-[40px] bg-white/[0.03] border border-white/5">
              <h3 className="text-xl font-bold mb-6">Revenue Analysis</h3>
              <div className="h-64 bg-white/5 rounded-3xl flex items-center justify-center text-gray-600 italic">
                Chart data visualization placeholder...
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="p-8 rounded-[40px] bg-white/[0.03] border border-white/5 overflow-x-auto">
            <div className="flex justify-between items-center mb-8">
               <h3 className="text-xl font-bold">All Users</h3>
               <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-xl text-sm font-bold transition-all">Grant Manual Pro</button>
            </div>
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/5 text-gray-500 text-xs font-bold uppercase tracking-widest">
                  <th className="pb-4 px-2">User</th>
                  <th className="pb-4 px-2">Status</th>
                  <th className="pb-4 px-2">Badge</th>
                  <th className="pb-4 px-2">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {mockUsers.map(u => (
                  <tr key={u.id} className="group hover:bg-white/[0.01]">
                    <td className="py-5 px-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold">{u.firstName?.[0]}</div>
                        <div>
                          <div className="font-bold text-sm">{u.firstName} {u.lastName}</div>
                          <div className="text-xs text-gray-500">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-5 px-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${u.plan === PlanType.PRO ? 'bg-yellow-500/20 text-yellow-500' : 'bg-gray-500/20 text-gray-500'}`}>
                        {u.plan}
                      </span>
                    </td>
                    <td className="py-5 px-2">
                       <span className="text-xs text-gray-400">{u.badge}</span>
                    </td>
                    <td className="py-5 px-2">
                       <button className="text-xs font-bold text-blue-500 hover:text-blue-400">View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'payments' && (
          <div className="p-8 rounded-[40px] bg-white/[0.03] border border-white/5 text-center py-20">
             <div className="text-5xl mb-6">📪</div>
             <h3 className="text-2xl font-bold mb-2">No pending payments</h3>
             <p className="text-gray-500">All recent payment requests have been processed.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;

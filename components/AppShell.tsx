
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User } from '../types';

interface AppShellProps {
  user: User;
  // Fix for line 51 in App.tsx: Adding onLogout to interface
  onLogout: () => void;
  children: React.ReactNode;
}

const AppShell: React.FC<AppShellProps> = ({ user, onLogout, children }) => {
  const location = useLocation();
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const navItems = [
    { path: '/home', label: 'Dashboard', icon: '🏠' },
    { path: '/compare', label: 'Compare AIs', icon: '🤖' },
    { path: '/chat', label: 'Pro Chat', icon: '💬' },
    { path: '/studio', label: 'Creative Studio', icon: '🎨' },
    { path: '/vision', label: 'Vision & Audio', icon: '👁️' },
    { path: '/live', label: 'Live Voice', icon: '🎙️' },
  ];

  return (
    <div className="flex h-screen bg-gray-950 text-white overflow-hidden">
      {/* Sidebar */}
      <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-black/40 border-r border-white/5 transition-all duration-300 flex flex-col z-50`}>
        <div 
          className="h-16 flex items-center px-6 border-b border-white/5 gap-3 cursor-pointer"
          onClick={() => setSidebarOpen(!isSidebarOpen)}
        >
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold">S</div>
          {isSidebarOpen && <span className="font-bold tracking-tight text-lg">Super AI</span>}
        </div>
        
        <nav className="flex-1 py-6 px-3 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-4 px-4 py-3 rounded-2xl transition-all group ${
                location.pathname === item.path 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              {isSidebarOpen && <span className="font-semibold text-sm">{item.label}</span>}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5">
           <div className={`flex items-center gap-3 p-3 rounded-2xl bg-white/5 ${!isSidebarOpen && 'justify-center'}`}>
              <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs font-bold">
                {user.firstName[0]}
              </div>
              {isSidebarOpen && (
                <>
                  <div className="overflow-hidden flex-1">
                    <div className="text-sm font-bold truncate">{user.firstName}</div>
                    <div className="text-[10px] text-gray-500 truncate uppercase">{user.plan} PLAN</div>
                  </div>
                  {/* Logout button for wide view */}
                  <button 
                    onClick={onLogout}
                    className="p-1.5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-rose-400 transition-colors"
                    title="Logout"
                  >
                    🚪
                  </button>
                </>
              )}
           </div>
           {/* Logout button for collapsed view */}
           {!isSidebarOpen && (
              <button 
                onClick={onLogout}
                className="w-full mt-2 p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-rose-400 transition-colors flex justify-center"
                title="Logout"
              >
                🚪
              </button>
           )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto relative">
        {children}
      </main>
    </div>
  );
};

export default AppShell;

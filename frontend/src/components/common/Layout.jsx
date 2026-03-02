import React from 'react';
import { LogOut, LayoutDashboard, Users, UserCircle, ClipboardList, Settings, Bell } from 'lucide-react';
import { useAuth } from '../../features/auth/AuthContext';
import { motion } from 'framer-motion';

const Layout = ({ children, activeTab, onTabChange }) => {
  const { user, logout } = useAuth();

  const tabs = [
    { id: 'visits', label: 'Visits', icon: LayoutDashboard },
    { id: 'clinicians', label: 'Clinicians', icon: Users },
    { id: 'patients', label: 'Patients', icon: UserCircle },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-transparent">
      {/* Floating Header */}
      <div className="fixed top-6 left-1/2 -translate-x-1/2 w-[95%] max-w-6xl z-[100]">
        <header className="glass-panel px-6 py-3 rounded-2xl flex justify-between items-center shadow-2xl shadow-black/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/10">
              <ClipboardList className="text-white" size={20} />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-base font-bold tracking-tight leading-none uppercase">Woundtech Health</h1>
              <span className="text-[10px] text-[var(--text-dim)] font-bold uppercase tracking-widest">Administrative Portal</span>
            </div>
          </div>

          <nav className="flex items-center bg-white/5 p-1 rounded-xl border border-white/5" style={{gap: 14,padding: 6}}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'text-white'
                    : 'text-[var(--text-muted)] hover:text-white'
                }`}
              >
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="active-tab"
                    className="absolute inset-0 bg-indigo-500 rounded-lg shadow-lg shadow-indigo-500/20"
                    transition={{ type: "spring", bounce: 0.1, duration: 0.5 }}
                  />
                )}
                <tab.icon size={16} className="relative z-10" />
                <span className="relative z-10 hidden md:block">{tab.label}</span>
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button className="p-2 text-[var(--text-muted)] hover:text-white transition-colors relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-[var(--surface)]"></span>
            </button>
            <div className="h-6 w-[1px] bg-[var(--border)] hidden sm:block" />
            <div className="flex items-center gap-3">
              <div className="hidden lg:block text-right">
                <p className="text-sm font-bold leading-none mb-0.5">{user?.name}</p>
                <p className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-tighter">Chief Administrator</p>
              </div>
              <button 
                onClick={logout}
                className="w-10 h-10 rounded-full border border-[var(--border)] flex items-center justify-center hover:bg-white/5 transition-all group"
              >
                <LogOut size={18} className="text-[var(--text-muted)] group-hover:text-rose-400" />
              </button>
            </div>
          </div>
        </header>
      </div>

      {/* Spacing for Header */}
      <div className="h-32" />

      {/* Main Content */}
      <main className="flex-1 mx-auto w-full pb-20">
        {children}
      </main>

      <footer className="py-10 text-center">
        <div className="w-20 h-1 bg-gradient-to-r from-transparent via-[var(--border)] to-transparent mx-auto mb-6" />
        {/* <p className="text-[var(--text-dim)] text-xs font-bold uppercase tracking-[0.2em]">
          Powered by Woundtech &copy; 2026
        </p> */}
      </footer>
    </div>
  );
};

export default Layout;

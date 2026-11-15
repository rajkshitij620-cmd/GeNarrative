import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Film,
  UploadCloud,
  Cpu,
  Sliders,
  BarChart3,
  User,
  Settings,
  LogOut,
  Sparkles,
  ChevronRight,
  Menu,
  X,
  Plus
} from 'lucide-react';

export default function ArtistLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { label: 'Overview', path: '/artist/dashboard', icon: LayoutDashboard },
    { label: 'My Performances', path: '/artist/performances', icon: Film },
    { label: 'Upload Performance', path: '/artist/upload', icon: UploadCloud },
    { label: 'Artist Control Studio', path: '/artist/studio/67362a1b9f1d2c3e4a5b6c81', icon: Sliders, badge: 'USP' },
    { label: 'Audience Analytics', path: '/artist/analytics', icon: BarChart3 },
    { label: 'Artist Profile', path: '/artist/profile', icon: User },
    { label: 'Studio Settings', path: '/artist/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen flex bg-[#080C15] text-gray-100">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-surface border-r border-gray-800/80 transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static flex flex-col justify-between ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-5 space-y-6">
          {/* Logo & Close button on mobile */}
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary-600 to-accent-blue flex items-center justify-center shadow-md shadow-primary-600/30">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="font-bold text-base text-white tracking-tight">RASA CUE</span>
                <span className="block text-[10px] text-primary-400 font-mono uppercase tracking-wider">Artist Workspace</span>
              </div>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Create CTA */}
          <Link
            to="/artist/upload"
            onClick={() => setSidebarOpen(false)}
            className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-500 hover:to-indigo-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-md shadow-primary-600/30 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Create Accessible Performance</span>
          </Link>

          {/* Nav Items */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname.startsWith(item.path.split('/67362a1b9f1d2c3e4a5b6c81')[0]);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-primary-600/20 text-primary-300 border border-primary-500/30 font-semibold'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-primary-400' : 'text-gray-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 rounded bg-primary-500/30 text-primary-300 font-bold">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Card & Logout */}
        <div className="p-4 border-t border-gray-800/80 bg-[#0c121e]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=100'}
                alt={user?.name || 'Artist'}
                className="w-8 h-8 rounded-full object-cover border border-primary-500/40"
              />
              <div className="truncate max-w-[110px]">
                <div className="text-xs font-bold text-white truncate">{user?.name || 'Artist'}</div>
                <div className="text-[10px] text-gray-400 font-mono truncate">{user?.role || 'artist'}</div>
              </div>
            </div>
            <button
              onClick={() => { logout(); navigate('/'); }}
              title="Log out"
              className="p-1.5 text-gray-400 hover:text-rose-400 rounded-lg hover:bg-rose-500/10 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top bar on mobile */}
        <header className="lg:hidden glass-panel border-b border-gray-800 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-1.5 text-gray-400 hover:text-white rounded-lg"
          >
            <Menu className="w-6 h-6" />
          </button>
          <span className="font-bold text-sm text-white">Artist Workspace</span>
          <div className="w-6"></div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

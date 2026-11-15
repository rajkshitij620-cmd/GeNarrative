import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Sparkles,
  LogOut,
  Menu,
  X,
  ArrowRight,
  Palette,
  Headphones,
  Bookmark,
  Plus,
  Film,
  Activity,
  Settings,
  Clock,
  LayoutDashboard
} from 'lucide-react';

export default function Navbar() {
  const { user, logout, isArtist, isAudience } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Determine Logo Destination
  const logoHref = !user
    ? '/'
    : isArtist
    ? '/artist/dashboard'
    : '/audience/dashboard';

  return (
    <nav className="sticky top-0 z-50 border-b border-white/[0.08] bg-[#07080C]/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to={logoHref} className="flex items-center gap-3 group shrink-0">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 to-cyan-500 rounded-xl blur-sm opacity-50 group-hover:opacity-100 transition duration-300"></div>
              <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 via-indigo-600 to-cyan-500 flex items-center justify-center border border-white/20 shadow-md">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight text-gradient-silver">
                  RASA CUE
                </span>
                <span className="px-1.5 py-0.5 text-[9px] uppercase font-bold tracking-widest bg-violet-500/15 text-violet-300 rounded border border-violet-500/30">
                  AI
                </span>
              </div>
              <p className="text-[10px] text-gray-400 font-mono tracking-wider -mt-0.5">Multimodal Accessibility</p>
            </div>
          </Link>

          {/* ========================================================
              CENTER NAVIGATION LINKS
              - NOT LOGGED IN: NOTHING SHOWS IN CENTER
              - ARTIST: ONLY ARTIST WORKSPACE PAGES
              - AUDIENCE: ONLY AUDIENCE PORTAL PAGES
             ======================================================== */}
          <div className="hidden md:flex items-center gap-1 text-xs font-medium">
            {/* 1. ARTIST ONLY NAV LINKS */}
            {isArtist && (
              <>
                <Link
                  to="/artist/dashboard"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-violet-300 hover:text-white hover:bg-violet-600/15 transition-all font-semibold"
                >
                  <LayoutDashboard className="w-3.5 h-3.5 text-violet-400" />
                  <span>Dashboard</span>
                </Link>

                <Link
                  to="/artist/upload"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-gray-300 hover:text-white hover:bg-white/[0.04] transition-all font-semibold"
                >
                  <Plus className="w-3.5 h-3.5 text-violet-400" />
                  <span>Upload Performance</span>
                </Link>

                <Link
                  to="/artist/performances"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-gray-300 hover:text-white hover:bg-white/[0.04] transition-all font-semibold"
                >
                  <Film className="w-3.5 h-3.5 text-violet-400" />
                  <span>My Performances</span>
                </Link>

                <Link
                  to="/artist/analytics"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-gray-300 hover:text-white hover:bg-white/[0.04] transition-all font-semibold"
                >
                  <Activity className="w-3.5 h-3.5 text-violet-400" />
                  <span>Analytics</span>
                </Link>

                <Link
                  to="/artist/settings"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-gray-300 hover:text-white hover:bg-white/[0.04] transition-all font-semibold"
                >
                  <Settings className="w-3.5 h-3.5 text-violet-400" />
                  <span>Settings</span>
                </Link>
              </>
            )}

            {/* 2. AUDIENCE ONLY NAV LINKS */}
            {isAudience && (
              <>
                <Link
                  to="/audience/dashboard"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-cyan-300 hover:text-white hover:bg-cyan-600/15 transition-all font-semibold"
                >
                  <LayoutDashboard className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Dashboard</span>
                </Link>

                <Link
                  to="/audience/saved"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-gray-300 hover:text-white hover:bg-white/[0.04] transition-all font-semibold"
                >
                  <Bookmark className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Saved Performances</span>
                </Link>

                <Link
                  to="/audience/history"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-gray-300 hover:text-white hover:bg-white/[0.04] transition-all font-semibold"
                >
                  <Clock className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Viewing History</span>
                </Link>

                <Link
                  to="/audience/settings"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-gray-300 hover:text-white hover:bg-white/[0.04] transition-all font-semibold"
                >
                  <Settings className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Accessibility Preferences</span>
                </Link>
              </>
            )}

            {/* 3. NOT LOGGED IN / FIRST TIME: ZERO LINKS DISPLAYED */}
            {!user && null}
          </div>

          {/* ========================================================
              RIGHT ACTION BUTTONS
             ======================================================== */}
          <div className="hidden md:flex items-center gap-3">
            {/* If Logged In: Show User Identity Pill + Log Out */}
            {user ? (
              <div className="flex items-center gap-2">
                <div
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold ${
                    isAudience
                      ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300'
                      : 'bg-violet-500/10 border-violet-500/30 text-violet-300'
                  }`}
                >
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-4 h-4 rounded-full object-cover border border-white/20 shrink-0" />
                  ) : isAudience ? (
                    <Headphones className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  ) : (
                    <Palette className="w-3.5 h-3.5 text-violet-400 shrink-0" />
                  )}
                  <span className="max-w-[140px] truncate">{user.name}</span>
                </div>

                <button
                  onClick={() => { logout(); navigate('/'); }}
                  title="Sign out"
                  className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-gray-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors border border-transparent hover:border-rose-500/30"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              /* If Not Logged In: Clean Login / Register buttons */
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 text-xs font-semibold text-gray-300 hover:text-white transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="btn-shimmer flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold rounded-lg bg-white text-black hover:bg-gray-100 shadow-md shadow-white/10 transition-all hover:scale-[1.02]"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-300 hover:text-white rounded-lg focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================
          MOBILE MENU DRAWER
         ======================================================== */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-panel-elevated border-b border-white/[0.08] px-4 pt-3 pb-6 space-y-3">
          {/* ARTIST MOBILE LINKS */}
          {isArtist && (
            <div className="space-y-1">
              <div className="px-2 py-1 text-[10px] font-mono uppercase text-violet-400 tracking-wider font-semibold">
                Artist Workspace
              </div>
              <Link
                to="/artist/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 px-3 rounded-lg text-sm text-gray-200 hover:text-white hover:bg-white/[0.04] font-medium"
              >
                Dashboard
              </Link>
              <Link
                to="/artist/upload"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 px-3 rounded-lg text-sm text-gray-200 hover:text-white hover:bg-white/[0.04] font-medium"
              >
                Upload Performance
              </Link>
              <Link
                to="/artist/performances"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 px-3 rounded-lg text-sm text-gray-200 hover:text-white hover:bg-white/[0.04] font-medium"
              >
                My Performances
              </Link>
              <Link
                to="/artist/analytics"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 px-3 rounded-lg text-sm text-gray-200 hover:text-white hover:bg-white/[0.04] font-medium"
              >
                Analytics
              </Link>
              <Link
                to="/artist/settings"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 px-3 rounded-lg text-sm text-gray-200 hover:text-white hover:bg-white/[0.04] font-medium"
              >
                Settings
              </Link>
            </div>
          )}

          {/* AUDIENCE MOBILE LINKS */}
          {isAudience && (
            <div className="space-y-1">
              <div className="px-2 py-1 text-[10px] font-mono uppercase text-cyan-400 tracking-wider font-semibold">
                Audience Portal
              </div>
              <Link
                to="/audience/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 px-3 rounded-lg text-sm text-gray-200 hover:text-white hover:bg-white/[0.04] font-medium"
              >
                Dashboard
              </Link>
              <Link
                to="/audience/saved"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 px-3 rounded-lg text-sm text-gray-200 hover:text-white hover:bg-white/[0.04] font-medium"
              >
                Saved Performances
              </Link>
              <Link
                to="/audience/history"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 px-3 rounded-lg text-sm text-gray-200 hover:text-white hover:bg-white/[0.04] font-medium"
              >
                Viewing History
              </Link>
              <Link
                to="/audience/settings"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 px-3 rounded-lg text-sm text-gray-200 hover:text-white hover:bg-white/[0.04] font-medium"
              >
                Accessibility Preferences
              </Link>
            </div>
          )}

          {/* NOT LOGGED IN MOBILE */}
          {!user && (
            <div className="text-center py-2 text-xs text-gray-400">
              Welcome to RASA CUE. Sign in to access your sovereign artist studio or audience console.
            </div>
          )}

          <div className="pt-4 border-t border-white/[0.08] space-y-2">
            {user ? (
              <button
                onClick={() => { setMobileMenuOpen(false); logout(); navigate('/'); }}
                className="block w-full text-center py-2.5 text-xs text-rose-400 hover:bg-rose-500/10 rounded-xl border border-rose-500/30 transition-colors"
              >
                Sign Out ({user.name})
              </button>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2 text-xs font-semibold border border-white/[0.12] rounded-xl text-gray-200"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2 text-xs font-semibold rounded-xl bg-white text-black"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

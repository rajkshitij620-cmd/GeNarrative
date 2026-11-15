import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Sparkles,
  Lock,
  Mail,
  ArrowRight,
  AlertCircle,
  Palette,
  Headphones
} from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const initialRole = searchParams.get('role') === 'audience' ? 'audience' : 'artist';
  const [selectedRole, setSelectedRole] = useState(initialRole);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const roleParam = searchParams.get('role');
    if (roleParam === 'audience' || roleParam === 'artist') {
      setSelectedRole(roleParam);
    }
  }, [searchParams]);

  const handleRoleChange = (role) => {
    setSelectedRole(role);
    setSearchParams({ role });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await login(email, password);
      if (res.user.role === 'audience') {
        navigate('/audience/dashboard');
      } else {
        navigate('/artist/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 relative">
      {/* Ambient background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[320px] bg-violet-600/10 blur-[150px] rounded-full pointer-events-none"></div>

      <div className="w-full max-w-md space-y-6 relative z-10">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 border border-white/20 flex items-center justify-center mx-auto text-white shadow-lg shadow-violet-600/30">
            {selectedRole === 'artist' ? (
              <Palette className="w-6 h-6 text-white" />
            ) : (
              <Headphones className="w-6 h-6 text-white" />
            )}
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            {selectedRole === 'artist' ? 'Artist Studio Login' : 'Audience Member Login'}
          </h1>
          <p className="text-xs text-gray-400">
            {selectedRole === 'artist'
              ? 'Author, edit, and approve multimodal accessibility cues for stage works.'
              : 'Access saved performances, viewing history, and personal sensory preferences.'}
          </p>
        </div>

        {/* TWO-ROLE SELECTION TABS */}
        <div className="p-1 rounded-2xl glass-panel border border-white/[0.08] grid grid-cols-2 gap-1">
          <button
            type="button"
            onClick={() => handleRoleChange('artist')}
            className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-semibold transition-all ${
              selectedRole === 'artist'
                ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md'
                : 'text-gray-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>Artist Login</span>
          </button>

          <button
            type="button"
            onClick={() => handleRoleChange('audience')}
            className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-semibold transition-all ${
              selectedRole === 'audience'
                ? 'bg-gradient-to-r from-cyan-600 to-indigo-600 text-white shadow-md'
                : 'text-gray-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <Headphones className="w-3.5 h-3.5" />
            <span>Audience Login</span>
          </button>
        </div>

        {/* Login Form */}
        <div className="glass-panel p-8 rounded-3xl border border-white/[0.08] shadow-2xl space-y-4">
          {/* Quick Demo Credentials Helper for Hackathon Judges */}
          <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-between text-xs">
            <span className="text-gray-400 font-medium flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-violet-400" />
              <span>Demo Account:</span>
            </span>
            <button
              type="button"
              onClick={() => {
                if (selectedRole === 'artist') {
                  setEmail('a@gmail.com');
                  setPassword('123456');
                } else {
                  setEmail('b@gmail.com');
                  setPassword('123456');
                }
                setError('');
              }}
              className="px-2.5 py-1 rounded-lg bg-violet-600/30 hover:bg-violet-600/50 text-violet-200 border border-violet-500/30 text-[11px] font-semibold transition-all hover:scale-105"
            >
              Fill Demo Credentials (123456)
            </button>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                {selectedRole === 'artist' ? 'Artist Email Address' : 'Audience Email Address'}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={selectedRole === 'artist' ? 'artist@ensemble.com' : 'viewer@audience.art'}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0D0F17] border border-white/[0.08] text-sm text-white placeholder-gray-500 focus:border-violet-500 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0D0F17] border border-white/[0.08] text-sm text-white placeholder-gray-500 focus:border-violet-500 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-xl font-semibold text-xs tracking-wide shadow-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50 hover:scale-[1.01] text-white ${
                selectedRole === 'artist'
                  ? 'bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 shadow-violet-600/30'
                  : 'bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 shadow-cyan-600/30'
              }`}
            >
              {loading ? (
                <span>Verifying credentials...</span>
              ) : (
                <>
                  <span>
                    {selectedRole === 'artist' ? 'Sign In to Artist Studio' : 'Sign In as Audience'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Dynamic Registration Link based on active role */}
          <div className="mt-6 pt-4 border-t border-white/[0.06] text-center text-xs text-gray-400">
            {selectedRole === 'artist' ? (
              <span>
                New performer or choreographer?{' '}
                <Link to="/register?role=artist" className="text-violet-400 hover:underline font-semibold">
                  Create Artist Account
                </Link>
              </span>
            ) : (
              <span>
                New audience member?{' '}
                <Link to="/register?role=audience" className="text-cyan-400 hover:underline font-semibold">
                  Create Audience Account
                </Link>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

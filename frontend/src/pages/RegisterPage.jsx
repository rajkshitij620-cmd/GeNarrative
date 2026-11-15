import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Sparkles,
  Lock,
  Mail,
  User,
  ArrowRight,
  AlertCircle,
  Bookmark,
  ShieldCheck,
  Palette,
  Headphones,
  Globe2,
  Eye,
  Activity
} from 'lucide-react';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const initialRole = searchParams.get('role') === 'audience' ? 'audience' : 'artist';
  const [selectedRole, setSelectedRole] = useState(initialRole);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Artist specific fields
  const [culturalSpecialty, setCulturalSpecialty] = useState('Classical & Contemporary Indian Arts');
  const [bio, setBio] = useState('');

  // Audience specific fields
  const [preferredLanguage, setPreferredLanguage] = useState('Bengali');
  const [defaultMode, setDefaultMode] = useState('visual');

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
      const payload = {
        name,
        email,
        password,
        role: selectedRole
      };

      if (selectedRole === 'artist') {
        payload.culturalSpecialty = culturalSpecialty;
        payload.bio = bio;
      } else {
        payload.preferredLanguage = preferredLanguage;
        payload.defaultMode = defaultMode;
      }

      const res = await register(payload);
      if (res.user.role === 'audience') {
        navigate('/audience/dashboard');
      } else {
        navigate('/artist/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please check your details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 relative">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[320px] bg-violet-600/10 blur-[140px] rounded-full pointer-events-none"></div>

      <div className="w-full max-w-md space-y-6 relative z-10">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 border border-white/20 flex items-center justify-center mx-auto text-white shadow-lg shadow-violet-600/30">
            {selectedRole === 'artist' ? (
              <Palette className="w-6 h-6 text-white" />
            ) : (
              <Headphones className="w-6 h-6 text-white" />
            )}
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            {selectedRole === 'artist' ? 'Create Artist Account' : 'Create Audience Account'}
          </h1>
          <p className="text-xs text-gray-400">
            {selectedRole === 'artist'
              ? 'Publish synchronized accessibility layers while preserving original work.'
              : 'Save favorite performances, track viewing history, and personalize accessibility.'}
          </p>
        </div>

        {/* ROLE SELECTION TABS */}
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
            <span>Artist Role</span>
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
            <span>Audience Role</span>
          </button>
        </div>

        <div className="glass-panel p-8 rounded-3xl border border-white/[0.08] shadow-2xl space-y-5">
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={selectedRole === 'artist' ? 'e.g. Priyadarshini Mukherjee' : 'e.g. Rahul Roy'}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0D0F17] border border-white/[0.08] text-sm text-white placeholder-gray-500 focus:border-violet-500 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">Email Address</label>
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
                  placeholder="At least 6 characters"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0D0F17] border border-white/[0.08] text-sm text-white placeholder-gray-500 focus:border-violet-500 focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* ARTIST-SPECIFIC FIELDS */}
            {selectedRole === 'artist' && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">Artistic Specialty</label>
                  <div className="relative">
                    <Bookmark className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={culturalSpecialty}
                      onChange={(e) => setCulturalSpecialty(e.target.value)}
                      placeholder="e.g. Kathak, Bengali Folk, Theatre"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0D0F17] border border-white/[0.08] text-sm text-white placeholder-gray-500 focus:border-violet-500 focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">Artistic Bio / Statement (Optional)</label>
                  <textarea
                    rows={2}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Briefly describe your ensemble, choreographic tradition, or mission..."
                    className="w-full px-4 py-2 rounded-xl bg-[#0D0F17] border border-white/[0.08] text-sm text-white placeholder-gray-500 focus:border-violet-500 focus:outline-none transition-colors"
                  />
                </div>
              </>
            )}

            {/* AUDIENCE-SPECIFIC FIELDS */}
            {selectedRole === 'audience' && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                    Preferred Language for Captions & Narration
                  </label>
                  <select
                    value={preferredLanguage}
                    onChange={(e) => setPreferredLanguage(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0D0F17] border border-white/[0.08] text-sm text-white focus:border-cyan-500 focus:outline-none transition-colors"
                  >
                    <option value="Bengali">Bengali (বাংলা)</option>
                    <option value="Hindi">Hindi (हिन्दी)</option>
                    <option value="English">English</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                    Default Sensory Accessibility Mode
                  </label>
                  <select
                    value={defaultMode}
                    onChange={(e) => setDefaultMode(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0D0F17] border border-white/[0.08] text-sm text-white focus:border-cyan-500 focus:outline-none transition-colors"
                  >
                    <option value="visual">Visual Mode (Captions & Movement Cues)</option>
                    <option value="audio">Audio Mode (Descriptive Voice Narration)</option>
                    <option value="haptic">Haptic Mode (Tactile Smartphone Vibrations)</option>
                  </select>
                </div>
              </>
            )}

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
                <span>Creating account...</span>
              ) : (
                <>
                  <span>
                    {selectedRole === 'artist'
                      ? 'Register & Open Artist Studio'
                      : 'Register & Open Audience Dashboard'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="pt-2 border-t border-white/[0.06] text-center text-xs text-gray-400">
            Already have an account?{' '}
            <Link
              to={`/login?role=${selectedRole}`}
              className={selectedRole === 'artist' ? 'text-violet-400 hover:underline font-semibold' : 'text-cyan-400 hover:underline font-semibold'}
            >
              Log in as {selectedRole === 'artist' ? 'Artist' : 'Audience'}
            </Link>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 text-[11px] text-gray-500 font-mono">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Original Master Files Kept 100% Immutable</span>
        </div>
      </div>
    </div>
  );
}

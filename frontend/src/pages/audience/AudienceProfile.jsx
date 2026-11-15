import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { User, Mail, Save, CheckCircle2, ArrowLeft, Headphones, ShieldCheck } from 'lucide-react';

export default function AudienceProfile() {
  const { user, updateUser } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSaved(false);
    try {
      const res = await api.put('/auth/profile', { name, bio });
      if (res.data.success) {
        updateUser(res.data.user);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-8 pb-16">
      <div className="border-b border-white/[0.08] pb-6">
        <Link
          to="/audience/dashboard"
          className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors mb-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Audience Dashboard</span>
        </Link>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2.5">
          <Headphones className="w-6 h-6 text-cyan-400" />
          <span>Audience Member Profile</span>
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          Manage your personal identity and accessibility preferences.
        </p>
      </div>

      {saved && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Profile updated successfully!</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/[0.08] space-y-6">
        <div>
          <label className="block text-xs font-semibold text-gray-300 mb-1.5">Full Name</label>
          <div className="relative">
            <User className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0D0F17] border border-white/[0.08] text-sm text-white focus:border-cyan-500 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-300 mb-1.5">Email Address</label>
          <div className="relative">
            <Mail className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              disabled
              value={user?.email || ''}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0D0F17]/50 border border-white/[0.04] text-sm text-gray-400 cursor-not-allowed"
            />
          </div>
          <span className="text-[11px] text-gray-500 mt-1 block">Your email address is your verified session identity.</span>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-300 mb-1.5">Personal Bio / Notes</label>
          <textarea
            rows={3}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Share any special sensory accommodation notes..."
            className="w-full px-4 py-2.5 rounded-xl bg-[#0D0F17] border border-white/[0.08] text-sm text-white focus:border-cyan-500 focus:outline-none"
          />
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs transition-all shadow-md shadow-cyan-600/20 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Updating...' : 'Save Profile'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}

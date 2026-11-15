import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { User, Bookmark, Mail, Save, CheckCircle2 } from 'lucide-react';

export default function ArtistProfile() {
  const { user } = useAuth();

  const [name, setName] = useState(user?.name || 'Ananya Sengupta');
  const [bio, setBio] = useState(user?.bio || 'Kathak & Folk choreographer exploring rhythmic accessibility and multisensory cultural storytelling.');
  const [culturalSpecialty, setCulturalSpecialty] = useState(user?.culturalSpecialty || 'Bengali Classical & Folk Traditions');
  const [saved, setSaved] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await api.put('/artist/profile', { name, bio, culturalSpecialty });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-12">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-white">Artist Profile & Credentials</h1>
        <p className="text-xs text-gray-400">Manage your choreographic attribution and artistic background.</p>
      </div>

      {saved && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>Profile changes saved.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="glass-panel p-6 rounded-3xl border border-gray-800 space-y-4">
        <div>
          <label className="block text-xs font-semibold text-gray-300 mb-1">Artist / Ensemble Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-surface border border-gray-700 text-sm text-white focus:border-primary-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-300 mb-1">Cultural Specialty</label>
          <input
            type="text"
            value={culturalSpecialty}
            onChange={(e) => setCulturalSpecialty(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-surface border border-gray-700 text-sm text-white focus:border-primary-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-300 mb-1">Artistic Biography</label>
          <textarea
            rows={4}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-surface border border-gray-700 text-sm text-white focus:border-primary-500 focus:outline-none"
          />
        </div>

        <div className="pt-2">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-semibold text-xs flex items-center gap-2 shadow-md shadow-primary-600/30"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Profile</span>
          </button>
        </div>
      </form>
    </div>
  );
}

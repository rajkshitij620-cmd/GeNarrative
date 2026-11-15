import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { Settings, Save, CheckCircle2, ArrowLeft, Eye, Headphones, Activity, Sparkles } from 'lucide-react';
import { INDIAN_OFFICIAL_LANGUAGES } from '../../constants/languages';

export default function AudienceSettings() {
  const { user, updateUser } = useAuth();

  const currentPrefs = user?.accessibilityPreferences || {
    preferredLanguage: 'Bengali',
    defaultMode: 'visual',
    highContrast: false,
    hapticIntensity: 1.0,
    fontSize: 'normal'
  };

  const [preferredLanguage, setPreferredLanguage] = useState(currentPrefs.preferredLanguage || 'Bengali');
  const [defaultMode, setDefaultMode] = useState(currentPrefs.defaultMode || 'visual');
  const [highContrast, setHighContrast] = useState(!!currentPrefs.highContrast);
  const [hapticIntensity, setHapticIntensity] = useState(currentPrefs.hapticIntensity || 1.0);
  const [fontSize, setFontSize] = useState(currentPrefs.fontSize || 'normal');

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSaved(false);
    try {
      const newPrefs = {
        preferredLanguage,
        defaultMode,
        highContrast,
        hapticIntensity: parseFloat(hapticIntensity),
        fontSize
      };
      const res = await api.put('/audience/preferences', newPrefs);
      if (res.data.success) {
        updateUser({ accessibilityPreferences: newPrefs });
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update preferences.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8 pb-16">
      <div className="border-b border-white/[0.08] pb-6">
        <Link
          to="/audience/dashboard"
          className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors mb-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Audience Dashboard</span>
        </Link>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2.5">
          <Settings className="w-6 h-6 text-cyan-400" />
          <span>Accessibility & Sensory Preferences</span>
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          Customize your default experience across all published performance QR codes.
        </p>
      </div>

      {saved && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Preferences updated successfully! Applied to your live experience session.</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/[0.08] space-y-6">
          {/* Preferred Language */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">
              Preferred Language for Captions & Descriptive Audio
            </label>
            <select
              value={preferredLanguage}
              onChange={(e) => setPreferredLanguage(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-[#0D0F17] border border-white/[0.08] text-sm text-white focus:border-cyan-500 focus:outline-none"
            >
              {INDIAN_OFFICIAL_LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.value}>
                  {lang.label}
                </option>
              ))}
            </select>
            <span className="text-[11px] text-gray-500 mt-1 block">
              When scanning a QR code, the player will automatically load subtitles and voiceover in this language.
            </span>
          </div>

          {/* Default Sensory Mode */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">
              Default Sensory Accessibility Mode
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setDefaultMode('visual')}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  defaultMode === 'visual'
                    ? 'border-cyan-500 bg-cyan-950/30 text-white'
                    : 'border-white/[0.08] bg-[#0D0F17] text-gray-400 hover:text-white'
                }`}
              >
                <Eye className="w-4 h-4 text-cyan-400 mb-1.5" />
                <div className="text-xs font-bold text-white">Visual Mode</div>
                <div className="text-[10px] text-gray-400">Captions & gestures</div>
              </button>

              <button
                type="button"
                onClick={() => setDefaultMode('audio')}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  defaultMode === 'audio'
                    ? 'border-emerald-500 bg-emerald-950/30 text-white'
                    : 'border-white/[0.08] bg-[#0D0F17] text-gray-400 hover:text-white'
                }`}
              >
                <Headphones className="w-4 h-4 text-emerald-400 mb-1.5" />
                <div className="text-xs font-bold text-white">Audio Mode</div>
                <div className="text-[10px] text-gray-400">Descriptive narration</div>
              </button>

              <button
                type="button"
                onClick={() => setDefaultMode('haptic')}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  defaultMode === 'haptic'
                    ? 'border-amber-500 bg-amber-950/30 text-white'
                    : 'border-white/[0.08] bg-[#0D0F17] text-gray-400 hover:text-white'
                }`}
              >
                <Activity className="w-4 h-4 text-amber-400 mb-1.5" />
                <div className="text-xs font-bold text-white">Haptic Mode</div>
                <div className="text-[10px] text-gray-400">Tactile vibrations</div>
              </button>
            </div>
          </div>

          {/* Haptic Intensity */}
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-gray-300 mb-1.5">
              <span>Haptic Vibration Multiplier</span>
              <span className="font-mono text-amber-400">{hapticIntensity}x Intensity</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="2.0"
              step="0.25"
              value={hapticIntensity}
              onChange={(e) => setHapticIntensity(e.target.value)}
              className="w-full accent-amber-500 bg-gray-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-gray-500 font-mono mt-1">
              <span>Gentle (0.5x)</span>
              <span>Standard (1.0x)</span>
              <span>Strong (2.0x)</span>
            </div>
          </div>

          {/* High Contrast Toggle */}
          <div className="flex items-center justify-between pt-4 border-t border-white/[0.08]">
            <div>
              <div className="text-xs font-semibold text-white">High-Contrast Subtitle Backdrop</div>
              <div className="text-[11px] text-gray-400">Adds an opaque matte background behind text on bright stage lighting.</div>
            </div>
            <button
              type="button"
              onClick={() => setHighContrast(!highContrast)}
              className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                highContrast ? 'bg-cyan-600' : 'bg-gray-800'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  highContrast ? 'translate-x-6' : 'translate-x-0'
                }`}
              ></div>
            </button>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="btn-shimmer flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-lg shadow-cyan-600/30 transition-all disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving Preferences...' : 'Save Preferences'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}

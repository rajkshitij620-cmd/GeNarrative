import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import {
  Bookmark,
  Clock,
  Eye,
  Headphones,
  Activity,
  Play,
  Sparkles,
  Settings,
  ArrowRight,
  Sliders,
  CheckCircle2,
  Trash2,
  Compass,
  Film
} from 'lucide-react';
import ModeBadge from '../../components/common/ModeBadge';

export default function AudienceDashboard() {
  const { user, updateUser } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get('/audience/dashboard');
        if (res.data.success) {
          setDashboardData(res.data.dashboard);
        }
      } catch (err) {
        console.warn('Error fetching audience dashboard:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const handleToggleSave = async (performanceId) => {
    try {
      setSavingId(performanceId);
      const res = await api.post(`/audience/saved/${performanceId}`);
      if (res.data.success) {
        // Refresh dashboard
        const dashRes = await api.get('/audience/dashboard');
        if (dashRes.data.success) {
          setDashboardData(dashRes.data.dashboard);
        }
      }
    } catch (err) {
      console.warn('Error toggling save:', err);
    } finally {
      setSavingId(null);
    }
  };

  const prefs = user?.accessibilityPreferences || {
    preferredLanguage: 'Bengali',
    defaultMode: 'visual'
  };

  return (
    <div className="space-y-10 pb-16">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 sm:p-8 rounded-3xl glass-panel-elevated border border-cyan-500/30 relative overflow-hidden">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/15 text-cyan-300 text-xs font-semibold border border-cyan-500/30">
            <Headphones className="w-3.5 h-3.5" />
            <span>Audience Member Console • Active Session</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Welcome back, {user?.name || 'Audience Member'}!
          </h1>
          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
            Experience universal stage performances with synchronized Bengali, Hindi, and English captions, descriptive voiceovers, and tactile rhythmic vibrations.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-gray-400 font-mono">
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/40 border border-white/10">
              <span className="text-gray-500">Language:</span>
              <strong className="text-cyan-300">{prefs.preferredLanguage}</strong>
            </span>
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/40 border border-white/10">
              <span className="text-gray-500">Default Mode:</span>
              <strong className="text-violet-300 capitalize">{prefs.defaultMode} Mode</strong>
            </span>
          </div>
        </div>

        <div className="shrink-0 flex flex-col sm:flex-row gap-3">
          <Link
            to="/audience/saved"
            className="btn-shimmer flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-semibold text-xs tracking-wide shadow-lg shadow-cyan-600/30 transition-all hover:scale-[1.02]"
          >
            <Bookmark className="w-4 h-4 fill-white text-white" />
            <span>Saved Performances</span>
          </Link>
          <Link
            to="/audience/settings"
            className="flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl glass-panel border border-white/10 text-gray-300 hover:text-white text-xs font-semibold transition-all hover:bg-white/[0.06]"
          >
            <Settings className="w-4 h-4" />
            <span>Preferences</span>
          </Link>
        </div>
      </div>

      {/* DASHBOARD METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          to="/audience/saved"
          className="glass-panel p-5 rounded-2xl border border-white/[0.08] hover:border-cyan-500/40 transition-all space-y-2 group"
        >
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-xs font-medium">Saved Performances</span>
            <Bookmark className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-bold text-white">
            {dashboardData?.savedCount || 0}
          </div>
          <div className="text-[11px] text-cyan-400 flex items-center gap-1">
            <span>View your bookmarked stage works</span>
            <ArrowRight className="w-3 h-3" />
          </div>
        </Link>

        <Link
          to="/audience/history"
          className="glass-panel p-5 rounded-2xl border border-white/[0.08] hover:border-violet-500/40 transition-all space-y-2 group"
        >
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-xs font-medium">Viewing History</span>
            <Clock className="w-4 h-4 text-violet-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-bold text-white">
            {dashboardData?.historyCount || 0}
          </div>
          <div className="text-[11px] text-violet-400 flex items-center gap-1">
            <span>Past sensory sessions & feedback</span>
            <ArrowRight className="w-3 h-3" />
          </div>
        </Link>

        <div className="glass-panel p-5 rounded-2xl border border-white/[0.08] space-y-2">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-xs font-medium">Available Stage Works</span>
            <Film className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-400">
            {dashboardData?.availablePerformancesCount || 1}
          </div>
          <div className="text-[11px] text-gray-400">
            Approved by sovereign artists
          </div>
        </div>
      </div>

      {/* EXPLORE PUBLISHED PERFORMANCES */}
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Compass className="w-5 h-5 text-cyan-400" />
              <span>Explore Accessible Performances</span>
            </h2>
            <p className="text-xs text-gray-400">
              Browse works with verified synchronized captions, audio descriptions, and haptic tracks.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(dashboardData?.explorePerformances || []).map((perf) => {
            const isSaved = dashboardData?.savedPerformances?.some(p => String(p._id) === String(perf._id));
            return (
              <div
                key={perf._id}
                className="glass-panel rounded-2xl border border-white/[0.08] hover:border-cyan-500/40 transition-all overflow-hidden flex flex-col justify-between group"
              >
                <div>
                  <div className="relative h-44 w-full bg-[#0D0F17] overflow-hidden">
                    <img
                      src={perf.thumbnailUrl}
                      alt={perf.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#07080C] via-transparent to-transparent"></div>

                    <div className="absolute top-3 left-3 flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-black/60 text-white backdrop-blur-md border border-white/10">
                        {perf.category}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-950/80 text-cyan-300 border border-cyan-500/30">
                        {perf.duration}s
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleToggleSave(perf._id)}
                      disabled={savingId === perf._id}
                      className={`absolute top-3 right-3 p-2 rounded-xl backdrop-blur-md transition-all ${
                        isSaved
                          ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/30'
                          : 'bg-black/60 text-white hover:bg-black/80 border border-white/10'
                      }`}
                      title={isSaved ? 'Remove from saved' : 'Save to library'}
                    >
                      <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-black' : ''}`} />
                    </button>
                  </div>

                  <div className="p-5 space-y-2">
                    <h3 className="font-bold text-white text-base leading-snug line-clamp-1 group-hover:text-cyan-300 transition-colors">
                      {perf.title}
                    </h3>
                    <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                      {perf.description}
                    </p>
                    <div className="flex items-center gap-2 text-[11px] text-gray-400 pt-1 font-mono">
                      <span className="text-gray-500">By:</span>
                      <span className="text-gray-300">{perf.artistName}</span>
                      <span className="text-gray-600">•</span>
                      <span className="text-gray-500">Lang:</span>
                      <span className="text-gray-300">{perf.originalLanguage}</span>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <Link
                    to={`/experience/${perf.slug}`}
                    className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-md shadow-cyan-600/20 transition-all"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>Watch with Accessibility</span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SAVED PERFORMANCES SHORTLIST */}
      {dashboardData?.savedPerformances?.length > 0 && (
        <div className="space-y-4 pt-4 border-t border-white/[0.08]">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Bookmark className="w-5 h-5 text-cyan-400" />
              <span>My Saved Library</span>
            </h2>
            <Link
              to="/audience/saved"
              className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
            >
              <span>View All Saved</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dashboardData.savedPerformances.slice(0, 4).map((p) => (
              <div
                key={p._id}
                className="p-4 rounded-2xl glass-panel border border-white/[0.08] flex items-center gap-4 hover:border-white/[0.16] transition-colors"
              >
                <img
                  src={p.thumbnailUrl}
                  alt={p.title}
                  className="w-20 h-16 rounded-xl object-cover shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-white truncate">{p.title}</h4>
                  <p className="text-[11px] text-gray-400 mt-0.5">{p.artistName} • {p.category}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Link
                      to={`/experience/${p.slug}`}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cyan-600/20 text-cyan-300 hover:bg-cyan-600/30 text-[10px] font-semibold transition-colors"
                    >
                      <Play className="w-3 h-3 fill-cyan-300" />
                      <span>Experience</span>
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleToggleSave(p._id)}
                      className="text-[10px] text-gray-400 hover:text-rose-400 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

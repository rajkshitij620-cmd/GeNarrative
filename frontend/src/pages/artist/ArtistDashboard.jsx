import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import {
  Film,
  Plus,
  QrCode,
  Eye,
  Headphones,
  Activity,
  Sliders,
  Sparkles,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  TrendingUp,
  Share2
} from 'lucide-react';
import ModeBadge from '../../components/common/ModeBadge';

export default function ArtistDashboard() {
  const { user } = useAuth();
  const [performances, setPerformances] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [perfRes, anaRes] = await Promise.all([
          api.get('/performances'),
          api.get('/performances/analytics')
        ]);
        if (perfRes.data.success) setPerformances(perfRes.data.performances);
        if (anaRes.data.success)  setAnalytics(anaRes.data.analytics);
      } catch (err) {
        console.warn('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const totalPerformances = performances.length;
  const publishedCount = performances.filter(p => p.isPublished).length;
  const processingCount = performances.filter(p => p.status === 'processing' || p.status === 'queued').length;
  const draftCount = performances.filter(p => p.status === 'uploaded' || p.status === 'needs_review').length;

  const totalQrScans  = analytics?.summary?.totalQrScans  ?? 0;
  const totalVisual   = analytics?.summary?.totalVisual   ?? 0;
  const totalAudio    = analytics?.summary?.totalAudio    ?? 0;
  const totalHaptic   = analytics?.summary?.totalHaptic   ?? 0;
  const avgRating     = analytics?.summary?.avgOverallRating ?? null;
  const totalFeedback = analytics?.summary?.totalFeedbacks ?? 0;

  return (
    <div className="space-y-8 pb-12">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl glass-panel-elevated border border-primary-500/30 relative overflow-hidden">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-primary-500/20 text-primary-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Artist Workspace • Active Session</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Welcome back, {user?.name || 'Artist'}!
          </h1>
          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
            Your performances are empowered by RASA CUE's synchronized accessibility engine. Review AI proposals, customize haptic patterns, and distribute experiences to audience members.
          </p>
        </div>

        <Link
          to="/artist/upload"
          className="shrink-0 flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-500 hover:to-indigo-500 text-white font-semibold text-xs tracking-wide shadow-lg shadow-primary-600/30 transition-all hover:scale-[1.02]"
        >
          <Plus className="w-4 h-4" />
          <span>Create Accessible Performance</span>
        </Link>
      </div>

      {/* DASHBOARD WIDGETS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Performances */}
        <div className="glass-panel p-5 rounded-2xl border border-gray-800 space-y-2">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-xs font-medium">Total Performances</span>
            <Film className="w-4 h-4 text-primary-400" />
          </div>
          <div className="text-2xl font-bold text-white">{totalPerformances}</div>
          <div className="text-[11px] text-gray-400">
            {publishedCount} Published • {draftCount} Drafts
          </div>
        </div>

        {/* Total QR Scans */}
        <div className="glass-panel p-5 rounded-2xl border border-gray-800 space-y-2">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-xs font-medium">Audience QR Scans</span>
            <QrCode className="w-4 h-4 text-accent-blue" />
          </div>
          <div className="text-2xl font-bold text-accent-blue">{totalQrScans}</div>
          <div className="text-[11px] text-gray-400 flex items-center gap-1">
            Total audience QR scans
          </div>
        </div>

        {/* Active AI Processing */}
        <div className="glass-panel p-5 rounded-2xl border border-gray-800 space-y-2">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-xs font-medium">Processing Status</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-white">
            {processingCount > 0 ? (
              <span className="text-amber-400">{processingCount} Active</span>
            ) : (
              <span className="text-emerald-400">Up to Date</span>
            )}
          </div>
          <div className="text-[11px] text-gray-400">Zero pending jobs</div>
        </div>

        {/* Accessibility Engagement */}
        <div className="glass-panel p-5 rounded-2xl border border-gray-800 space-y-2">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-xs font-medium">Audience Rating</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-400">
            {avgRating ? `${avgRating} / 5.0` : 'No ratings yet'}
          </div>
          <div className="text-[11px] text-gray-400">
            {totalFeedback > 0 ? `From ${totalFeedback} verified feedback forms` : 'No feedback yet'}
          </div>
        </div>
      </div>

      {/* ACCESSIBILITY MODE USAGE MINI-BREAKDOWN */}
      <div className="p-6 rounded-2xl glass-panel border border-gray-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <span>Audience Sensory Mode Selection Breakdown</span>
          </h3>
          <span className="text-[11px] font-mono text-gray-400">Real Scanned Telemetry</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-3.5 rounded-xl bg-cyan-950/20 border border-cyan-800/30 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Eye className="w-4 h-4 text-cyan-400" />
              <div>
                <div className="text-xs font-semibold text-white">Visual Mode</div>
                <div className="text-[10px] text-gray-400">Captions & Movement Cues</div>
              </div>
            </div>
            <div className="text-base font-bold text-cyan-400">{totalVisual} uses</div>
          </div>

          <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-800/30 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Headphones className="w-4 h-4 text-emerald-400" />
              <div>
                <div className="text-xs font-semibold text-white">Audio Mode</div>
                <div className="text-[10px] text-gray-400">Descriptive Narration</div>
              </div>
            </div>
            <div className="text-base font-bold text-emerald-400">{totalAudio} uses</div>
          </div>

          <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-800/30 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Activity className="w-4 h-4 text-amber-400" />
              <div>
                <div className="text-xs font-semibold text-white">Haptic Mode</div>
                <div className="text-[10px] text-gray-400">Tactile Vibrations</div>
              </div>
            </div>
            <div className="text-base font-bold text-amber-400">{totalHaptic} uses</div>
          </div>
        </div>
      </div>

      {/* RECENT PERFORMANCES CARDS */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white">My Performances</h2>
            <p className="text-xs text-gray-400">Manage original master recordings and author synchronized timelines.</p>
          </div>
          <Link
            to="/artist/performances"
            className="text-xs text-primary-400 hover:text-primary-300 font-semibold flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {performances.map((perf) => (
            <div
              key={perf._id}
              className="glass-panel rounded-2xl border border-gray-800 hover:border-gray-700 transition-all overflow-hidden flex flex-col justify-between group"
            >
              <div>
                {/* Thumbnail */}
                <div className="relative h-44 w-full bg-surface-elevated overflow-hidden">
                  <img
                    src={perf.thumbnailUrl}
                    alt={perf.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent"></div>

                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-black/60 text-white backdrop-blur-md border border-white/10">
                      {perf.category}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-primary-950/80 text-primary-300 border border-primary-500/30">
                      {perf.duration}s
                    </span>
                  </div>

                  <div className="absolute top-3 right-3">
                    {perf.isPublished ? (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 backdrop-blur-md flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Published
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40 backdrop-blur-md">
                        {perf.status === 'needs_review' ? 'Needs Review' : 'Draft'}
                      </span>
                    )}
                  </div>
                </div>

                {/* Details */}
                <div className="p-5 space-y-3">
                  <h3 className="font-bold text-white text-base leading-snug line-clamp-1">
                    {perf.title}
                  </h3>
                  <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                    {perf.description || 'Multimodal performance with synchronized accessibility timeline.'}
                  </p>

                  <div className="flex items-center gap-2 text-[11px] text-gray-400 pt-1">
                    <span className="font-mono text-gray-500">Lang:</span>
                    <span className="text-gray-300">{perf.originalLanguage}</span>
                    <span className="text-gray-600">•</span>
                    <span className="font-mono text-gray-500">Outputs:</span>
                    <span className="text-gray-300">{perf.supportedLanguages?.join(', ')}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="p-5 pt-0 border-t border-gray-800/80 flex items-center justify-between gap-2 mt-2">
                <Link
                  to={`/artist/studio/${perf._id}`}
                  className="flex-1 py-2 px-3 rounded-xl bg-primary-600/20 hover:bg-primary-600/30 border border-primary-500/40 text-primary-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Open Studio</span>
                </Link>

                {perf.isPublished && (
                  <Link
                    to={`/experience/${perf.slug}`}
                    className="p-2 rounded-xl bg-surface border border-gray-700 hover:bg-gray-700 text-accent-blue"
                    title="View Audience QR Experience"
                  >
                    <QrCode className="w-4 h-4" />
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

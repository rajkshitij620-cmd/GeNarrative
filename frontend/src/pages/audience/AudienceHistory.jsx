import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { Clock, Play, ArrowLeft, Eye, Headphones, Activity } from 'lucide-react';

export default function AudienceHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await api.get('/audience/history');
      if (res.data.success) {
        setHistory(res.data.history);
      }
    } catch (err) {
      console.warn('Error fetching history:', err);
    } finally {
      setLoading(false);
    }
  };

  const getModeIcon = (mode) => {
    if (mode === 'audio') return Headphones;
    if (mode === 'haptic') return Activity;
    return Eye;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-6">
        <div>
          <Link
            to="/audience/dashboard"
            className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Audience Dashboard</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2.5">
            <Clock className="w-6 h-6 text-violet-400" />
            <span>Viewing & Sensory History</span>
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Log of previously experienced accessibility layers and stage works.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="py-16 text-center text-xs text-gray-400 font-mono">
          Loading viewing history...
        </div>
      ) : history.length === 0 ? (
        <div className="py-16 text-center space-y-4 glass-panel rounded-3xl p-8 border border-white/[0.08]">
          <div className="w-12 h-12 rounded-2xl bg-violet-600/10 text-violet-400 flex items-center justify-center mx-auto">
            <Clock className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">No Viewing History Yet</h3>
          <p className="text-xs text-gray-400 max-w-md mx-auto">
            When you watch performances in Visual, Audio, or Haptic mode, your sessions will be logged here.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs font-semibold hover:from-violet-500 hover:to-indigo-500 transition-colors"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>Watch Bengali Dance Showcase</span>
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {history.map((item, idx) => {
            const Icon = getModeIcon(item.modeUsed);
            return (
              <div
                key={idx}
                className="glass-panel p-4 sm:p-5 rounded-2xl border border-white/[0.08] hover:border-white/[0.18] transition-all flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-11 h-11 rounded-xl bg-violet-600/15 border border-violet-500/30 flex items-center justify-center shrink-0 text-violet-300">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-white truncate">{item.title}</h3>
                    <div className="flex flex-wrap items-center gap-2 text-[11px] text-gray-400 mt-1 font-mono">
                      <span>{item.artistName || 'Artist'}</span>
                      <span>•</span>
                      <span className="capitalize text-cyan-300">{item.modeUsed} Mode</span>
                      <span>•</span>
                      <span>{new Date(item.watchedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <Link
                  to={`/experience/${item.slug}`}
                  className="shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/[0.06] hover:bg-cyan-600 hover:text-white text-xs text-gray-200 font-semibold border border-white/10 transition-colors"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span className="hidden sm:inline">Replay</span>
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

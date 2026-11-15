import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { Bookmark, Play, Trash2, ArrowLeft, Film } from 'lucide-react';

export default function AudienceSaved() {
  const [performances, setPerformances] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSaved();
  }, []);

  const fetchSaved = async () => {
    try {
      const res = await api.get('/audience/saved');
      if (res.data.success) {
        setPerformances(res.data.performances);
      }
    } catch (err) {
      console.warn('Error fetching saved:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (id) => {
    try {
      await api.post(`/audience/saved/${id}`);
      setPerformances(prev => prev.filter(p => p._id !== id));
    } catch (err) {
      console.warn('Error removing:', err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8 pb-16">
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
            <Bookmark className="w-6 h-6 text-cyan-400" />
            <span>Saved Performances Library</span>
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Bookmarked stage works saved for quick sensory access and replay.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="py-16 text-center text-xs text-gray-400 font-mono">
          Loading saved library...
        </div>
      ) : performances.length === 0 ? (
        <div className="py-16 text-center space-y-4 glass-panel rounded-3xl p-8 border border-white/[0.08]">
          <div className="w-12 h-12 rounded-2xl bg-cyan-600/10 text-cyan-400 flex items-center justify-center mx-auto">
            <Bookmark className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">No Saved Performances Yet</h3>
          <p className="text-xs text-gray-400 max-w-md mx-auto">
            Browse published performances and click the bookmark icon to save them to your personal accessibility library.
          </p>
          <Link
            to="/audience/dashboard"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-600 text-white text-xs font-semibold hover:bg-cyan-500 transition-colors"
          >
            <span>Explore Performances</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {performances.map((perf) => (
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
                    onClick={() => handleRemove(perf._id)}
                    className="absolute top-3 right-3 p-2 rounded-xl bg-black/60 hover:bg-rose-600/80 text-white backdrop-blur-md transition-colors"
                    title="Remove from saved"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="p-5 space-y-2">
                  <h3 className="font-bold text-white text-base leading-snug line-clamp-1 group-hover:text-cyan-300 transition-colors">
                    {perf.title}
                  </h3>
                  <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                    {perf.description}
                  </p>
                  <div className="text-[11px] text-gray-400 pt-1 font-mono">
                    Artist: <span className="text-gray-300">{perf.artistName}</span>
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0">
                <Link
                  to={`/experience/${perf.slug}`}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-md shadow-cyan-600/20 transition-all"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>Launch Sensory Experience</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

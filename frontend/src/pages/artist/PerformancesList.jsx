import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { Film, Plus, Sliders, QrCode, Trash2, CheckCircle2 } from 'lucide-react';

export default function PerformancesList() {
  const [performances, setPerformances] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPerformances();
  }, []);

  const fetchPerformances = async () => {
    try {
      const res = await api.get('/performances');
      if (res.data.success) {
        setPerformances(res.data.performances);
      }
    } catch (err) {
      console.warn('Error fetching performances list:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this performance and its creative timeline?')) return;
    try {
      await api.delete(`/performances/${id}`);
      fetchPerformances();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">My Performances</h1>
          <p className="text-xs text-gray-400">Manage all registered stage works and their accessibility timelines.</p>
        </div>

        <Link
          to="/artist/upload"
          className="px-4 py-2 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-md shadow-primary-600/30 w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>New Performance</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {performances.map(p => (
          <div key={p._id} className="glass-panel rounded-2xl border border-gray-800 p-5 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="relative h-40 rounded-xl overflow-hidden bg-black">
                <img src={p.thumbnailUrl} alt={p.title} className="w-full h-full object-cover" />
                <div className="absolute top-2 right-2">
                  {p.isPublished ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                      Published
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                      Draft
                    </span>
                  )}
                </div>
              </div>

              <div>
                <h3 className="font-bold text-white text-sm line-clamp-1">{p.title}</h3>
                <p className="text-xs text-gray-400 line-clamp-2 mt-1">{p.description}</p>
              </div>

              <div className="text-[11px] font-mono text-gray-400">
                {p.category} • {p.originalLanguage} • {p.duration}s
              </div>
            </div>

            <div className="pt-3 border-t border-gray-800 flex items-center justify-between gap-2">
              <Link
                to={`/artist/studio/${p._id}`}
                className="flex-1 py-1.5 rounded-lg bg-primary-600/20 hover:bg-primary-600/30 text-primary-300 border border-primary-500/30 text-xs font-semibold flex items-center justify-center gap-1.5"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Open Studio</span>
              </Link>

              {p.isPublished && (
                <Link
                  to={`/experience/${p.slug}`}
                  className="p-1.5 rounded-lg bg-surface border border-gray-700 text-accent-blue"
                  title="View Public Experience"
                >
                  <QrCode className="w-4 h-4" />
                </Link>
              )}

              <button
                onClick={() => handleDelete(p._id)}
                className="p-1.5 rounded-lg text-gray-500 hover:text-rose-400 hover:bg-rose-500/10"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

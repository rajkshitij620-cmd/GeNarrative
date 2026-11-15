import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { BarChart3, TrendingUp, Users, QrCode, Star, MessageSquare, Eye, Headphones, Activity, AlertCircle } from 'lucide-react';

export default function ArtistAnalytics() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.get('/performances/analytics');
        if (res.data.success) {
          setAnalytics(res.data.analytics);
        } else {
          setError('Could not load analytics.');
        }
      } catch (err) {
        setError('Error loading analytics data.');
        console.warn('Analytics fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-xs text-gray-400 font-mono">
        <BarChart3 className="w-5 h-5 text-primary-400 animate-spin mr-2" />
        Loading analytics…
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[40vh] flex flex-col items-center justify-center gap-3 text-center">
        <AlertCircle className="w-8 h-8 text-rose-400" />
        <p className="text-sm text-gray-300">{error}</p>
      </div>
    );
  }

  const { summary, perPerformance, recentFeedback } = analytics;

  const modeData = [
    { name: 'Visual Mode',  count: summary.totalVisual, color: '#06B6D4' },
    { name: 'Audio Mode',   count: summary.totalAudio,  color: '#10B981' },
    { name: 'Haptic Mode',  count: summary.totalHaptic, color: '#F59E0B' },
  ];

  const languageData = [
    { name: 'Bengali (বাংলা)', value: summary.languages?.bengali || 0, color: '#7C3AED' },
    { name: 'Hindi (हिन्दी)',   value: summary.languages?.hindi   || 0, color: '#0EA5E9' },
    { name: 'English',         value: summary.languages?.english  || 0, color: '#10B981' },
  ];

  // Per-performance data for bar chart (top 7 by QR scans)
  const perfChartData = [...perPerformance]
    .sort((a, b) => b.qrScans - a.qrScans)
    .slice(0, 7)
    .map(p => ({ name: p.title.length > 18 ? p.title.slice(0, 18) + '…' : p.title, scans: p.qrScans }));

  const noData = summary.totalQrScans === 0 && summary.totalViews === 0;

  return (
    <div className="space-y-8 pb-16">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-white">Audience Engagement & Accessibility Analytics</h1>
        <p className="text-xs text-gray-400">
          Real-time telemetry aggregated from your published performances.
          {noData && <span className="ml-1 text-amber-400">No audience data yet — publish a performance to start collecting.</span>}
        </p>
      </div>

      {/* METRIC OVERVIEW */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-2xl border border-gray-800 space-y-1">
          <span className="text-xs text-gray-400">Total QR Scans</span>
          <div className="text-2xl font-bold text-white">{summary.totalQrScans}</div>
          <div className="text-[11px] text-gray-400 font-mono">All published performances</div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-gray-800 space-y-1">
          <span className="text-xs text-gray-400">Total Views</span>
          <div className="text-2xl font-bold text-accent-blue">{summary.totalViews}</div>
          <div className="text-[11px] text-gray-400 font-mono">Experience page loads</div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-gray-800 space-y-1">
          <span className="text-xs text-gray-400">Avg Accessibility Rating</span>
          <div className="text-2xl font-bold text-emerald-400">
            {summary.avgOverallRating ? `${summary.avgOverallRating} / 5.0` : '—'}
          </div>
          <div className="text-[11px] text-gray-400 font-mono">
            From {summary.totalFeedbacks} audience reviews
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-gray-800 space-y-1">
          <span className="text-xs text-gray-400">Mode Usage</span>
          <div className="text-2xl font-bold text-purple-400">
            {summary.totalVisual + summary.totalAudio + summary.totalHaptic}
          </div>
          <div className="text-[11px] text-gray-400 font-mono">
            V:{summary.totalVisual} A:{summary.totalAudio} H:{summary.totalHaptic}
          </div>
        </div>
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* QR Scans by Performance */}
        <div className="glass-panel p-6 rounded-3xl border border-gray-800 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <QrCode className="w-4 h-4 text-accent-blue" />
            <span>QR Scans per Performance</span>
          </h3>
          {perfChartData.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-xs text-gray-500">No data yet</div>
          ) : (
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={perfChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                  <XAxis dataKey="name" stroke="#9ca3af" fontSize={10} />
                  <YAxis stroke="#9ca3af" fontSize={11} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '0.75rem', fontSize: '11px' }}
                  />
                  <Bar dataKey="scans" fill="#7C3AED" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Sensory Mode Breakdown */}
        <div className="glass-panel p-6 rounded-3xl border border-gray-800 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-primary-400" />
            <span>Sensory Mode Selection Volume</span>
          </h3>
          {modeData.every(d => d.count === 0) ? (
            <div className="h-64 flex items-center justify-center text-xs text-gray-500">No mode data yet</div>
          ) : (
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={modeData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                  <XAxis type="number" stroke="#9ca3af" fontSize={11} />
                  <YAxis dataKey="name" type="category" stroke="#9ca3af" fontSize={11} width={100} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '0.75rem', fontSize: '11px' }}
                  />
                  <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                    {modeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      {/* Language Usage */}
      <div className="glass-panel p-6 rounded-3xl border border-gray-800 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-violet-400" />
          <span>Language Selection by Audience</span>
        </h3>
        <div className="grid grid-cols-3 gap-4">
          {languageData.map(l => (
            <div key={l.name} className="p-4 rounded-2xl bg-surface border border-gray-800 text-center space-y-1">
              <div className="text-xl font-bold" style={{ color: l.color }}>{l.value}</div>
              <div className="text-xs text-gray-400">{l.name}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Per-Performance Breakdown Table */}
      {perPerformance.length > 0 && (
        <div className="glass-panel p-6 rounded-3xl border border-gray-800 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Eye className="w-4 h-4 text-cyan-400" />
            <span>Per-Performance Breakdown</span>
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-gray-300">
              <thead>
                <tr className="text-gray-500 border-b border-gray-800">
                  <th className="text-left pb-2 font-semibold">Performance</th>
                  <th className="text-right pb-2 font-semibold">QR Scans</th>
                  <th className="text-right pb-2 font-semibold">Views</th>
                  <th className="text-right pb-2 font-semibold">Visual</th>
                  <th className="text-right pb-2 font-semibold">Audio</th>
                  <th className="text-right pb-2 font-semibold">Haptic</th>
                  <th className="text-right pb-2 font-semibold">Rating</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/60">
                {perPerformance.map(p => (
                  <tr key={p.performanceId} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-2.5 font-medium text-white truncate max-w-[180px]">{p.title}</td>
                    <td className="py-2.5 text-right text-accent-blue">{p.qrScans}</td>
                    <td className="py-2.5 text-right">{p.totalViews}</td>
                    <td className="py-2.5 text-right text-cyan-400">{p.visualUses}</td>
                    <td className="py-2.5 text-right text-emerald-400">{p.audioUses}</td>
                    <td className="py-2.5 text-right text-amber-400">{p.hapticUses}</td>
                    <td className="py-2.5 text-right">
                      {p.avgRating ? (
                        <span className="text-amber-300 font-semibold">★ {p.avgRating}</span>
                      ) : (
                        <span className="text-gray-600">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* REAL AUDIENCE FEEDBACK */}
      <div className="glass-panel p-6 rounded-3xl border border-gray-800 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-emerald-400" />
          <span>Recent Audience Feedback</span>
        </h3>

        {recentFeedback.length === 0 ? (
          <div className="text-center py-8 text-xs text-gray-500">
            No audience feedback yet. Feedback is collected after audience members rate accessibility experiences.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentFeedback.map((fb, i) => (
              <div key={i} className="p-4 rounded-2xl bg-surface border border-gray-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-gray-300">
                    {fb.modeUsed ? `${fb.modeUsed.charAt(0).toUpperCase() + fb.modeUsed.slice(1)} Mode` : 'Audience Member'}
                  </span>
                  <span className="text-[11px] text-amber-400 flex items-center gap-0.5 font-bold">
                    ★ {fb.overallRating}
                  </span>
                </div>
                {fb.comment && (
                  <p className="text-xs text-gray-400 italic leading-relaxed">"{fb.comment}"</p>
                )}
                <div className="flex items-center justify-between text-[10px] text-gray-500 font-mono pt-1">
                  <span>{fb.performanceTitle}</span>
                  <span>{new Date(fb.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

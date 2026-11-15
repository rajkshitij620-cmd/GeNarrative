import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api';
import { useAccessibility } from '../../context/AccessibilityContext';
import { useAuth } from '../../context/AuthContext';
import {
  Eye,
  Headphones,
  Activity,
  Sliders,
  Sparkles,
  Globe2,
  ShieldCheck,
  Star,
  MessageSquare,
  CheckCircle2,
  Share2,
  Smartphone,
  Bookmark,
  UserCheck
} from 'lucide-react';
import ModeBadge from '../../components/common/ModeBadge';

export default function AudienceExperience() {
  const { slug } = useParams();
  const { language, setLanguage } = useAccessibility();
  const { user, updateUser } = useAuth();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [guestPrompt, setGuestPrompt] = useState(false);

  // Audience Feedback Form State
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [captionClarity, setCaptionClarity] = useState(5);
  const [audioQuality, setAudioQuality] = useState(5);
  const [hapticUtility, setHapticUtility] = useState(5);
  const [comment, setComment] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  useEffect(() => {
    const fetchAudienceData = async () => {
      try {
        const res = await api.get(`/public/${slug}`);
        if (res.data.success) {
          setData(res.data);
          const perf = res.data.performance;

          // Check if saved by logged in audience member
          if (user?.role === 'audience' && user.savedPerformances) {
            setIsSaved(user.savedPerformances.includes(perf.id || perf._id));
          }

          // Auto-record viewing history if logged in as audience
          if (user?.role === 'audience') {
            api.post('/audience/history', {
              performanceId: perf.id || perf._id,
              title: perf.title,
              slug: perf.slug,
              thumbnailUrl: perf.thumbnailUrl,
              artistName: perf.artistName,
              category: perf.category,
              modeUsed: 'visual'
            }).catch(() => {});
          }
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Could not load performance accessibility experience.');
      } finally {
        setLoading(false);
      }
    };
    fetchAudienceData();
  }, [slug, user]);

  const handleToggleSave = async () => {
    if (!user) {
      setGuestPrompt(true);
      return;
    }
    if (user.role !== 'audience') {
      alert('Only audience accounts can save performances to library.');
      return;
    }

    try {
      setSaveLoading(true);
      const perfId = data.performance.id || data.performance._id;
      const res = await api.post(`/audience/saved/${perfId}`);
      if (res.data.success) {
        setIsSaved(res.data.saved);
        updateUser({ savedPerformances: res.data.savedPerformances });
      }
    } catch (err) {
      console.warn('Error saving:', err);
    } finally {
      setSaveLoading(false);
    }
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/public/${slug}/feedback`, {
        captionClarity,
        audioQuality,
        hapticUtility,
        overallRating: feedbackRating,
        modeUsed: 'combined',
        comment
      });
      setFeedbackSubmitted(true);
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center text-xs text-gray-400 font-mono">
        <Sparkles className="w-5 h-5 text-primary-400 animate-spin mr-2" />
        Synchronizing accessibility timeline...
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-md mx-auto py-16 px-4 text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-white">Experience Unavailable</h2>
        <p className="text-xs text-gray-400 leading-relaxed">{error || 'Performance not published yet.'}</p>
        <Link to="/" className="inline-block px-4 py-2 rounded-xl bg-surface border border-gray-700 text-xs text-white">
          Return to Home
        </Link>
      </div>
    );
  }

  const { performance, timeline } = data;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8 pb-20">
      {/* PERFORMANCE HEADER CARD */}
      <div className="glass-panel-elevated p-6 rounded-3xl border border-primary-500/30 space-y-4">
        <div className="flex items-center justify-between">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-primary-600/30 text-primary-300 border border-primary-500/40">
            RASA CUE • Audience Portal
          </span>
          {/* Language Switcher */}
          <div className="flex items-center gap-1 text-xs">
            <Globe2 className="w-3.5 h-3.5 text-gray-400 mr-1" />
            {[
              { code: 'bengali', label: 'বাংলা' },
              { code: 'hindi', label: 'हिन्दी' },
              { code: 'english', label: 'EN' }
            ].map(l => (
              <button
                key={l.code}
                onClick={() => setLanguage(l.code)}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-all ${
                  language === l.code
                    ? 'bg-primary-600 text-white font-bold'
                    : 'bg-surface text-gray-400 hover:text-white'
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-white leading-tight">
                {performance.title}
              </h1>
              <p className="text-xs text-cyan-300 font-medium mt-1">
                Choreographed & Performed by {performance.artistName}
              </p>
            </div>

            {/* Bookmark Action */}
            <button
              type="button"
              onClick={handleToggleSave}
              disabled={saveLoading}
              className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                isSaved
                  ? 'bg-cyan-500 text-black border-cyan-400 shadow-md shadow-cyan-500/20'
                  : 'bg-white/[0.04] text-gray-300 border-white/10 hover:text-white hover:bg-white/[0.08]'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-black' : ''}`} />
              <span>{isSaved ? 'Saved in Library' : 'Save Performance'}</span>
            </button>
          </div>

          {/* Guest Bookmark Prompt */}
          {guestPrompt && !user && (
            <div className="mt-3 p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/40 flex items-center justify-between gap-2 text-xs">
              <span className="text-gray-300">
                Log in as an Audience member to bookmark stage works to your private library.
              </span>
              <Link
                to="/login?role=audience"
                className="px-3 py-1 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold whitespace-nowrap text-[11px]"
              >
                Sign In as Audience
              </Link>
            </div>
          )}
        </div>

        <p className="text-xs text-gray-300 leading-relaxed">
          {performance.description}
        </p>

        {/* Video Preview */}
        <div className="rounded-2xl overflow-hidden bg-black aspect-video border border-gray-800 shadow-xl">
          <video src={performance.videoUrl} controls className="w-full h-full object-contain" />
        </div>
      </div>

      {/* CHOOSE ACCESSIBILITY MODE SECTION */}
      <div className="space-y-4">
        <div className="space-y-1">
          <h2 className="text-lg font-bold text-white">Choose Your Accessibility Mode</h2>
          <p className="text-xs text-gray-400">
            Select the sensory channel tailored to your preference. All modes use the same artist-approved timeline.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Mode 1: Visual Mode */}
          <Link
            to={`/experience/${slug}/visual`}
            className="glass-panel p-5 rounded-2xl border border-cyan-500/30 hover:border-cyan-500/70 hover:bg-cyan-950/20 transition-all flex flex-col justify-between group space-y-4"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Eye className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base">Visual Mode</h3>
                <span className="text-[10px] text-cyan-400 font-mono">Deaf & Hard of Hearing</span>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">
                Synchronized subtitles, mudra descriptions, and visual sound cues.
              </p>
            </div>
            <div className="pt-2 text-xs font-semibold text-cyan-400 flex items-center justify-between">
              <span>Open Visual Mode</span>
              <span>→</span>
            </div>
          </Link>

          {/* Mode 2: Audio Mode */}
          <Link
            to={`/experience/${slug}/audio`}
            className="glass-panel p-5 rounded-2xl border border-emerald-500/30 hover:border-emerald-500/70 hover:bg-emerald-950/20 transition-all flex flex-col justify-between group space-y-4"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Headphones className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base">Audio Mode</h3>
                <span className="text-[10px] text-emerald-400 font-mono">Blind & Low Vision</span>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">
                Descriptive voice narration of mudras, choreography, and lighting.
              </p>
            </div>
            <div className="pt-2 text-xs font-semibold text-emerald-400 flex items-center justify-between">
              <span>Open Audio Mode</span>
              <span>→</span>
            </div>
          </Link>

          {/* Mode 3: Haptic Mode */}
          <Link
            to={`/experience/${slug}/haptic`}
            className="glass-panel p-5 rounded-2xl border border-amber-500/30 hover:border-amber-500/70 hover:bg-amber-950/20 transition-all flex flex-col justify-between group space-y-4"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base">Haptic Mode</h3>
                <span className="text-[10px] text-amber-400 font-mono">Tactile Vibration</span>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">
                Feel rhythm, foot stamping, and musical beats through smartphone vibration.
              </p>
            </div>
            <div className="pt-2 text-xs font-semibold text-amber-400 flex items-center justify-between">
              <span>Open Haptic Mode</span>
              <span>→</span>
            </div>
          </Link>
        </div>
      </div>

      {/* ARTIST-PROTECTED CULTURAL MEANINGS */}
      {performance.protectedElements?.length > 0 && (
        <div className="glass-panel p-5 rounded-2xl border border-gray-800 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-white">
            <ShieldCheck className="w-4 h-4 text-primary-400" />
            <span>Artist-Approved Cultural Notes & Intentions</span>
          </div>
          <div className="space-y-2">
            {performance.protectedElements.map((pe, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-surface border border-gray-800 text-xs space-y-1">
                <span className="font-semibold text-primary-300">{pe.category}</span>
                <p className="text-gray-300 text-[11px] leading-relaxed">{pe.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AUDIENCE FEEDBACK SECTION (Section 18) */}
      <div className="glass-panel p-6 rounded-3xl border border-gray-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-primary-400" />
            <span>Audience Accessibility Feedback</span>
          </h3>
          <span className="text-[10px] text-gray-500 font-mono">Anonymous & Instant</span>
        </div>

        {feedbackSubmitted ? (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>Thank you! Your feedback helps make performing arts universally inclusive.</span>
          </div>
        ) : (
          <form onSubmit={handleFeedbackSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block text-gray-400 mb-1">Caption Clarity (1-5)</label>
                <select
                  value={captionClarity}
                  onChange={(e) => setCaptionClarity(e.target.value)}
                  className="w-full p-2 rounded-lg bg-surface border border-gray-700 text-white text-xs"
                >
                  <option value={5}>5 - Crystal Clear</option>
                  <option value={4}>4 - Good</option>
                  <option value={3}>3 - Acceptable</option>
                  <option value={2}>2 - Needs refinement</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-400 mb-1">Audio Description (1-5)</label>
                <select
                  value={audioQuality}
                  onChange={(e) => setAudioQuality(e.target.value)}
                  className="w-full p-2 rounded-lg bg-surface border border-gray-700 text-white text-xs"
                >
                  <option value={5}>5 - Excellent Cadence</option>
                  <option value={4}>4 - Good</option>
                  <option value={3}>3 - Acceptable</option>
                  <option value={2}>2 - Needs refinement</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-400 mb-1">Haptic Utility (1-5)</label>
                <select
                  value={hapticUtility}
                  onChange={(e) => setHapticUtility(e.target.value)}
                  className="w-full p-2 rounded-lg bg-surface border border-gray-700 text-white text-xs"
                >
                  <option value={5}>5 - Immersive & Tactile</option>
                  <option value={4}>4 - Good</option>
                  <option value={3}>3 - Acceptable</option>
                  <option value={2}>2 - Not noticeable</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1">Comments or Suggestions for the Artist</label>
              <textarea
                rows={2}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience with the accessibility cues..."
                className="w-full p-2.5 rounded-xl bg-surface border border-gray-700 text-xs text-white placeholder-gray-500 focus:border-primary-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-primary-600 hover:bg-primary-500 text-white text-xs font-semibold shadow-md shadow-primary-600/30"
            >
              Submit Anonymous Rating
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

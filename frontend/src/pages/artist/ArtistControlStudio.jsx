import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api';
import { useAccessibility } from '../../context/AccessibilityContext';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Sliders,
  CheckCircle2,
  XCircle,
  Eye,
  Headphones,
  Activity,
  Sparkles,
  ShieldCheck,
  Plus,
  Trash2,
  Save,
  QrCode,
  Share2,
  Download,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Maximize2
} from 'lucide-react';
import ModeBadge from '../../components/common/ModeBadge';

export default function ArtistControlStudio() {
  const { id } = useParams();
  const { speakText, triggerHaptic } = useAccessibility();

  const videoRef = useRef(null);

  const [performance, setPerformance] = useState(null);
  const [timeline, setTimeline] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [activeTrackFilter, setActiveTrackFilter] = useState('all');

  // Currently selected cue for inspector
  const [selectedCue, setSelectedCue] = useState(null);
  const [selectedTrack, setSelectedTrack] = useState('movementEvents');

  // Modals for Mode Preview and QR distribution
  const [previewMode, setPreviewMode] = useState(null); // 'visual', 'audio', 'haptic', 'complete'
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [qrData, setQrData] = useState(null);

  // New protected element input state
  const [newProtectedCategory, setNewProtectedCategory] = useState('Cultural Meaning');
  const [newProtectedDesc, setNewProtectedDesc] = useState('');

  // Notification banner state
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    fetchStudioData();
  }, [id]);

  const fetchStudioData = async () => {
    try {
      const res = await api.get(`/timeline/${id}`);
      if (res.data.success) {
        setTimeline(res.data.timeline);
        setPerformance(res.data.performance);

        // Pre-select first movement event if available
        if (res.data.timeline.movementEvents?.length > 0) {
          setSelectedCue(res.data.timeline.movementEvents[0]);
          setSelectedTrack('movementEvents');
        }
      }
    } catch (err) {
      console.warn('Error fetching studio timeline:', err);
    } finally {
      setLoading(false);
    }
  };

  // Video timeupdate sync
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const t = videoRef.current.currentTime;
      setCurrentTime(t);

      // Trigger synchronized haptics if any haptic cue hits
      if (timeline?.hapticCues) {
        const hit = timeline.hapticCues.find(h => Math.abs(h.timestamp - t) < 0.25);
        if (hit && isPlaying) {
          triggerHaptic(hit.pattern);
        }
      }
    }
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const seekTo = (seconds) => {
    if (videoRef.current) {
      videoRef.current.currentTime = seconds;
      setCurrentTime(seconds);
    }
  };

  const changeSpeed = (speed) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
  };

  // Cue approval / rejection handlers
  const handleApproveCue = async (cue, track) => {
    try {
      const res = await api.post(`/approval/${id}/approve`, {
        eventId: cue.id,
        track
      });
      if (res.data.success) {
        setTimeline(res.data.timeline);
        if (selectedCue?.id === cue.id) {
          setSelectedCue({ ...selectedCue, status: 'artist_approved' });
        }
        showNotice(`Cue approved by artist: "${cue.description || cue.text?.english || cue.label || 'Event'}"`);
      }
    } catch (err) {
      showNotice(err.message, 'error');
    }
  };

  const handleRejectCue = async (cue, track) => {
    try {
      const res = await api.post(`/approval/${id}/reject`, {
        eventId: cue.id,
        track
      });
      if (res.data.success) {
        setTimeline(res.data.timeline);
        if (selectedCue?.id === cue.id) {
          setSelectedCue({ ...selectedCue, status: 'rejected' });
        }
        showNotice('Cue rejected. It will not appear in audience modes.');
      }
    } catch (err) {
      showNotice(err.message, 'error');
    }
  };

  const handleApproveAll = async () => {
    try {
      const res = await api.post(`/approval/${id}/approve`, { approveAll: true });
      if (res.data.success) {
        setTimeline(res.data.timeline);
        showNotice('All proposed AI cues approved! Performance is ready to publish.');
      }
    } catch (err) {
      showNotice(err.message, 'error');
    }
  };

  // Save changes to selected cue
  const handleSaveSelectedCue = async () => {
    if (!selectedCue) return;
    try {
      const res = await api.put(`/timeline/events/${selectedCue.id}`, {
        track: selectedTrack,
        updates: selectedCue
      });
      if (res.data.success) {
        fetchStudioData();
        showNotice('Cue edits saved successfully.');
      }
    } catch (err) {
      showNotice(err.message, 'error');
    }
  };

  // Add custom cue
  const handleAddCustomCue = async (trackName) => {
    const newEvent = {
      id: `custom_${Date.now()}`,
      timestamp: Math.round(currentTime * 10) / 10,
      startTime: Math.round(currentTime * 10) / 10,
      endTime: Math.round((currentTime + 4.0) * 10) / 10,
      description: 'Custom artist choreographic cue',
      text: { bengali: '', hindi: '', english: 'Custom artist caption' },
      pattern: [200, 80, 200],
      durationMs: 250,
      label: 'Custom Accent',
      status: 'artist_edited'
    };

    try {
      const res = await api.post(`/timeline/${id}/events`, {
        track: trackName,
        event: newEvent
      });
      if (res.data.success) {
        setTimeline(res.data.timeline);
        setSelectedCue(newEvent);
        setSelectedTrack(trackName);
        showNotice(`New event added to ${trackName} at ${currentTime.toFixed(1)}s.`);
      }
    } catch (err) {
      showNotice(err.message, 'error');
    }
  };

  // Add protected element
  const handleAddProtectedElement = async (e) => {
    e.preventDefault();
    if (!newProtectedDesc) return;
    const item = {
      category: newProtectedCategory,
      description: newProtectedDesc,
      timestamp: Math.round(currentTime * 10) / 10
    };
    const updatedList = [...(performance.protectedElements || []), item];
    try {
      const res = await api.put(`/performances/${id}`, {
        protectedElements: updatedList
      });
      if (res.data.success) {
        setPerformance(res.data.performance);
        setNewProtectedDesc('');
        showNotice('Protected element registered. AI is forbidden from altering this meaning.');
      }
    } catch (err) {
      showNotice(err.message, 'error');
    }
  };

  // Publish workflow
  const handlePublish = async () => {
    try {
      const res = await api.post(`/publish/${id}`);
      if (res.data.success) {
        setPerformance(res.data.performance);
        setQrData({
          publicUrl: res.data.publicUrl,
          qrCodeDataUrl: res.data.qrCodeDataUrl,
          slug: res.data.performance.slug
        });
        setQrModalOpen(true);
        showNotice('Performance successfully published! QR Code is ready.');
      }
    } catch (err) {
      showNotice(err.response?.data?.message || err.message, 'error');
    }
  };

  const showNotice = (msg, type = 'success') => {
    setNotice({ msg, type });
    setTimeout(() => setNotice(null), 4000);
  };

  // Stats
  const allCues = [
    ...(timeline?.captions || []),
    ...(timeline?.movementEvents || []),
    ...(timeline?.sceneEvents || []),
    ...(timeline?.soundEvents || []),
    ...(timeline?.hapticCues || []),
    ...(timeline?.accessibilityDescriptions || [])
  ];

  const approvedCount = allCues.filter(c => c.status === 'artist_approved' || c.status === 'artist_edited').length;
  const pendingCount = allCues.filter(c => c.status === 'ai_suggested').length;
  const totalCount = allCues.length;
  const approvalPercent = totalCount > 0 ? Math.round((approvedCount / totalCount) * 100) : 0;

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center text-xs text-gray-400 font-mono">
        <Sliders className="w-5 h-5 text-primary-400 animate-spin mr-2" />
        Loading Artist Control Studio workspace...
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-16">
      {/* NOTICE BANNER */}
      {notice && (
        <div className={`p-3 rounded-xl border text-xs flex items-center justify-between ${
          notice.type === 'error' ? 'bg-rose-500/10 border-rose-500/30 text-rose-300' : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
        }`}>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{notice.msg}</span>
          </div>
          <button onClick={() => setNotice(null)} className="text-gray-400 hover:text-white">✕</button>
        </div>
      )}

      {/* TOP ACTION HEADER */}
      <div className="p-4 rounded-2xl glass-panel-elevated border border-gray-800 flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-primary-600/30 text-primary-300 border border-primary-500/40">
              Artist Mode • Flagship Studio
            </span>
            <span className="text-xs text-gray-400 font-mono">
              Timeline v{timeline?.version || 1}
            </span>
          </div>
          <h1 className="text-lg sm:text-xl font-bold text-white truncate max-w-xl">
            {performance?.title}
          </h1>
        </div>

        {/* Action Controls & Preview Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Four Preview Buttons */}
          <button
            onClick={() => setPreviewMode('visual')}
            className="px-3 py-1.5 rounded-lg bg-cyan-950/40 hover:bg-cyan-900/50 border border-cyan-500/30 text-cyan-300 text-xs font-semibold flex items-center gap-1.5 transition-all"
            title="Preview audience Visual Mode"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Preview Visual</span>
          </button>

          <button
            onClick={() => setPreviewMode('audio')}
            className="px-3 py-1.5 rounded-lg bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-1.5 transition-all"
            title="Preview audience Audio Mode"
          >
            <Headphones className="w-3.5 h-3.5" />
            <span>Preview Audio</span>
          </button>

          <button
            onClick={() => setPreviewMode('haptic')}
            className="px-3 py-1.5 rounded-lg bg-amber-950/40 hover:bg-amber-900/50 border border-amber-500/30 text-amber-300 text-xs font-semibold flex items-center gap-1.5 transition-all"
            title="Preview audience Haptic Mode"
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Preview Haptic</span>
          </button>

          {/* Quick Approve All */}
          {pendingCount > 0 && (
            <button
              onClick={handleApproveAll}
              className="px-3 py-1.5 rounded-lg bg-surface border border-gray-700 text-gray-300 hover:text-white text-xs font-medium flex items-center gap-1"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Approve All Proposals</span>
            </button>
          )}

          {/* Publish / QR trigger */}
          <button
            onClick={handlePublish}
            className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-500 hover:to-indigo-500 text-white text-xs font-bold shadow-md shadow-primary-600/30 flex items-center gap-1.5"
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>{performance?.isPublished ? 'View QR Distribution' : 'Publish & Generate QR'}</span>
          </button>
        </div>
      </div>

      {/* STUDIO 3-COLUMN WORKSPACE: LEFT (List), CENTER (Video), RIGHT (Inspector) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* LEFT COLUMN: Track Selector & Cues List (3 cols) */}
        <div className="lg:col-span-3 glass-panel p-4 rounded-2xl border border-gray-800 space-y-4 max-h-[580px] overflow-y-auto">
          <div className="flex items-center justify-between border-b border-gray-800 pb-2">
            <span className="text-xs font-bold text-white uppercase tracking-wider">Cues & Proposals</span>
            <span className="text-[11px] font-mono text-primary-400 font-semibold">
              {approvedCount}/{totalCount} Approved ({approvalPercent}%)
            </span>
          </div>

          {/* Track Filters */}
          <div className="flex flex-wrap gap-1 text-[11px]">
            {['all', 'captions', 'movementEvents', 'soundEvents', 'hapticCues'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTrackFilter(tab)}
                className={`px-2 py-1 rounded capitalize font-medium ${
                  activeTrackFilter === tab
                    ? 'bg-primary-600 text-white font-semibold'
                    : 'bg-surface text-gray-400 hover:text-white'
                }`}
              >
                {tab === 'movementEvents' ? 'Movement' : tab === 'soundEvents' ? 'Sound' : tab === 'hapticCues' ? 'Haptic' : tab}
              </button>
            ))}
          </div>

          {/* Cues List */}
          <div className="space-y-2">
            {allCues
              .filter(cue => {
                if (activeTrackFilter === 'all') return true;
                if (activeTrackFilter === 'captions') return !!cue.speaker;
                if (activeTrackFilter === 'movementEvents') return !!cue.poseName;
                if (activeTrackFilter === 'soundEvents') return !!cue.instrumentOrCue;
                if (activeTrackFilter === 'hapticCues') return !!cue.patternType;
                return true;
              })
              .map(cue => {
                const time = cue.startTime !== undefined ? cue.startTime : cue.timestamp;
                const isSelected = selectedCue?.id === cue.id;
                const isApproved = cue.status === 'artist_approved' || cue.status === 'artist_edited';

                return (
                  <div
                    key={cue.id}
                    onClick={() => {
                      setSelectedCue(cue);
                      seekTo(time);
                      // Guess track
                      if (cue.poseName) setSelectedTrack('movementEvents');
                      else if (cue.speaker) setSelectedTrack('captions');
                      else if (cue.instrumentOrCue) setSelectedTrack('soundEvents');
                      else if (cue.patternType) setSelectedTrack('hapticCues');
                      else setSelectedTrack('accessibilityDescriptions');
                    }}
                    className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                      isSelected
                        ? 'border-primary-500 bg-primary-950/30'
                        : 'border-gray-800 bg-surface/60 hover:bg-surface hover:border-gray-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-[10px] text-gray-400">
                        {Math.floor(time / 60)}:{(time % 60).toFixed(1).padStart(4, '0')}s
                      </span>
                      {isApproved ? (
                        <span className="text-[10px] text-emerald-400 flex items-center gap-0.5">
                          <CheckCircle2 className="w-3 h-3" /> Approved
                        </span>
                      ) : cue.status === 'rejected' ? (
                        <span className="text-[10px] text-rose-400 flex items-center gap-0.5">
                          <XCircle className="w-3 h-3" /> Rejected
                        </span>
                      ) : (
                        <span className="text-[10px] text-amber-400 flex items-center gap-0.5 animate-pulse">
                          AI Proposed
                        </span>
                      )}
                    </div>
                    <div className="font-medium text-white truncate">
                      {cue.poseName || cue.instrumentOrCue || cue.label || cue.text?.english || cue.description || 'Event'}
                    </div>
                  </div>
                );
              })}
          </div>

          {/* Quick Add Custom Cue */}
          <div className="pt-2 border-t border-gray-800">
            <button
              onClick={() => handleAddCustomCue('movementEvents')}
              className="w-full py-1.5 px-3 rounded-lg border border-dashed border-gray-700 text-gray-400 hover:text-white hover:border-primary-500/50 text-[11px] flex items-center justify-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Custom Cue at Current Time</span>
            </button>
          </div>
        </div>

        {/* CENTER COLUMN: Pristine Original Video & Playback Controls (6 cols) */}
        <div className="lg:col-span-6 space-y-3">
          {/* Video Player */}
          <div className="relative rounded-2xl overflow-hidden bg-black aspect-video flex items-center justify-center border border-gray-800 shadow-2xl">
            <video
              ref={videoRef}
              src={performance?.videoUrl}
              onTimeUpdate={handleTimeUpdate}
              onEnded={() => setIsPlaying(false)}
              className="w-full h-full object-contain"
            />

            {/* In-Video Live Overlay Preview (Visual Mode overlay when active) */}
            <div className="absolute bottom-4 inset-x-4 pointer-events-none space-y-1 text-center">
              {timeline?.captions?.find(c => currentTime >= c.startTime && currentTime <= c.endTime) && (
                <div className="inline-block px-3 py-1 rounded bg-black/85 backdrop-blur-md text-cyan-300 font-semibold text-xs border border-cyan-500/30">
                  {timeline.captions.find(c => currentTime >= c.startTime && currentTime <= c.endTime).text?.english}
                </div>
              )}
            </div>

            {/* Watermark notice */}
            <div className="absolute top-3 left-3 px-2 py-0.5 rounded text-[10px] font-mono bg-black/70 text-gray-400 backdrop-blur-sm border border-white/5">
              Original Master: Untouched
            </div>
          </div>

          {/* Video Control Bar */}
          <div className="p-3 rounded-xl glass-panel border border-gray-800 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <button
                onClick={togglePlay}
                className="w-8 h-8 rounded-lg bg-primary-600 hover:bg-primary-500 text-white flex items-center justify-center transition-all"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
              </button>

              <button
                onClick={() => seekTo(0)}
                className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800"
                title="Rewind to start"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <span className="font-mono text-xs text-gray-300">
                {Math.floor(currentTime / 60)}:{(currentTime % 60).toFixed(1).padStart(4, '0')} / {Math.floor((performance?.duration || 60) / 60)}:{((performance?.duration || 60) % 60).toFixed(0).padStart(2, '0')}s
              </span>
            </div>

            {/* Playback Speed selector */}
            <div className="flex items-center gap-1 text-[11px] font-mono">
              {[0.75, 1, 1.25].map(spd => (
                <button
                  key={spd}
                  onClick={() => changeSpeed(spd)}
                  className={`px-2 py-1 rounded ${playbackSpeed === spd ? 'bg-primary-600 text-white font-bold' : 'text-gray-400 hover:bg-gray-800'}`}
                >
                  {spd}x
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Event Inspector, Description Styles, & Protected Elements (3 cols) */}
        <div className="lg:col-span-3 glass-panel p-4 rounded-2xl border border-gray-800 space-y-4 max-h-[580px] overflow-y-auto">
          <div className="flex items-center justify-between border-b border-gray-800 pb-2">
            <span className="text-xs font-bold text-white uppercase tracking-wider">Cue Inspector</span>
            {selectedCue && (
              <span className="text-[10px] font-mono text-primary-400">
                ID: {selectedCue.id.slice(0, 8)}
              </span>
            )}
          </div>

          {selectedCue ? (
            <div className="space-y-4">
              {/* Style selector for descriptions */}
              <div>
                <label className="block text-[11px] font-semibold text-gray-400 mb-1">
                  Description Style
                </label>
                <div className="grid grid-cols-3 gap-1 text-[11px]">
                  {['literal', 'poetic', 'minimal'].map(style => (
                    <button
                      key={style}
                      onClick={() => setSelectedCue({ ...selectedCue, style })}
                      className={`py-1 rounded capitalize font-medium ${
                        selectedCue.style === style
                          ? 'bg-primary-600 text-white font-semibold'
                          : 'bg-surface text-gray-400 hover:text-white'
                      }`}
                    >
                      {style}
                    </button>
                  ))}
                </div>
              </div>

              {/* Title / Description input */}
              <div>
                <label className="block text-[11px] font-semibold text-gray-400 mb-1">
                  English Description
                </label>
                <textarea
                  rows={2}
                  value={selectedCue.description || selectedCue.text?.english || ''}
                  onChange={(e) => {
                    if (selectedCue.description !== undefined) {
                      setSelectedCue({ ...selectedCue, description: e.target.value });
                    } else if (selectedCue.text) {
                      setSelectedCue({ ...selectedCue, text: { ...selectedCue.text, english: e.target.value } });
                    }
                  }}
                  className="w-full p-2 rounded-lg bg-surface border border-gray-700 text-xs text-white focus:border-primary-500 focus:outline-none"
                />
              </div>

              {/* Bengali Translation */}
              <div>
                <label className="block text-[11px] font-semibold text-gray-400 mb-1">
                  Bengali (বাংলা) Translation
                </label>
                <input
                  type="text"
                  value={selectedCue.text?.bengali || ''}
                  onChange={(e) => setSelectedCue({
                    ...selectedCue,
                    text: { ...(selectedCue.text || {}), bengali: e.target.value }
                  })}
                  placeholder="বাংলা বিবরণ..."
                  className="w-full p-2 rounded-lg bg-surface border border-gray-700 text-xs text-white focus:border-primary-500 focus:outline-none"
                />
              </div>

              {/* Hindi Translation */}
              <div>
                <label className="block text-[11px] font-semibold text-gray-400 mb-1">
                  Hindi (हिन्दी) Translation
                </label>
                <input
                  type="text"
                  value={selectedCue.text?.hindi || ''}
                  onChange={(e) => setSelectedCue({
                    ...selectedCue,
                    text: { ...(selectedCue.text || {}), hindi: e.target.value }
                  })}
                  placeholder="हिन्दी विवरण..."
                  className="w-full p-2 rounded-lg bg-surface border border-gray-700 text-xs text-white focus:border-primary-500 focus:outline-none"
                />
              </div>

              {/* Timestamp adjustment */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-[10px] text-gray-400 block mb-0.5">Timestamp (s)</span>
                  <input
                    type="number"
                    step="0.1"
                    value={selectedCue.timestamp !== undefined ? selectedCue.timestamp : selectedCue.startTime || 0}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      if (selectedCue.timestamp !== undefined) setSelectedCue({ ...selectedCue, timestamp: val });
                      if (selectedCue.startTime !== undefined) setSelectedCue({ ...selectedCue, startTime: val });
                    }}
                    className="w-full p-1.5 rounded bg-surface border border-gray-700 font-mono text-white text-xs"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 block mb-0.5">Duration (s)</span>
                  <input
                    type="number"
                    step="0.1"
                    value={selectedCue.duration || (selectedCue.endTime ? selectedCue.endTime - selectedCue.startTime : 3.0)}
                    onChange={(e) => setSelectedCue({ ...selectedCue, duration: parseFloat(e.target.value) })}
                    className="w-full p-1.5 rounded bg-surface border border-gray-700 font-mono text-white text-xs"
                  />
                </div>
              </div>

              {/* Haptic Pattern if Haptic Cue */}
              {selectedCue.pattern && (
                <div>
                  <span className="text-[10px] text-gray-400 block mb-1">Vibration Pattern (ms)</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={selectedCue.pattern.join(', ')}
                      onChange={(e) => {
                        const arr = e.target.value.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
                        setSelectedCue({ ...selectedCue, pattern: arr });
                      }}
                      className="w-full p-1.5 rounded bg-surface border border-gray-700 font-mono text-white text-xs"
                    />
                    <button
                      onClick={() => triggerHaptic(selectedCue.pattern)}
                      className="px-2 py-1.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-semibold shrink-0"
                    >
                      Test
                    </button>
                  </div>
                </div>
              )}

              {/* Save & Approval Buttons */}
              <div className="space-y-2 pt-2 border-t border-gray-800">
                <button
                  onClick={handleSaveSelectedCue}
                  className="w-full py-1.5 rounded-lg bg-surface border border-gray-700 hover:border-gray-600 text-gray-200 text-xs font-semibold flex items-center justify-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Edits</span>
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleApproveCue(selectedCue, selectedTrack)}
                    className="py-1.5 rounded-lg bg-emerald-600/30 hover:bg-emerald-600/40 border border-emerald-500/50 text-emerald-300 text-xs font-semibold flex items-center justify-center gap-1"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Approve</span>
                  </button>
                  <button
                    onClick={() => handleRejectCue(selectedCue, selectedTrack)}
                    className="py-1.5 rounded-lg bg-rose-600/20 hover:bg-rose-600/30 border border-rose-500/40 text-rose-300 text-xs font-semibold flex items-center justify-center gap-1"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Reject</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-8 text-center text-xs text-gray-500">
              Click on any cue in the timeline or left list to inspect and edit.
            </div>
          )}

          {/* PROTECTED ELEMENTS SECTION (Prompt Section 12) */}
          <div className="pt-4 border-t border-gray-800 space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-primary-300">
              <ShieldCheck className="w-4 h-4" />
              <span>Elements AI Must Never Alter</span>
            </div>
            <p className="text-[10px] text-gray-400">
              Cultural meanings & symbolic mudras protected from automated modification.
            </p>

            <div className="space-y-1.5">
              {performance?.protectedElements?.map((pe, idx) => (
                <div key={idx} className="p-2 rounded bg-surface border border-gray-800 text-[11px] text-gray-300 space-y-0.5">
                  <span className="font-semibold text-primary-400 block">{pe.category}:</span>
                  <p className="text-gray-400 text-[10px] leading-tight">{pe.description}</p>
                </div>
              ))}
            </div>

            {/* Add Protected Element Form */}
            <form onSubmit={handleAddProtectedElement} className="space-y-2 pt-1">
              <input
                type="text"
                value={newProtectedDesc}
                onChange={(e) => setNewProtectedDesc(e.target.value)}
                placeholder="Declare protected artistic intention..."
                className="w-full p-2 rounded bg-surface border border-gray-700 text-xs text-white placeholder-gray-500 focus:border-primary-500 focus:outline-none"
              />
              <button
                type="submit"
                className="w-full py-1 rounded bg-primary-600/20 text-primary-300 border border-primary-500/30 text-[10px] font-semibold"
              >
                + Lock Cultural Intention
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* BOTTOM: SYNCHRONIZED 5-TRACK TIMELINE ENGINE */}
      <div className="glass-panel p-5 rounded-2xl border border-gray-800 space-y-3">
        <div className="flex items-center justify-between border-b border-gray-800 pb-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-white uppercase tracking-wider">Synchronized Creative Timeline</span>
            <span className="text-[10px] text-gray-500 font-mono">00:00 - 01:00</span>
          </div>
          <span className="text-[11px] text-gray-400">Click any marker or scrub track to synchronize</span>
        </div>

        {/* Ruler */}
        <div className="relative h-6 w-full bg-surface-elevated rounded flex items-center px-2 text-[10px] font-mono text-gray-500 select-none">
          <div className="flex justify-between w-full">
            <span>00:00</span>
            <span>00:15</span>
            <span>00:30</span>
            <span>00:45</span>
            <span>01:00</span>
          </div>
          {/* Playhead Indicator */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-rose-500 z-20 pointer-events-none"
            style={{ left: `${Math.min(100, (currentTime / (performance?.duration || 60)) * 100)}%` }}
          >
            <div className="w-2.5 h-2.5 bg-rose-500 -ml-1 -top-1 rounded-full shadow-md"></div>
          </div>
        </div>

        {/* TRACK 1: CAPTIONS TRACK */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[11px] text-cyan-400 font-semibold">
            <span>Track 1: Captions & Spoken Bol</span>
            <span className="font-mono text-[10px] text-gray-500">{timeline?.captions?.length || 0} Cues</span>
          </div>
          <div
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const pct = (e.clientX - rect.left) / rect.width;
              seekTo(pct * (performance?.duration || 60));
            }}
            className="relative h-8 bg-surface rounded-lg border border-gray-800 overflow-hidden cursor-pointer"
          >
            {timeline?.captions?.map(c => {
              const startPct = (c.startTime / (performance?.duration || 60)) * 100;
              const widthPct = Math.max(2, ((c.endTime - c.startTime) / (performance?.duration || 60)) * 100);
              const isApproved = c.status === 'artist_approved' || c.status === 'artist_edited';

              return (
                <div
                  key={c.id}
                  onClick={(e) => { e.stopPropagation(); setSelectedCue(c); setSelectedTrack('captions'); seekTo(c.startTime); }}
                  className={`absolute top-1 bottom-1 rounded px-1.5 text-[10px] font-mono truncate flex items-center border ${
                    isApproved
                      ? 'bg-cyan-950/70 text-cyan-300 border-cyan-500/50'
                      : 'bg-amber-950/70 text-amber-300 border-amber-500/50'
                  }`}
                  style={{ left: `${startPct}%`, width: `${widthPct}%` }}
                >
                  {c.text?.english || c.speaker}
                </div>
              );
            })}
          </div>
        </div>

        {/* TRACK 2: MOVEMENT & MUDRAS TRACK */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[11px] text-purple-400 font-semibold">
            <span>Track 2: Movement & Mudras (MediaPipe + AI)</span>
            <span className="font-mono text-[10px] text-gray-500">{timeline?.movementEvents?.length || 0} Poses</span>
          </div>
          <div
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const pct = (e.clientX - rect.left) / rect.width;
              seekTo(pct * (performance?.duration || 60));
            }}
            className="relative h-8 bg-surface rounded-lg border border-gray-800 overflow-hidden cursor-pointer"
          >
            {timeline?.movementEvents?.map(m => {
              const leftPct = (m.timestamp / (performance?.duration || 60)) * 100;
              const isApproved = m.status === 'artist_approved' || m.status === 'artist_edited';

              return (
                <div
                  key={m.id}
                  onClick={(e) => { e.stopPropagation(); setSelectedCue(m); setSelectedTrack('movementEvents'); seekTo(m.timestamp); }}
                  className={`absolute top-1 bottom-1 rounded px-1.5 text-[10px] font-mono truncate flex items-center border ${
                    isApproved
                      ? 'bg-purple-950/70 text-purple-300 border-purple-500/50'
                      : 'bg-amber-950/70 text-amber-300 border-amber-500/50'
                  }`}
                  style={{ left: `${leftPct}%`, width: '14%' }}
                >
                  {m.poseName || m.description}
                </div>
              );
            })}
          </div>
        </div>

        {/* TRACK 3: SOUND & MUSIC BEATS TRACK */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[11px] text-emerald-400 font-semibold">
            <span>Track 3: Sound & Acoustic Beats (Librosa)</span>
            <span className="font-mono text-[10px] text-gray-500">{timeline?.soundEvents?.length || 0} Acoustic Cues</span>
          </div>
          <div
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const pct = (e.clientX - rect.left) / rect.width;
              seekTo(pct * (performance?.duration || 60));
            }}
            className="relative h-8 bg-surface rounded-lg border border-gray-800 overflow-hidden cursor-pointer"
          >
            {timeline?.soundEvents?.map(s => {
              const leftPct = (s.timestamp / (performance?.duration || 60)) * 100;
              return (
                <div
                  key={s.id}
                  onClick={(e) => { e.stopPropagation(); setSelectedCue(s); setSelectedTrack('soundEvents'); seekTo(s.timestamp); }}
                  className="absolute top-1 bottom-1 rounded px-1.5 text-[10px] font-mono bg-emerald-950/70 text-emerald-300 border border-emerald-500/50 truncate flex items-center"
                  style={{ left: `${leftPct}%`, width: '12%' }}
                >
                  {s.instrumentOrCue}
                </div>
              );
            })}
          </div>
        </div>

        {/* TRACK 4: HAPTIC VIBRATION PATTERNS TRACK */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[11px] text-amber-400 font-semibold">
            <span>Track 4: Haptic Vibration Pulses (Tactile)</span>
            <span className="font-mono text-[10px] text-gray-500">{timeline?.hapticCues?.length || 0} Cues</span>
          </div>
          <div
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const pct = (e.clientX - rect.left) / rect.width;
              seekTo(pct * (performance?.duration || 60));
            }}
            className="relative h-8 bg-surface rounded-lg border border-gray-800 overflow-hidden cursor-pointer"
          >
            {timeline?.hapticCues?.map(h => {
              const leftPct = (h.timestamp / (performance?.duration || 60)) * 100;
              return (
                <div
                  key={h.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedCue(h);
                    setSelectedTrack('hapticCues');
                    seekTo(h.timestamp);
                    triggerHaptic(h.pattern);
                  }}
                  className="absolute top-1 bottom-1 rounded px-1 text-[10px] font-mono bg-amber-950/70 text-amber-300 border border-amber-500/50 truncate flex items-center justify-center"
                  style={{ left: `${leftPct}%`, width: '8%' }}
                >
                  ⚡ {h.label}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* MODAL: LIVE ACCESSIBILITY MODE PREVIEW (Section 14) */}
      {previewMode && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel-elevated w-full max-w-2xl rounded-3xl border border-gray-700 p-6 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <div className="flex items-center gap-2">
                <ModeBadge mode={previewMode} size="lg" />
                <span className="text-sm font-bold text-white">Live Audience Perspective Preview</span>
              </div>
              <button
                onClick={() => setPreviewMode(null)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Preview Simulation Display */}
            {previewMode === 'visual' && (
              <div className="space-y-4">
                <p className="text-xs text-gray-300">
                  This simulates how a deaf audience member experiences synchronized captions and choreographic indicators:
                </p>
                <div className="p-6 rounded-2xl bg-black border border-cyan-500/30 space-y-4 text-center">
                  <div className="text-sm font-semibold text-cyan-300">
                    {timeline?.captions?.[0]?.text?.english || "A new melody resonates in the winds; the earth awakens."}
                  </div>
                  <div className="text-xs text-gray-400 font-mono">
                    বাংলা: {timeline?.captions?.[0]?.text?.bengali}
                  </div>
                  <div className="inline-block px-3 py-1 rounded-full bg-cyan-950/80 text-cyan-400 text-xs border border-cyan-500/40">
                    [Movement Cue: Aramandi Opening Stance & Samputa Mudra]
                  </div>
                </div>
              </div>
            )}

            {previewMode === 'audio' && (
              <div className="space-y-4">
                <p className="text-xs text-gray-300">
                  This simulates spoken descriptive narration. Press Speak to test browser speech synthesis:
                </p>
                <div className="p-6 rounded-2xl bg-black border border-emerald-500/30 space-y-4 text-center">
                  <div className="text-sm text-emerald-300 font-medium">
                    "The dancer lowers into a graceful posture, unfolding her palms like the first buds of spring."
                  </div>
                  <button
                    onClick={() => speakText("The dancer lowers into a graceful posture, unfolding her palms like the first buds of spring.")}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center justify-center gap-2 mx-auto"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>Play Audio Description Narration</span>
                  </button>
                </div>
              </div>
            )}

            {previewMode === 'haptic' && (
              <div className="space-y-4">
                <p className="text-xs text-gray-300">
                  Testing smartphone vibration pulse. If supported by your browser, your mobile will vibrate:
                </p>
                <div className="p-6 rounded-2xl bg-black border border-amber-500/30 space-y-4 text-center">
                  <div className="text-xs font-mono text-amber-300">
                    Pattern: [100ms, 50ms, 100ms, 50ms, 100ms] • Tatkar Footwork
                  </div>
                  <button
                    onClick={() => triggerHaptic([100, 50, 100, 50, 100])}
                    className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold flex items-center justify-center gap-2 mx-auto animate-pulse"
                  >
                    <Activity className="w-4 h-4" />
                    <span>Trigger Phone Vibration Now</span>
                  </button>
                </div>
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setPreviewMode(null)}
                className="px-4 py-2 rounded-xl bg-surface border border-gray-700 text-xs font-semibold text-gray-300 hover:text-white"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: QR CODE & PUBLIC DISTRIBUTION (Section 16) */}
      {qrModalOpen && qrData && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel-elevated w-full max-w-md rounded-3xl border border-primary-500/40 p-6 space-y-6 text-center">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <span className="text-xs font-bold text-white uppercase tracking-wider">Performance Published Live</span>
              <button onClick={() => setQrModalOpen(false)} className="text-gray-400 hover:text-white">✕</button>
            </div>

            {/* QR Image */}
            <div className="p-4 rounded-2xl bg-white w-60 h-60 mx-auto flex items-center justify-center shadow-xl">
              <img src={qrData.qrCodeDataUrl} alt="Audience Access QR Code" className="w-full h-full object-contain" />
            </div>

            <div className="space-y-2">
              <h3 className="font-bold text-white text-base">Scan to Experience Performance</h3>
              <p className="text-xs text-gray-400">
                Audience can point smartphone camera to open the 4 accessibility modes immediately. No login needed.
              </p>
            </div>

            <div className="p-2.5 rounded-xl bg-surface border border-gray-800 text-xs font-mono text-gray-300 truncate">
              {qrData.publicUrl}
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <a
                href={qrData.qrCodeDataUrl}
                download={`rasacue-${qrData.slug}.png`}
                className="py-2.5 px-3 rounded-xl bg-surface border border-gray-700 hover:bg-gray-700 text-xs font-semibold text-white flex items-center justify-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download QR</span>
              </a>

              <Link
                to={`/experience/${qrData.slug}`}
                target="_blank"
                className="py-2.5 px-3 rounded-xl bg-primary-600 hover:bg-primary-500 text-xs font-semibold text-white flex items-center justify-center gap-1.5"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Open Link</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

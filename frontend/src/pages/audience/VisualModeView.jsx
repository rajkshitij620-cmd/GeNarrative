import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api';
import { useAccessibility } from '../../context/AccessibilityContext';
import { Eye, ArrowLeft, Sun, Moon, Type, Play, Pause, ShieldCheck } from 'lucide-react';
import ModeBadge from '../../components/common/ModeBadge';
import LanguageDropdown from '../../components/common/LanguageDropdown';

export default function VisualModeView() {
  const { slug } = useParams();
  const { language, setLanguage, fontSize, setFontSize, highContrast, setHighContrast } = useAccessibility();

  const videoRef = useRef(null);

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoDuration, setVideoDuration] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get(`/public/${slug}/visual?lang=${language}`);
        if (res.data.success) {
          setData(res.data);
        }
      } catch (err) {
        console.warn('Error fetching visual mode data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [slug, language]);

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
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

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center text-xs text-gray-400 font-mono">
        <Eye className="w-5 h-5 text-cyan-400 animate-spin mr-2" />
        Loading Visual Accessibility Mode...
      </div>
    );
  }

  // Active cues at current timestamp
  const activeCaption = data?.captions?.find(c => currentTime >= c.startTime && currentTime <= c.endTime);
  const activeMovement = data?.movementDescriptions?.find(m => Math.abs(currentTime - m.timestamp) < (m.duration || 3.0));
  const activeSound = data?.soundEvents?.find(s => Math.abs(currentTime - s.timestamp) < 2.5);

  const fontClass = fontSize === 'xl' ? 'text-2xl sm:text-3xl' : fontSize === 'large' ? 'text-lg sm:text-xl' : 'text-sm sm:text-base';
  const contrastBg = highContrast ? 'bg-black text-yellow-300 border-yellow-400' : 'bg-black/90 text-white border-cyan-500/40';

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6 pb-20">
      {/* Top Bar with Accessibility Settings */}
      <div className="flex items-center justify-between gap-4">
        <Link
          to={`/experience/${slug}`}
          className="text-xs text-gray-400 hover:text-white flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Hub</span>
        </Link>

        <ModeBadge mode="visual" size="lg" />

        {/* Accessibility Toolbar */}
        <div className="flex items-center gap-2">
          {/* Contrast toggle */}
          <button
            onClick={() => setHighContrast(!highContrast)}
            className={`p-2 rounded-lg border text-xs font-semibold ${
              highContrast ? 'bg-yellow-400 text-black border-yellow-300' : 'bg-surface text-gray-300 border-gray-700'
            }`}
            title="Toggle High Contrast"
          >
            {highContrast ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          </button>

          {/* Font Size toggle */}
          <button
            onClick={() => setFontSize(fontSize === 'normal' ? 'large' : fontSize === 'large' ? 'xl' : 'normal')}
            className="px-2.5 py-1 rounded-lg bg-surface border border-gray-700 text-xs font-mono text-gray-300 hover:text-white"
            title="Cycle text size"
          >
            A{fontSize === 'xl' ? '++' : fontSize === 'large' ? '+' : ''}
          </button>

          {/* Language selector */}
          <LanguageDropdown
            language={language}
            setLanguage={setLanguage}
            accentClass="bg-cyan-700/40 text-cyan-200"
          />
        </div>
      </div>

      {/* Video Viewport with Live Visual Overlay */}
      <div className="relative rounded-3xl overflow-hidden bg-black aspect-video border border-cyan-500/30 shadow-2xl">
        <video
          ref={videoRef}
          src={data?.videoUrl}
          onTimeUpdate={handleTimeUpdate}
          onEnded={() => setIsPlaying(false)}
          onLoadedMetadata={() => setVideoDuration(videoRef.current?.duration || 0)}
          className="w-full h-full object-contain"
        />

        {/* Centered Synchronized Captions & Sound Indicators */}
        <div className="absolute bottom-6 inset-x-4 pointer-events-none flex flex-col items-center gap-2">
          {/* Active Sound Indicator Pill */}
          {activeSound && (
            <div className="px-3 py-1 rounded-full bg-cyan-950/90 text-cyan-300 text-xs font-bold font-mono border border-cyan-400/50 backdrop-blur-md animate-pulse">
              ♫ [{activeSound.instrumentOrCue}]
            </div>
          )}

          {/* Active Spoken Caption */}
          {activeCaption && (
            <div className={`p-3 sm:p-4 rounded-2xl ${contrastBg} backdrop-blur-md border shadow-2xl max-w-xl text-center transition-all leading-snug font-bold ${fontClass}`}>
              {activeCaption.text?.[language] || activeCaption.text?.english}
            </div>
          )}

          {/* Active Movement Description */}
          {activeMovement && !activeCaption && (
            <div className="p-2.5 sm:p-3 rounded-xl bg-purple-950/90 text-purple-200 border border-purple-500/40 backdrop-blur-md max-w-lg text-center text-xs sm:text-sm font-medium">
              [Movement: {activeMovement.description}]
            </div>
          )}
        </div>
      </div>

      {/* Playback bar */}
      <div className="p-4 rounded-2xl glass-panel border border-gray-800 flex items-center justify-between">
        <button
          onClick={togglePlay}
          className="w-9 h-9 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white flex items-center justify-center"
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
        </button>
        <span className="font-mono text-xs text-gray-300">
          {Math.floor(currentTime / 60)}:{(currentTime % 60).toFixed(1).padStart(4, '0')}s
        </span>
        <span className="text-[11px] font-mono text-cyan-400 font-semibold">
          Visual Mode Active
        </span>
      </div>

      {/* Complete Synchronized Subtitle Stream — Dynamic Timeline */}
      <div className="glass-panel p-5 rounded-2xl border border-gray-800 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
            Complete Synchronized Subtitle Stream
          </h3>
          <span className="text-[10px] text-gray-500 font-mono">
            {videoDuration > 0 ? `${videoDuration.toFixed(0)}s total` : 'Loading...'}
          </span>
        </div>

        {videoDuration > 0 ? (
          <div className="overflow-x-auto pb-2">
            <div
              className="relative"
              style={{ width: `${Math.max(videoDuration * 22, 320)}px`, height: '72px' }}
            >
              {/* Ruler tick marks */}
              {Array.from({ length: Math.ceil(videoDuration / 5) + 1 }).map((_, i) => {
                const sec = i * 5;
                if (sec > videoDuration) return null;
                return (
                  <div
                    key={i}
                    className="absolute top-0 bottom-0 flex flex-col"
                    style={{ left: `${(sec / videoDuration) * 100}%` }}
                  >
                    <div className="w-px h-3 bg-white/20" />
                    <span className="text-[8px] text-gray-600 font-mono ml-0.5 mt-0.5">{sec}s</span>
                  </div>
                );
              })}

              {/* Thin baseline */}
              <div className="absolute top-3 left-0 right-0 h-px bg-white/10" />

              {/* Moving playhead */}
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-cyan-400 z-20 transition-all"
                style={{ left: `${(currentTime / videoDuration) * 100}%` }}
              >
                <div className="w-2 h-2 rounded-full bg-cyan-400 -ml-[3px] -mt-0.5" />
              </div>

              {/* Caption blocks */}
              {data?.captions?.map(c => {
                const leftPct = (c.startTime / videoDuration) * 100;
                const widthPct = ((c.endTime - c.startTime) / videoDuration) * 100;
                const isActive = currentTime >= c.startTime && currentTime <= c.endTime;
                return (
                  <div
                    key={c.id}
                    onClick={() => { if (videoRef.current) videoRef.current.currentTime = c.startTime; }}
                    title={`${c.startTime}s–${c.endTime}s • ${c.speaker}: ${c.text?.english || ''}`}
                    className={`absolute top-5 h-8 rounded px-1.5 text-[9px] font-mono cursor-pointer border truncate flex items-center transition-all ${
                      isActive
                        ? 'bg-cyan-600 border-cyan-400 text-white z-10'
                        : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-cyan-500 hover:text-white'
                    }`}
                    style={{
                      left: `${leftPct}%`,
                      width: `${widthPct}%`,
                      minWidth: '36px'
                    }}
                  >
                    {c.speaker || c.text?.english?.substring(0, 10)}
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <p className="text-[11px] text-gray-500 font-mono">Play the video to load timeline…</p>
        )}
      </div>
    </div>
  );
}

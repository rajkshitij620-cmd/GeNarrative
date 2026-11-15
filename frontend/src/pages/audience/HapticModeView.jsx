import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api';
import { useAccessibility } from '../../context/AccessibilityContext';
import {
  Activity,
  ArrowLeft,
  Smartphone,
  Play,
  Pause,
  RotateCcw,
  Sliders,
  CheckCircle2,
  AlertCircle,
  Zap,
  Sparkles
} from 'lucide-react';
import ModeBadge from '../../components/common/ModeBadge';

export default function HapticModeView() {
  const { slug } = useParams();
  const {
    hapticIntensity,
    setHapticIntensity,
    isVibrationSupported,
    triggerHaptic
  } = useAccessibility();

  const videoRef = useRef(null);
  const activeHapticTracker = useRef({});

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activePulse, setActivePulse] = useState(null);
  const [videoDuration, setVideoDuration] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get(`/public/${slug}/haptic`);
        if (res.data.success) {
          setData(res.data);
        }
      } catch (err) {
        console.warn('Error fetching haptic data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [slug]);

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const t = videoRef.current.currentTime;
    setCurrentTime(t);

    if (data?.hapticCues) {
      data.hapticCues.forEach(cue => {
        if (Math.abs(t - cue.timestamp) < 0.3 && !activeHapticTracker.current[cue.id]) {
          activeHapticTracker.current[cue.id] = true;
          triggerHaptic(cue.pattern);
          setActivePulse(cue);
          setTimeout(() => setActivePulse(null), cue.durationMs || 400);
        }
      });
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

  const testVibration = (pattern = [150, 60, 200]) => {
    triggerHaptic(pattern);
    setActivePulse({ label: 'Test Vibration Pulse', pattern });
    setTimeout(() => setActivePulse(null), 500);
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center text-xs text-gray-400 font-mono">
        <Activity className="w-5 h-5 text-amber-400 animate-spin mr-2" />
        Configuring Tactile Rhythm Engine...
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6 pb-20">
      {/* Top Bar */}
      <div className="flex items-center justify-between gap-4">
        <Link
          to={`/experience/${slug}`}
          className="text-xs text-gray-400 hover:text-white flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Hub</span>
        </Link>

        <ModeBadge mode="haptic" size="lg" />

        <div className="flex items-center gap-1.5 text-xs font-mono text-amber-400">
          <Smartphone className="w-3.5 h-3.5" />
          <span>{isVibrationSupported ? 'Vibration Active' : 'Visual Pulse Fallback'}</span>
        </div>
      </div>

      {/* Video & Synchronized Visual Haptic Pulse Overlay */}
      <div className="relative rounded-3xl overflow-hidden bg-black aspect-video border border-amber-500/30 shadow-2xl">
        <video
          ref={videoRef}
          src={data?.videoUrl}
          onTimeUpdate={handleTimeUpdate}
          onEnded={() => setIsPlaying(false)}
          onLoadedMetadata={() => setVideoDuration(videoRef.current?.duration || 0)}
          className="w-full h-full object-contain"
        />

        {/* HAPTIC VISUAL PULSE WAVE (For both physical feedback and iPhone fallback) */}
        {activePulse && (
          <div className="absolute inset-0 bg-amber-500/20 pointer-events-none flex items-center justify-center animate-pulse transition-opacity duration-200">
            <div className="w-32 h-32 rounded-full border-4 border-amber-400/80 animate-ping"></div>
            <div className="absolute px-4 py-2 rounded-xl bg-black/90 backdrop-blur-md text-amber-300 font-bold text-xs border border-amber-400/50 shadow-2xl">
              ⚡ Tactile Pulse: {activePulse.label}
            </div>
          </div>
        )}
      </div>

      {/* Device Compatibility Status Banner */}
      <div className={`p-4 rounded-2xl border text-xs flex items-start gap-3 ${
        isVibrationSupported
          ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
          : 'bg-amber-950/20 border-amber-500/30 text-amber-300'
      }`}>
        {isVibrationSupported ? (
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
        ) : (
          <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        )}
        <div className="space-y-0.5">
          <strong className="block font-semibold">
            {isVibrationSupported ? 'Device Vibration Motor Detected' : 'Tactile Pulse Visualizer Active'}
          </strong>
          <p className="text-[11px] opacity-90 leading-relaxed">
            {isVibrationSupported
              ? 'Your browser supports the Web Vibration API. You will feel physical tactile vibrations in sync with the performance rhythm.'
              : 'Web Vibration is restricted on iOS Safari. RASA CUE is providing our synchronized visual wave pulses so you still perceive the exact tactile rhythms.'}
          </p>
        </div>
      </div>

      {/* Haptic Controls */}
      <div className="glass-panel p-5 rounded-2xl border border-gray-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={togglePlay}
              className="w-10 h-10 rounded-xl bg-amber-600 hover:bg-amber-500 text-white flex items-center justify-center transition-all"
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-white" />}
            </button>
            <span className="font-mono text-xs text-gray-300">
              {Math.floor(currentTime / 60)}:{(currentTime % 60).toFixed(1).padStart(4, '0')}s
            </span>
          </div>

          <button
            onClick={() => testVibration()}
            className="px-3.5 py-1.5 rounded-lg bg-surface border border-amber-500/40 text-amber-300 text-xs font-semibold hover:bg-amber-500/10 transition-all"
          >
            Test Vibration
          </button>
        </div>

        {/* Intensity multiplier slider */}
        <div className="pt-2 border-t border-gray-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-gray-300 font-semibold">
            <Sliders className="w-4 h-4 text-amber-400" />
            <span>Tactile Vibration Intensity</span>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="range"
              min="0.5"
              max="1.5"
              step="0.1"
              value={hapticIntensity}
              onChange={(e) => setHapticIntensity(parseFloat(e.target.value))}
              className="w-32 accent-amber-500 cursor-pointer"
            />
            <span className="font-mono text-xs text-amber-400 font-bold w-10 text-right">
              {Math.round(hapticIntensity * 100)}%
            </span>
          </div>
        </div>
      </div>

      {/* Haptic Events — Dynamic Timeline */}
      <div className="glass-panel p-5 rounded-2xl border border-gray-800 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
            Approved Tactile Vibration Patterns
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
              {/* Ruler ticks every 5s */}
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

              {/* Baseline */}
              <div className="absolute top-3 left-0 right-0 h-px bg-white/10" />

              {/* Playhead */}
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-amber-400 z-20 transition-all"
                style={{ left: `${(currentTime / videoDuration) * 100}%` }}
              >
                <div className="w-2 h-2 rounded-full bg-amber-400 -ml-[3px] -mt-0.5" />
              </div>

              {/* Haptic cue markers (pins) */}
              {data?.hapticCues?.map(cue => {
                const leftPct = (cue.timestamp / videoDuration) * 100;
                const isActive = Math.abs(currentTime - cue.timestamp) < (cue.durationMs / 1000 || 0.5);
                return (
                  <div
                    key={cue.id}
                    onClick={() => {
                      if (videoRef.current) videoRef.current.currentTime = cue.timestamp;
                      testVibration(cue.pattern);
                    }}
                    title={`${cue.timestamp}s • ${cue.label} • [${cue.pattern?.join(', ')}]ms`}
                    className="absolute top-5 cursor-pointer z-10 flex flex-col items-center"
                    style={{ left: `${leftPct}%`, transform: 'translateX(-50%)' }}
                  >
                    <div className={`w-3 h-3 rounded-full border-2 transition-all ${
                      isActive
                        ? 'bg-amber-400 border-amber-300 scale-150'
                        : 'bg-amber-700 border-amber-500 hover:bg-amber-500'
                    }`} />
                    <span className={`text-[8px] font-mono mt-1 whitespace-nowrap ${
                      isActive ? 'text-amber-300' : 'text-gray-500'
                    }`}>
                      ⚡{cue.timestamp}s
                    </span>
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

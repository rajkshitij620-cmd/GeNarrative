import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api';
import { useAccessibility } from '../../context/AccessibilityContext';
import {
  Headphones,
  ArrowLeft,
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Sliders
} from 'lucide-react';
import ModeBadge from '../../components/common/ModeBadge';

export default function AudioModeView() {
  const { slug } = useParams();
  const {
    language,
    setLanguage,
    narrationVolume,
    setNarrationVolume,
    audioNarrationEnabled,
    setAudioNarrationEnabled,
    speakText
  } = useAccessibility();

  const videoRef = useRef(null);
  const spokenTracker = useRef({});

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [lastNarration, setLastNarration] = useState('Descriptive voiceover will play at choreographic moments.');
  const [videoDuration, setVideoDuration] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get(`/public/${slug}/audio?lang=${language}`);
        if (res.data.success) {
          setData(res.data);
        }
      } catch (err) {
        console.warn('Error fetching audio mode data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [slug, language]);

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const t = videoRef.current.currentTime;
    setCurrentTime(t);

    // Check if any accessibility description matches current time
    if (data?.accessibilityDescriptions && audioNarrationEnabled) {
      data.accessibilityDescriptions.forEach(desc => {
        if (Math.abs(t - desc.timestamp) < 0.4 && !spokenTracker.current[desc.id]) {
          spokenTracker.current[desc.id] = true;
          const textToSpeak = desc.text?.[language] || desc.text?.english;
          if (textToSpeak) {
            setLastNarration(textToSpeak);
            speakText(textToSpeak, language);
          }
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

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center text-xs text-gray-400 font-mono">
        <Headphones className="w-5 h-5 text-emerald-400 animate-spin mr-2" />
        Loading Audio Accessibility Mode...
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

        <ModeBadge mode="audio" size="lg" />

        {/* Language selector */}
        <div className="flex items-center gap-1 text-[11px]">
          {['bengali', 'hindi', 'english'].map(l => (
            <button
              key={l}
              onClick={() => {
                setLanguage(l);
                spokenTracker.current = {}; // reset tracker
              }}
              className={`px-2 py-1 rounded capitalize font-medium ${
                language === l ? 'bg-emerald-600 text-white font-bold' : 'bg-surface text-gray-400'
              }`}
            >
              {l === 'bengali' ? 'বাংলা' : l === 'hindi' ? 'हिन्दी' : 'EN'}
            </button>
          ))}
        </div>
      </div>

      {/* Video & Synchronized Voiceover Display */}
      <div className="relative rounded-3xl overflow-hidden bg-black aspect-video border border-emerald-500/30 shadow-2xl">
        <video
          ref={videoRef}
          src={data?.videoUrl}
          onTimeUpdate={handleTimeUpdate}
          onEnded={() => setIsPlaying(false)}
          onLoadedMetadata={() => setVideoDuration(videoRef.current?.duration || 0)}
          className="w-full h-full object-contain"
        />

        {/* Narration Subtitle Banner */}
        <div className="absolute bottom-4 inset-x-4 pointer-events-none text-center">
          <div className="inline-block px-4 py-2 rounded-xl bg-black/85 backdrop-blur-md text-emerald-300 border border-emerald-500/40 text-xs sm:text-sm font-semibold max-w-xl">
            🎙️ "{lastNarration}"
          </div>
        </div>
      </div>

      {/* Audio & Narration Controls */}
      <div className="glass-panel p-5 rounded-2xl border border-gray-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={togglePlay}
              className="w-10 h-10 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center transition-all"
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-white" />}
            </button>
            <span className="font-mono text-xs text-gray-300">
              {Math.floor(currentTime / 60)}:{(currentTime % 60).toFixed(1).padStart(4, '0')}s
            </span>
          </div>

          <button
            onClick={() => {
              spokenTracker.current = {};
              if (videoRef.current) videoRef.current.currentTime = 0;
            }}
            className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800"
            title="Rewind to start"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Narration Volume Slider */}
        <div className="pt-2 border-t border-gray-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-gray-300 font-semibold">
            <Volume2 className="w-4 h-4 text-emerald-400" />
            <span>Descriptive Narration Volume</span>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={narrationVolume}
              onChange={(e) => setNarrationVolume(parseFloat(e.target.value))}
              className="w-32 accent-emerald-500 cursor-pointer"
            />
            <span className="font-mono text-xs text-emerald-400 font-bold w-10 text-right">
              {Math.round(narrationVolume * 100)}%
            </span>
          </div>
        </div>
      </div>

      {/* Narration Cues — Dynamic Timeline */}
      <div className="glass-panel p-5 rounded-2xl border border-gray-800 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
            Approved Descriptive Narrations
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
                className="absolute top-0 bottom-0 w-0.5 bg-emerald-400 z-20 transition-all"
                style={{ left: `${(currentTime / videoDuration) * 100}%` }}
              >
                <div className="w-2 h-2 rounded-full bg-emerald-400 -ml-[3px] -mt-0.5" />
              </div>

              {/* Narration blocks */}
              {data?.accessibilityDescriptions?.map(desc => {
                const leftPct = (desc.timestamp / videoDuration) * 100;
                const widthPct = ((desc.duration || 4) / videoDuration) * 100;
                const isActive = Math.abs(currentTime - desc.timestamp) < (desc.duration || 4);
                return (
                  <div
                    key={desc.id}
                    onClick={() => {
                      if (videoRef.current) {
                        videoRef.current.currentTime = desc.timestamp;
                        spokenTracker.current[desc.id] = false;
                      }
                    }}
                    title={`${desc.timestamp}s • ${desc.style} • ${desc.text?.english || ''}`}
                    className={`absolute top-5 h-8 rounded px-1.5 text-[9px] font-mono cursor-pointer border truncate flex items-center transition-all ${
                      isActive
                        ? 'bg-emerald-700 border-emerald-400 text-white z-10'
                        : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-emerald-500 hover:text-white'
                    }`}
                    style={{
                      left: `${leftPct}%`,
                      width: `${widthPct}%`,
                      minWidth: '40px'
                    }}
                  >
                    {desc.style || ''}
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

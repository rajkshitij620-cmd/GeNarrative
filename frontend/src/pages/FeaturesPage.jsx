import React from 'react';
import { Eye, Headphones, Activity, Sliders, CheckCircle2, ShieldCheck, Zap, Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import ModeBadge from '../components/common/ModeBadge';

export default function FeaturesPage() {
  const modes = [
    {
      id: 'visual',
      title: 'Mode 1: Visual Mode',
      subtitle: 'For Deaf & Hard-of-Hearing Audiences',
      badge: 'visual',
      icon: Eye,
      color: 'text-cyan-400',
      border: 'border-cyan-500/30',
      bgGlow: 'from-cyan-950/20 to-transparent',
      features: [
        'Multilingual synchronized captions in Bengali, Hindi, and English.',
        'Real-time sound event cues (e.g., "[Ghungroo crescendo]", "[Tabla Sam strike]").',
        'Key choreographic mudra indicators and movement subtitles.',
        'High-contrast mode and customizable typography size (Normal, Large, Extra-Large).',
        'Subtle, non-distracting background scrim to ensure 100% legibility over any stage lighting.'
      ]
    },
    {
      id: 'audio',
      title: 'Mode 2: Audio Mode',
      subtitle: 'For Blind & Low-Vision Audiences',
      badge: 'audio',
      icon: Headphones,
      color: 'text-emerald-400',
      border: 'border-emerald-500/30',
      bgGlow: 'from-emerald-950/20 to-transparent',
      features: [
        'Artist-approved descriptive narration of gestures, mudras, expressions, and lighting.',
        'Non-intrusive timing: narration is timed during natural musical pauses without masking melodies.',
        'Web Speech API narration engine with natural language cadence for Bengali, Hindi, and English.',
        'Independent volume slider to balance descriptive voiceover with the live performance acoustics.',
        'Instant pause, resume, and timeline seek synchronization.'
      ]
    },
    {
      id: 'haptic',
      title: 'Mode 3: Haptic Mode',
      subtitle: 'Tactile Rhythm for Sensory Immersion',
      badge: 'haptic',
      icon: Activity,
      color: 'text-amber-400',
      border: 'border-amber-500/30',
      bgGlow: 'from-amber-950/20 to-transparent',
      features: [
        'Physical smartphone vibration playback using browser Web Vibration API.',
        'Artist-customizable vibration patterns (e.g., Tatkar Foot Stamping: [100ms, 50ms, 100ms]).',
        'Configurable tactile intensity multiplier (0.5x to 1.5x) to match user preference.',
        'Graceful visual tactile pulse fallback for iOS and devices lacking physical vibration motors.',
        'Wearable integration architecture for future Bluetooth haptic vests and wristbands.'
      ]
    },
    {
      id: 'artist',
      title: 'Mode 4: Artist Studio (Flagship)',
      subtitle: 'The Central USP: Artist In The Loop',
      badge: 'artist',
      icon: Sliders,
      color: 'text-violet-400',
      border: 'border-violet-500/30',
      bgGlow: 'from-violet-950/20 to-transparent',
      features: [
        'Interactive 5-track video-editing timeline (Captions, Movement, Scene, Sound, Haptics).',
        'Switch AI description styles on demand between Literal, Poetic, and Minimal.',
        'Protected Elements Section ("Elements AI Must Never Alter") to preserve cultural mudras.',
        'Approve or reject individual AI proposals or batch-approve the whole performance.',
        'Real-time modal preview of all three audience modes before committing to publication.'
      ]
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16 relative">
      {/* Ambient background spotlight */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[650px] h-[300px] bg-cyan-500/10 blur-[150px] rounded-full pointer-events-none"></div>

      <div className="text-center max-w-3xl mx-auto space-y-4 relative z-10">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-violet-500/15 text-violet-300 border border-violet-500/30">
          <Sparkles className="w-3.5 h-3.5 text-violet-400" />
          <span>Product Capabilities</span>
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
          The Four Accessibility <span className="text-gradient-primary">Modes</span>
        </h1>
        <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
          One original master performance transformed into four synchronized sensory modalities without touching the master recording.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
        {modes.map((m) => {
          const Icon = m.icon;
          return (
            <div
              key={m.id}
              id={m.id}
              className={`glass-panel p-8 rounded-3xl border ${m.border} bg-gradient-to-b ${m.bgGlow} space-y-6 flex flex-col justify-between hover:scale-[1.01] transition-transform duration-300`}
            >
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-[#0D0F17] border border-white/10 flex items-center justify-center">
                    <Icon className={`w-6 h-6 ${m.color}`} />
                  </div>
                  <ModeBadge mode={m.badge} size="lg" />
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white">{m.title}</h3>
                  <p className="text-xs text-gray-400 font-mono mt-0.5">{m.subtitle}</p>
                </div>

                <ul className="space-y-3 text-xs sm:text-sm text-gray-300">
                  {m.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <CheckCircle2 className={`w-4 h-4 ${m.color} shrink-0 mt-0.5`} />
                      <span className="leading-relaxed">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 border-t border-white/[0.08]">
                {m.id === 'artist' ? (
                  <Link
                    to="/artist/upload"
                    className="inline-flex items-center gap-1.5 text-xs text-violet-400 hover:text-violet-300 font-semibold"
                  >
                    <span>Upload & Author in Artist Studio</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                ) : (
                  <Link
                    to="/audience/dashboard"
                    className="inline-flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 font-semibold"
                  >
                    <span>Access in Audience Portal</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

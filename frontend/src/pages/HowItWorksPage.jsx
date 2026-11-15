import React from 'react';
import { Link } from 'react-router-dom';
import { Upload, Cpu, Sliders, QrCode, Shield, CheckCircle2, ArrowRight, Sparkles, Layers, Eye, Activity } from 'lucide-react';

export default function HowItWorksPage() {
  const steps = [
    {
      num: '01',
      title: 'Performance Video Ingestion & Preservation',
      subtitle: 'Zero Master Alteration Policy',
      desc: 'Artists upload their original high-definition stage recording (MP4/MOV). We extract technical duration, frame boundaries, and acoustic parameters without modifying the audio or visual data in any way.',
      icon: Upload,
      accent: 'border-violet-500/30 text-violet-400 bg-violet-500/10'
    },
    {
      num: '02',
      title: 'Multimodal AI Understanding Pipeline',
      subtitle: 'FastAPI + Whisper + MediaPipe + Librosa + Gemini',
      desc: 'Our Python microservice extracts speech transcripts in Bengali, Hindi, and English; estimates human pose landmarks and mudras; detects scene illumination boundaries; maps acoustic beat intensity; and drafts proposed descriptive narrations.',
      icon: Cpu,
      accent: 'border-cyan-500/30 text-cyan-400 bg-cyan-500/10'
    },
    {
      num: '03',
      title: 'Artist Control Studio (USP)',
      subtitle: 'AI Proposes. The Artist Approves.',
      desc: 'In the flagship studio workspace, artists scrub through a 5-track synchronized creative timeline. They review AI proposals, switch description styles (Literal, Poetic, Minimal), design tactile vibration patterns, and approve or reject every single cue.',
      icon: Sliders,
      accent: 'border-indigo-500/30 text-indigo-400 bg-indigo-500/10'
    },
    {
      num: '04',
      title: 'Instant QR Distribution to Audience',
      subtitle: 'Zero Login, Frictionless Inclusion',
      desc: 'Once the timeline is approved, the artist publishes the performance. A high-resolution QR code is dynamically rendered for concert programs, posters, and venue seats. Patrons simply scan and choose their accessibility experience.',
      icon: QrCode,
      accent: 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16 relative">
      {/* Ambient backdrop */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-violet-600/10 blur-[150px] rounded-full pointer-events-none"></div>

      <div className="text-center max-w-3xl mx-auto space-y-4 relative z-10">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-violet-500/15 text-violet-300 border border-violet-500/30">
          <Sparkles className="w-3.5 h-3.5 text-violet-400" />
          <span>Architecture & Methodology</span>
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
          How RASA CUE Transforms <span className="text-gradient-primary">Accessibility</span>
        </h1>
        <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
          A synchronized derived-content architecture that bridges human artistic intention with multimodal assistive intelligence.
        </p>
      </div>

      <div className="space-y-6 relative z-10">
        {steps.map((s, idx) => {
          const Icon = s.icon;
          return (
            <div
              key={idx}
              className="glass-panel p-8 rounded-3xl border border-white/[0.08] hover:border-white/[0.18] transition-all relative overflow-hidden flex flex-col md:flex-row gap-6 items-start group"
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border ${s.accent}`}>
                <Icon className="w-7 h-7" />
              </div>
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-xs font-mono font-bold text-gray-400">{s.num}</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-white/[0.04] text-gray-300 font-mono border border-white/10">
                    {s.subtitle}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white group-hover:text-violet-300 transition-colors">{s.title}</h3>
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed max-w-3xl">{s.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-8 sm:p-10 rounded-3xl glass-panel-elevated border border-violet-500/30 text-center space-y-4 relative z-10">
        <h2 className="text-2xl sm:text-3xl font-bold text-white">Ready to Author Accessible Performances?</h2>
        <p className="text-xs sm:text-sm text-gray-300 max-w-xl mx-auto">
          Sign up as an artist to upload original performance masters and generate synchronized multimodal accessibility cues.
        </p>
        <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/register?role=artist"
            className="btn-shimmer inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-lg shadow-violet-600/30 transition-all hover:scale-[1.02]"
          >
            <Sliders className="w-4 h-4" />
            <span>Open Artist Studio Account</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            to="/register?role=audience"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl glass-panel border border-white/[0.12] hover:bg-white/[0.06] text-white font-semibold text-xs transition-all"
          >
            <Eye className="w-4 h-4 text-cyan-400" />
            <span>Join as Audience Member</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
